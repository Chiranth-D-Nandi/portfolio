
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',      // Local dev
  'http://localhost:3000',      // Alternative local dev
  'https://portfolio-teub.onrender.com', // Production backend
  'https://chiranth-nandi.vercel.app'    // Production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, uptime monitors)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('github.io') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    // Permissive fallback so cross-origin calls never crash with 500
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

// ===== HEALTH CHECK ENDPOINT =====
// For UptimeRobot monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Email delivery setup (Resend via HTTPS on Port 443 + Nodemailer fallback)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '120hertzyt@gmail.com';

let transporter = null;
if (process.env.RESUME_EMAIL && process.env.RESUME_EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.RESUME_EMAIL,
      pass: process.env.RESUME_EMAIL_PASSWORD,
    },
  });
  console.log('Nodemailer configured for fallback resume emails');
}

async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (apiKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || RESEND_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Resend error: ${res.statusText}`);
    }
    return data;
  } else if (transporter) {
    return await transporter.sendMail({
      from: process.env.RESUME_EMAIL,
      to,
      subject,
      html,
      text,
    });
  } else {
    throw new Error('No email service configured (set RESEND_API_KEY in environment variables)');
  }
}

// Rate limiting map: client IP -> array of request timestamps within the last hour
const resumeRateLimitMap = new Map();

function checkResumeRateLimit(ip) {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const MAX_REQUESTS = 3;

  const timestamps = resumeRateLimitMap.get(ip) || [];
  // Keep only timestamps within the last 60 minutes
  const recent = timestamps.filter(t => now - t < ONE_HOUR);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0];
    const minutesRemaining = Math.max(1, Math.ceil((ONE_HOUR - (now - oldest)) / (60 * 1000)));
    return {
      allowed: false,
      minutesRemaining,
    };
  }

  recent.push(now);
  resumeRateLimitMap.set(ip, recent);

  // Periodic memory cleanup
  if (resumeRateLimitMap.size > 5000) {
    for (const [key, times] of resumeRateLimitMap.entries()) {
      const active = times.filter(t => now - t < ONE_HOUR);
      if (active.length === 0) resumeRateLimitMap.delete(key);
      else resumeRateLimitMap.set(key, active);
    }
  }

  return { allowed: true };
}

// Storage for likes: MongoDB if MONGODB_URI is provided and connected, otherwise local file fallback
const likesFile = path.join(process.cwd(), 'likes.json');

async function readLikesFile() {
  try {
    const txt = await fs.readFile(likesFile, 'utf-8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    return {};
  }
}

async function writeLikesFile(data) {
  try {
    await fs.writeFile(likesFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write likes file:', e.message);
  }
}

// Define Mongoose Like schema & model
const likeSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});
const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  }).then(() => {
    console.log('✓ Successfully connected to MongoDB for persistent likes');
  }).catch((err) => {
    console.error('MongoDB connection error (falling back to file storage):', err.message);
  });
} else {
  console.log('Notice: MONGODB_URI not configured — using file storage for likes.');
}

// Likes endpoints (automatic MongoDB / File fallback)
app.get('/api/likes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const doc = await Like.findOne({ projectId });
      return res.json({ likes: doc ? doc.count : 0 });
    }
    const data = await readLikesFile();
    res.json({ likes: data[projectId] || 0 });
  } catch (error) {
    console.error('GET likes error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/likes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const doc = await Like.findOneAndUpdate(
        { projectId },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      console.log(`Like added for ${projectId} in MongoDB, new count: ${doc.count}`);
      return res.json({ likes: doc.count });
    }
    const data = await readLikesFile();
    data[projectId] = (data[projectId] || 0) + 1;
    await writeLikesFile(data);
    console.log(`Like added for ${projectId} in file, new count: ${data[projectId]}`);
    res.json({ likes: data[projectId] });
  } catch (error) {
    console.error('POST likes error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/likes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    if (mongoose.connection.readyState === 1) {
      let doc = await Like.findOne({ projectId });
      if (doc && doc.count > 0) {
        doc.count -= 1;
        await doc.save();
      }
      return res.json({ likes: doc ? doc.count : 0 });
    }
    const data = await readLikesFile();
    data[projectId] = Math.max(0, (data[projectId] || 0) - 1);
    await writeLikesFile(data);
    res.json({ likes: data[projectId] });
  } catch (error) {
    console.error('DELETE likes error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== RESUME REQUEST ROUTES =====

// POST: Handle resume request submission
app.post('/api/resume-request', async (req, res) => {
  try {
    const { email, name, reason, companyName, otherReason } = req.body;

    // Rate limiting check by client IP (max 3 requests per 1 hour)
    const clientIp = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : req.socket.remoteAddress || req.ip;

    const rateLimit = checkResumeRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: `Rate limit reached: You can submit up to 3 resume requests per hour from this IP. Please try again in ${rateLimit.minutesRemaining} minutes.`
      });
    }

    // Validation
    if (!email || !name || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build reason display text
    let reasonText = reason;
    if (reason === 'Employer' && companyName) {
      reasonText = `Employer (${companyName})`;
    } else if (reason === 'Others' && otherReason) {
      reasonText = `Others (${otherReason})`;
    }

    // Build personalized greeting
    let greeting = `Hello ${name},`;
    if (reason === 'Employer') {
      greeting = companyName && companyName.trim()
        ? `Hello ${name} from ${companyName.trim()},`
        : `Hello ${name},`;
    } else if (reason === 'Professor') {
      greeting = `Hello Prof. ${name},`;
    }

    const baseUrl = process.env.BASE_URL || 'https://portfolio-teub.onrender.com';
    const resumeLink = process.env.RESUME_DRIVE_LINK || 'https://drive.google.com/drive/folders/1zfwM_A91dpm6pUH_rUOugIz9_Gnbzsak?usp=sharing';

    const emailSubject = `Resume - Chiranth D Nandi`;
    const emailBody = `${greeting}\n\nThank you for reaching out and for your interest in my profile!\n\nYou can access and view my latest resume in this folder:\n${resumeLink}\n\nPlease feel free to let me know if you would like to discuss any opportunities or projects.\n\nBest regards,\nChiranth D Nandi\nCSE(AIML) at PES University, Bengaluru\nLinkedIn: https://www.linkedin.com/in/chiranth-nandi\nGitHub: https://github.com/Chiranth-D-Nandi`;

    // Gmail web compose URL (opens Gmail tab ready to send) & mailto URL (for mobile app)
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    const acceptLink = `${baseUrl}/api/resume/accept?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&reason=${encodeURIComponent(reason)}&companyName=${encodeURIComponent(companyName || '')}`;
    const rejectLink = `${baseUrl}/api/resume/reject?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

    // Email to admin with 1-click Gmail approve buttons
    const adminEmail = process.env.ADMIN_EMAIL || '120hertzyt@gmail.com';
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #1e1b4b; margin-top: 0; margin-bottom: 20px;">📄 New Resume Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;"><strong>Email:</strong></td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;"><strong>Reason:</strong></td>
            <td style="padding: 10px 0; color: #0f172a;">${reasonText}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;"><strong>Submitted At:</strong></td>
            <td style="padding: 10px 0; color: #64748b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin-bottom: 14px; font-weight: bold; color: #1e1b4b; font-size: 15px;">Approve & Send via Gmail (from 120hertzyt@gmail.com):</p>
          <div style="margin-bottom: 16px;">
            <a href="${gmailWebUrl}" target="_blank" style="display: inline-block; padding: 12px 22px; margin-right: 10px; margin-bottom: 10px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✓ Approve & Open Gmail Web
            </a>
            <a href="${mailtoUrl}" style="display: inline-block; padding: 12px 22px; margin-right: 10px; margin-bottom: 10px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✉ Open in Gmail App (Mobile)
            </a>
            <a href="${rejectLink}" style="display: inline-block; padding: 12px 20px; margin-bottom: 10px; background-color: #64748b; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✕ Reject
            </a>
          </div>

          <div style="padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 14px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #334155;">Pre-filled Reply Preview:</p>
            <div style="font-size: 13px; color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-family: monospace; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e1;">${emailBody}</div>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `Resume Request from ${name}`,
      html: adminHtml,
    });
    console.log(`Resume request email sent to admin for: ${name} (${email})`);

    res.json({ success: true, message: 'Resume request submitted! Admin will review shortly.' });
  } catch (error) {
    console.error('Resume request error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Accept and send resume
app.get('/api/resume/accept', async (req, res) => {
  try {
    const { email, name, reason, companyName } = req.query;

    if (!email || !name) {
      return res.status(400).send('<h2>Missing email or name</h2>');
    }

    const resumeLink = process.env.RESUME_DRIVE_LINK || 'https://drive.google.com/drive/folders/1zfwM_A91dpm6pUH_rUOugIz9_Gnbzsak?usp=sharing';

    let greeting = `Hello ${name},`;
    if (reason === 'Employer') {
      greeting = companyName && companyName.trim()
        ? `Hello ${name} from ${companyName.trim()},`
        : `Hello ${name},`;
    } else if (reason === 'Professor') {
      greeting = `Hello Prof. ${name},`;
    }

    const emailSubject = `Resume - Chiranth D Nandi`;
    const emailBody = `${greeting}\n\nThank you for reaching out and for your interest in my profile!\n\nYou can access and view my latest resume in this folder:\n${resumeLink}\n\nPlease feel free to let me know if you would like to discuss any opportunities or projects.\n\nBest regards,\nChiranth D Nandi\nCSE(AIML) at PES University, Bengaluru\nLinkedIn: https://www.linkedin.com/in/chiranth-nandi\nGitHub: https://github.com/Chiranth-D-Nandi`;

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Redirect directly to Gmail compose window
    res.redirect(gmailWebUrl);
  } catch (error) {
    console.error('Resume accept error:', error);
    res.status(500).send(`<h2>Error handling request</h2><p>${error.message}</p>`);
  }
});

// GET: Reject resume request (acknowledge rejection)
app.get('/api/resume/reject', async (req, res) => {
  try {
    const { email, name } = req.query;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Request Rejected</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070111; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #130b24; border: 1px solid #332252; border-radius: 12px; padding: 36px; max-width: 500px; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
          h2 { color: #ef4444; margin-top: 0; }
          p { color: #cbd5e1; line-height: 1.6; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 16px; background: #22153d; color: #a06ee1; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Portfolio Admin</div>
          <h2>✕ Request Rejected</h2>
          <p>Resume request for <strong>${name || 'user'}</strong> (${email || ''}) was rejected. No emails were sent.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Resume rejection error:', error);
    res.status(500).send(`<h2>Error handling request</h2><p>${error.message}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


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

// Choose storage: MongoDB if MONGODB_URI is set, otherwise a simple file fallback
const likesFile = path.join(process.cwd(), 'likes.json');

async function readLikesFile() {
  try {
    const txt = await fs.readFile(likesFile, 'utf-8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    // if file missing or invalid, return empty object
    return {};
  }
}

async function writeLikesFile(data) {
  await fs.writeFile(likesFile, JSON.stringify(data, null, 2), 'utf-8');
}

if (process.env.MONGODB_URI) {
  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  const likeSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  });

  const Like = mongoose.model('Like', likeSchema);

  // Mongo-backed routes
  app.get('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      let like = await Like.findOne({ projectId });
      res.json({ likes: like ? like.count : 0 });
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      let like = await Like.findOneAndUpdate(
        { projectId },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      console.log(`Like added for ${projectId}, new count: ${like.count}`);
      res.json({ likes: like.count });
    } catch (error) {
      console.error('POST error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      let like = await Like.findOne({ projectId });
      if (like && like.count > 0) {
        like.count -= 1;
        await like.save();
      }
      console.log(`Like removed for ${projectId}, new count: ${like ? like.count : 0}`);
      res.json({ likes: like ? like.count : 0 });
    } catch (error) {
      console.error('DELETE error:', error);
      res.status(500).json({ error: error.message });
    }
  });

} else {
  // File-backed routes (development fallback)
  console.log('No MONGODB_URI found — using file-backed likes storage:', likesFile);

  app.get('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const data = await readLikesFile();
      const count = data[projectId] || 0;
      res.json({ likes: count });
    } catch (error) {
      console.error('GET file error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const data = await readLikesFile();
      data[projectId] = (data[projectId] || 0) + 1;
      await writeLikesFile(data);
      console.log(`File like added for ${projectId}, new count: ${data[projectId]}`);
      res.json({ likes: data[projectId] });
    } catch (error) {
      console.error('POST file error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/likes/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const data = await readLikesFile();
      data[projectId] = Math.max(0, (data[projectId] || 0) - 1);
      await writeLikesFile(data);
      console.log(`File like removed for ${projectId}, new count: ${data[projectId]}`);
      res.json({ likes: data[projectId] });
    } catch (error) {
      console.error('DELETE file error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

// ===== RESUME REQUEST ROUTES =====

// POST: Handle resume request submission
app.post('/api/resume-request', async (req, res) => {
  try {
    const { email, name, reason, companyName, otherReason } = req.body;

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

    // Build accept/reject links
    const baseUrl = process.env.BASE_URL || 'https://portfolio-teub.onrender.com';
    const resumeLink = process.env.RESUME_DRIVE_LINK || 'https://drive.google.com/file/d/18lzjQhipGMAuJezl8JeUp5VMTwlR6d_f/view?usp=drive_link';
    const acceptLink = `${baseUrl}/api/resume/accept?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&reason=${encodeURIComponent(reasonText)}`;
    const rejectLink = `${baseUrl}/api/resume/reject?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    const mailtoReply = `mailto:${encodeURIComponent(email)}?subject=Chiranth%20D%20Nandi%20-%20Resume&body=Hi%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest!%20You%20can%20access%20my%20resume%20here%3A%0A${encodeURIComponent(resumeLink)}%0A%0ABest%20regards%2C%0AChiranth%20D%20Nandi`;

    // Email to admin with accept/reject buttons and direct Gmail reply
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
          <p style="margin-bottom: 14px; font-weight: bold; color: #1e1b4b;">Actions:</p>
          <div>
            <a href="${acceptLink}" style="display: inline-block; padding: 12px 20px; margin-right: 10px; margin-bottom: 10px; background-color: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✓ Accept & Send Resume
            </a>
            <a href="${mailtoReply}" style="display: inline-block; padding: 12px 20px; margin-right: 10px; margin-bottom: 10px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✉ Reply via Gmail
            </a>
            <a href="${rejectLink}" style="display: inline-block; padding: 12px 20px; margin-bottom: 10px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
              ✕ Reject
            </a>
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
    const { email, name, reason } = req.query;

    if (!email || !name) {
      return res.status(400).send('<h2>Missing email or name</h2>');
    }

    const resumeLink = process.env.RESUME_DRIVE_LINK || 'https://drive.google.com/file/d/18lzjQhipGMAuJezl8JeUp5VMTwlR6d_f/view?usp=drive_link';
    const mailtoReply = `mailto:${encodeURIComponent(email)}?subject=Chiranth%20D%20Nandi%20-%20Resume&body=Hi%20${encodeURIComponent(name)}%2C%0A%0AThank%20you%20for%20your%20interest!%20You%20can%20access%20my%20resume%20here%3A%0A${encodeURIComponent(resumeLink)}%0A%0ABest%20regards%2C%0AChiranth%20D%20Nandi`;

    let directSendSuccess = false;
    let sendErrorNotice = '';

    try {
      await sendEmail({
        to: email,
        subject: 'Resume from Chiranth D Nandi',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #1e1b4b; margin-top: 0;">Hello ${name}!</h2>
            <p style="color: #334155; line-height: 1.6;">Thank you for your interest in my background and work.</p>
            <p style="color: #334155; line-height: 1.6;">You can view and download my latest resume via Google Drive below:</p>
            <p style="margin: 28px 0;">
              <a href="${resumeLink}" style="display: inline-block; padding: 14px 28px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">
                Download Resume from Google Drive
              </a>
            </p>
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">Feel free to reply directly to this email or connect with me on LinkedIn.</p>
            <br/>
            <p style="color: #334155; margin: 0;">Best regards,<br/><strong>Chiranth D Nandi</strong><br/>
            <a href="https://www.linkedin.com/in/chiranth-nandi" style="color: #6366f1;">LinkedIn Profile</a> | <a href="https://github.com/Chiranth-D-Nandi" style="color: #6366f1;">GitHub</a>
            </p>
          </div>
        `,
      });
      directSendSuccess = true;
      console.log(`Resume link sent to: ${email}`);
    } catch (err) {
      console.warn(`Could not send directly to ${email} via Resend:`, err.message);
      sendErrorNotice = err.message;
    }

    // Send confirmation to admin
    const adminEmail = process.env.ADMIN_EMAIL || '120hertzyt@gmail.com';
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Resume Request Processed - ${name}`,
        html: `<p>Resume request for <strong>${name}</strong> (${email}) has been marked as accepted.</p>${directSendSuccess ? '<p>Email was sent automatically to requester.</p>' : `<p>Note: Automated delivery was skipped (${sendErrorNotice}). You can use Gmail to reply directly.</p>`}`,
      });
    } catch (adminErr) {
      console.warn('Could not send confirmation to admin:', adminErr.message);
    }

    // Return friendly HTML status page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Resume Request Accepted</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070111; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #130b24; border: 1px solid #332252; border-radius: 12px; padding: 36px; max-width: 520px; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
          h2 { color: #10b981; margin-top: 0; }
          p { color: #cbd5e1; line-height: 1.6; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 8px; }
          .btn-primary { background: #6366f1; color: white; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-bottom: 16px; background: #22153d; color: #a06ee1; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Portfolio Admin</div>
          <h2>✓ Request Accepted</h2>
          <p>Request from <strong>${name}</strong> (<a href="mailto:${email}" style="color: #a06ee1;">${email}</a>) was processed.</p>
          ${directSendSuccess 
            ? `<p style="color: #10b981; font-weight: 600;">✓ Automated email with resume link was sent to <strong>${email}</strong>.</p>`
            : `<div style="background: rgba(245, 158, 11, 0.12); border: 1px solid #f59e0b; border-radius: 8px; padding: 14px; margin: 20px 0; text-align: left;">
                <p style="margin: 0; color: #fbbf24; font-size: 13px;"><strong>Notice:</strong> Resend test domain only delivers to account owner. Click below to send directly via Gmail:</p>
               </div>
               <a href="${mailtoReply}" class="btn btn-primary">✉ Open Gmail to Send Resume</a>`
          }
        </div>
      </body>
      </html>
    `);
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

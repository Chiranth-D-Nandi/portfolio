
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',      // Local dev
  'http://localhost:3000',      // Alternative local dev
  'https://portfolio-teub.onrender.com', // Production
  'https://chiranth-nandi.vercel.app/'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Nodemailer setup (for sending resume emails)
let transporter = null;

if (process.env.RESUME_EMAIL && process.env.RESUME_EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.RESUME_EMAIL,
      pass: process.env.RESUME_EMAIL_PASSWORD,
    },
  });
  console.log('Nodemailer configured for resume emails');
} else {
  console.log('Warning: RESUME_EMAIL and RESUME_EMAIL_PASSWORD not set. Resume sending disabled.');
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
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const acceptLink = `${baseUrl}/api/resume/accept?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&reason=${encodeURIComponent(reasonText)}`;
    const rejectLink = `${baseUrl}/api/resume/reject?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

    // Email to admin with accept/reject buttons
    const adminEmail = 'chiranth.nandi@gmail.com';
    const adminMailOptions = {
      from: process.env.RESUME_EMAIL || 'noreply@portfolio.com',
      to: adminEmail,
      subject: `Resume Request from ${name}`,
      html: `
        <h2>New Resume Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason for Request:</strong> ${reasonText}</p>
        <br/>
        <p><strong>Actions:</strong></p>
        <a href="${acceptLink}" style="display:inline-block;padding:10px 20px;margin-right:10px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
          ACCEPT & SEND RESUME
        </a>
        <a href="${rejectLink}" style="display:inline-block;padding:10px 20px;background-color:#f44336;color:white;text-decoration:none;border-radius:5px;">
          REJECT REQUEST
        </a>
      `,
    };

    if (transporter) {
      await transporter.sendMail(adminMailOptions);
      console.log(`Resume request email sent to admin for: ${name} (${email})`);
    } else {
      console.log('Transporter not configured, request would have been:', adminMailOptions);
    }

    res.json({ success: true, message: 'Resume request submitted. Admin will review shortly.' });
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
      return res.status(400).json({ error: 'Missing email or name' });
    }

    // Read resume file from server/resume/ folder
    const resumePath = path.join(process.cwd(), 'resume/chiranth_cv.pdf');
    const resumeFile = await fs.readFile(resumePath);

    // Send resume to requester
    const resumeMailOptions = {
      from: process.env.RESUME_EMAIL || 'noreply@portfolio.com',
      to: email,
      subject: 'Your Requested Resume',
      html: `
        <h2>Hello ${name}!</h2>
        <p>Thank you for your interest. Please find the resume attached.</p>
        <p>Best regards,<br/>Chiranth</p>
      `,
      attachments: [
        {
          filename: 'chiranth_cv.pdf',
          content: resumeFile,
        },
      ],
    };

    if (transporter) {
      await transporter.sendMail(resumeMailOptions);
      console.log(`Resume sent to: ${email}`);
    }

    // Send confirmation to admin
    const confirmationMailOptions = {
      from: process.env.RESUME_EMAIL || 'noreply@portfolio.com',
      to: 'chiranth.nandi@gmail.com',
      subject: `Resume Sent - ${name}`,
      html: `<p>Resume has been sent to <strong>${email}</strong> for reason: <strong>${reason}</strong></p>`,
    };

    if (transporter) {
      await transporter.sendMail(confirmationMailOptions);
    }

    res.json({ success: true, message: 'Resume sent successfully!' });
  } catch (error) {
    console.error('Resume send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Reject resume request (no action needed - just forget it)
app.get('/api/resume/reject', async (req, res) => {
  try {
    const { email, name } = req.query;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing email or name' });
    }

    // Simply acknowledge rejection, no emails or logging
    res.json({ success: true, message: 'Request rejected.' });
  } catch (error) {
    console.error('Resume rejection error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

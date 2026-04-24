
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, year, university } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ name, email, password, year, university });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        university: user.university
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        university: user.university
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add bookmark
router.post('/:userId/bookmarks', async (req, res) => {
  try {
    const { type, itemId, note } = req.body;
    const user = await User.findById(req.params.userId);
    
    user.bookmarks.push({ type, itemId, note });
    await user.save();
    
    res.json({ message: 'Bookmark added', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user bookmarks
router.get('/:userId/bookmarks', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update note
router.post('/:userId/notes', async (req, res) => {
  try {
    const { type, itemId, content } = req.body;
    const user = await User.findById(req.params.userId);
    
    const existingNote = user.notes.find(n => n.itemId.toString() === itemId && n.type === type);
    if (existingNote) {
      existingNote.content = content;
      existingNote.updatedAt = new Date();
    } else {
      user.notes.push({ type, itemId, content });
    }
    
    await user.save();
    res.json({ message: 'Note saved', notes: user.notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


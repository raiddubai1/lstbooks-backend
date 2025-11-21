import express from 'express';
import RevisionNote from '../models/RevisionNote.js';
import { auth, isTeacher, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all revision notes (public)
router.get('/', async (req, res) => {
  try {
    const { subject, year, category, difficulty, search, sort = '-createdAt', limit = 50 } = req.query;
    
    const query = { isPublic: true };
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const notes = await RevisionNote.find(query)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .sort(sort)
      .limit(parseInt(limit));
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single revision note by ID
router.get('/:id', async (req, res) => {
  try {
    const note = await RevisionNote.findById(req.params.id)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .populate('ratings.user', 'name');
    
    if (!note) {
      return res.status(404).json({ error: 'Revision note not found' });
    }
    
    // Increment views
    note.views += 1;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create revision note (teachers/admins only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const note = new RevisionNote({
      ...req.body,
      createdBy: req.user.userId
    });
    
    await note.save();
    await note.populate('subject', 'name');
    await note.populate('createdBy', 'name');
    
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update revision note (teachers/admins only)
router.put('/:id', auth, isTeacher, async (req, res) => {
  try {
    const note = await RevisionNote.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Revision note not found' });
    }
    
    // Check if user is the creator or admin
    if (note.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }
    
    Object.assign(note, req.body);
    await note.save();
    await note.populate('subject', 'name');
    await note.populate('createdBy', 'name');
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete revision note (admins only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const note = await RevisionNote.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Revision note not found' });
    }
    
    res.json({ message: 'Revision note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to revision note (authenticated users)
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const note = await RevisionNote.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ error: 'Revision note not found' });
    }
    
    // Check if user already rated
    const existingRatingIndex = note.ratings.findIndex(
      r => r.user.toString() === req.user.userId
    );
    
    if (existingRatingIndex > -1) {
      // Update existing rating
      note.ratings[existingRatingIndex].rating = rating;
      note.ratings[existingRatingIndex].comment = comment;
    } else {
      // Add new rating
      note.ratings.push({
        user: req.user.userId,
        rating,
        comment
      });
    }
    
    await note.save();
    await note.populate('ratings.user', 'name');
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


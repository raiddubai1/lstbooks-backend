import express from 'express';
import Note from '../models/Note.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all notes for current user
router.get('/my-notes', authenticate, async (req, res) => {
  try {
    const { subjectId, tags, search } = req.query;
    
    const query = { user: req.user._id };
    
    if (subjectId) {
      query.subject = subjectId;
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    let notes = await Note.find(query)
      .populate('subject', 'name')
      .sort({ isPinned: -1, createdAt: -1 });
    
    // Search in title and content
    if (search) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single note
router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('subject', 'name');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
router.post('/', authenticate, async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      user: req.user._id
    });
    
    await note.save();
    await note.populate('subject', 'name');
    
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update note
router.put('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('subject', 'name');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle pin status
router.patch('/:id/pin', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    note.isPinned = !note.isPinned;
    await note.save();
    await note.populate('subject', 'name');
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all unique tags for current user
router.get('/tags/all', authenticate, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    const tagsSet = new Set();
    
    notes.forEach(note => {
      note.tags.forEach(tag => tagsSet.add(tag));
    });
    
    res.json(Array.from(tagsSet).sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


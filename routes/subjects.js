import express from 'express';
import Subject from '../models/Subject.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all subjects (public - no auth required)
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subject (teacher or admin only)
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { name, description, resources } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const subject = new Subject({
      name,
      description,
      resources: resources || []
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { name, description, resources } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, description, resources },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subject (teacher or admin only)
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


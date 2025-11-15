import express from 'express';
import Subject from '../models/Subject.js';

const router = express.Router();

// Get all subjects
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

// Create new subject
router.post('/', async (req, res) => {
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

// Update subject
router.put('/:id', async (req, res) => {
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

// Delete subject
router.delete('/:id', async (req, res) => {
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


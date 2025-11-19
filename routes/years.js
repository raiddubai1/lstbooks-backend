import express from 'express';
import Year from '../models/Year.js';
import Subject from '../models/Subject.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all years (public)
router.get('/', async (req, res) => {
  try {
    const years = await Year.find({ isActive: true }).sort({ order: 1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get year by ID with subjects (public)
router.get('/:id', async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    // Get all subjects for this year
    const subjects = await Subject.find({ yearId: year._id }).sort({ name: 1 });

    res.json({
      ...year.toObject(),
      subjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get year by name (public)
router.get('/name/:name', async (req, res) => {
  try {
    const year = await Year.findOne({ name: req.params.name });
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    // Get all subjects for this year
    const subjects = await Subject.find({ yearId: year._id }).sort({ name: 1 });

    res.json({
      ...year.toObject(),
      subjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update year (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { description, resources, isActive } = req.body;

    const year = await Year.findByIdAndUpdate(
      req.params.id,
      { description, resources, isActive },
      { new: true, runValidators: true }
    );

    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add video summary to year (teacher or admin only)
router.post('/:id/videos', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, url, description, duration, thumbnail } = req.body;

    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    year.resources.videoSummaries.push({
      title,
      url,
      description,
      duration,
      thumbnail
    });

    await year.save();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add PDF note to year (teacher or admin only)
router.post('/:id/pdfs', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, url, description, fileSize, pages } = req.body;

    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    year.resources.pdfNotes.push({
      title,
      url,
      description,
      fileSize,
      pages
    });

    await year.save();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update year stats (teacher or admin only)
router.post('/:id/update-stats', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    await year.updateStats();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


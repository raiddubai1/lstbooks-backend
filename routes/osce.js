import express from 'express';
import OSCEStation from '../models/OSCE.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all OSCE stations
router.get('/', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    if (subjectId) filter.subjectId = subjectId;

    const stations = await OSCEStation.find(filter)
      .populate('subjectId', 'name description')
      .populate('skills', 'title description')
      .sort({ createdAt: -1 });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get OSCE station by ID
router.get('/:id', async (req, res) => {
  try {
    const station = await OSCEStation.findById(req.params.id)
      .populate('subjectId', 'name description')
      .populate('skills', 'title description');
    if (!station) {
      return res.status(404).json({ error: 'OSCE station not found' });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new OSCE station (teacher or admin only)
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, skills, description, steps } = req.body;

    if (!title || !subjectId || !description) {
      return res.status(400).json({ error: 'Title, subjectId, and description are required' });
    }

    const station = new OSCEStation({
      title,
      subjectId,
      skills: skills || [],
      description,
      steps: steps || []
    });

    await station.save();
    await station.populate('subjectId', 'name description');
    await station.populate('skills', 'title description');

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update OSCE station (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, skills, description, steps } = req.body;

    const station = await OSCEStation.findByIdAndUpdate(
      req.params.id,
      { title, subjectId, skills, description, steps },
      { new: true, runValidators: true }
    )
      .populate('subjectId', 'name description')
      .populate('skills', 'title description');

    if (!station) {
      return res.status(404).json({ error: 'OSCE station not found' });
    }

    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete OSCE station (teacher or admin only)
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const station = await OSCEStation.findByIdAndDelete(req.params.id);

    if (!station) {
      return res.status(404).json({ error: 'OSCE station not found' });
    }

    res.json({ message: 'OSCE station deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


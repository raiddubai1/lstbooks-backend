import express from 'express';
import Lab from '../models/Lab.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all labs (with optional filtering by subjectId)
router.get('/', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    if (subjectId) filter.subjectId = subjectId;

    const labs = await Lab.find(filter)
      .populate('subjectId', 'name description')
      .sort({ createdAt: -1 });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lab by ID
router.get('/:id', async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id)
      .populate('subjectId', 'name description');
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new lab (teacher or admin only)
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, description, steps } = req.body;

    if (!title || !subjectId || !description) {
      return res.status(400).json({ error: 'Title, subjectId, and description are required' });
    }

    const lab = new Lab({
      title,
      subjectId,
      description,
      steps: steps || [],
      completedBy: []
    });

    await lab.save();
    const populatedLab = await Lab.findById(lab._id).populate('subjectId', 'name description');
    res.status(201).json(populatedLab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lab (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, description, steps, completedBy } = req.body;

    const lab = await Lab.findByIdAndUpdate(
      req.params.id,
      { title, subjectId, description, steps, completedBy },
      { new: true, runValidators: true }
    ).populate('subjectId', 'name description');

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    res.json(lab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lab (teacher or admin only)
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);

    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    res.json({ message: 'Lab deleted successfully', lab });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


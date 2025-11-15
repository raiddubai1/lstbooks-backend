import express from 'express';
import Skill from '../models/Skill.js';

const router = express.Router();

// Get all skills with optional subjectId filtering
router.get('/', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    
    if (subjectId) {
      filter.subjectId = subjectId;
    }
    
    const skills = await Skill.find(filter)
      .populate('subjectId', 'name description')
      .sort({ createdAt: -1 });
    
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get single skill by ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('subjectId', 'name description');
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// Create new skill
router.post('/', async (req, res) => {
  try {
    const { title, subjectId, description, media } = req.body;
    
    if (!title || !subjectId || !description) {
      return res.status(400).json({ error: 'Title, subjectId, and description are required' });
    }
    
    const skill = new Skill({
      title,
      subjectId,
      description,
      media: media || []
    });
    
    await skill.save();
    
    const populatedSkill = await Skill.findById(skill._id)
      .populate('subjectId', 'name description');
    
    res.status(201).json(populatedSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
  try {
    const { title, subjectId, description, media } = req.body;
    
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { title, subjectId, description, media },
      { new: true, runValidators: true }
    ).populate('subjectId', 'name description');
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

export default router;


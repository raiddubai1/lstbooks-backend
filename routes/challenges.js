import express from 'express';
import Challenge from '../models/Challenge.js';
import UserProgress from '../models/UserProgress.js';
import { authenticate, requireTeacherOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all challenges
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, category, isActive = true } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const challenges = await Challenge.find(filter)
      .populate('createdBy', 'name email')
      .sort({ startDate: -1 });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active challenges
router.get('/active', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const challenges = await Challenge.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('createdBy', 'name email')
      .sort({ endDate: 1 });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's challenges
router.get('/my-challenges', authenticate, async (req, res) => {
  try {
    const challenges = await Challenge.find({
      'participants.user': req.user._id
    })
      .populate('createdBy', 'name email')
      .sort({ startDate: -1 });
    
    // Add user's progress to each challenge
    const challengesWithProgress = challenges.map(challenge => {
      const participant = challenge.participants.find(p => p.user.toString() === req.user._id.toString());
      return {
        ...challenge.toObject(),
        userProgress: participant
      };
    });
    
    res.json(challengesWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single challenge
router.get('/:id', authenticate, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants.user', 'name email');
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create challenge (teacher/admin only)
router.post('/', requireTeacherOrAdmin, async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const challenge = new Challenge(challengeData);
    await challenge.save();
    
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update challenge (teacher/admin only)
router.put('/:id', requireTeacherOrAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete challenge (teacher/admin only)
router.delete('/:id', requireTeacherOrAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join challenge
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    await challenge.joinChallenge(req.user._id);
    
    res.json({
      message: 'Successfully joined challenge',
      challenge
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update progress
router.post('/:id/progress', authenticate, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined) {
      return res.status(400).json({ error: 'Progress value is required' });
    }
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    await challenge.updateProgress(req.user._id, progress);
    
    // Check if just completed
    const participant = challenge.participants.find(p => p.user.toString() === req.user._id.toString());
    
    if (participant.completed && participant.pointsEarned > 0) {
      // Award points to user
      const userProgress = await UserProgress.findOne({ user: req.user._id });
      if (userProgress) {
        await userProgress.addPoints(
          participant.pointsEarned,
          'challenge_completed',
          `Completed challenge: ${challenge.title}`,
          challenge._id,
          'Challenge'
        );
      }
      
      // Award badge if applicable
      if (challenge.rewards.badge && challenge.rewards.badge.badgeId) {
        if (userProgress) {
          await userProgress.awardBadge(
            challenge.rewards.badge.badgeId,
            challenge.rewards.badge.name,
            challenge.rewards.badge.description,
            challenge.rewards.badge.icon,
            challenge.rewards.badge.category
          );
        }
      }
    }
    
    res.json({
      message: 'Progress updated',
      challenge,
      completed: participant.completed
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


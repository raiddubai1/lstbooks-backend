import express from 'express';
import UserProgress from '../models/UserProgress.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's progress
router.get('/progress', authenticate, async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ user: req.user._id });
    
    if (!progress) {
      // Create initial progress for user
      progress = new UserProgress({
        user: req.user._id,
        lastLoginDate: new Date()
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const { type = 'points', limit = 100 } = req.query;
    
    let sortField = { totalPoints: -1 };
    if (type === 'level') sortField = { level: -1, totalPoints: -1 };
    if (type === 'badges') sortField = { 'badges': -1, totalPoints: -1 };
    
    const leaderboard = await UserProgress.find()
      .populate('user', 'name email')
      .sort(sortField)
      .limit(parseInt(limit));
    
    // Add rank
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));
    
    res.json(leaderboardWithRank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Award points
router.post('/points', authenticate, async (req, res) => {
  try {
    const { points, action, description, relatedId, relatedType } = req.body;
    
    if (!points || !action) {
      return res.status(400).json({ error: 'Points and action are required' });
    }
    
    let progress = await UserProgress.findOne({ user: req.user._id });
    
    if (!progress) {
      progress = new UserProgress({ user: req.user._id });
    }
    
    await progress.addPoints(points, action, description, relatedId, relatedType);
    
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Award badge
router.post('/badges', authenticate, async (req, res) => {
  try {
    const { badgeId, name, description, icon, category } = req.body;
    
    if (!badgeId || !name) {
      return res.status(400).json({ error: 'Badge ID and name are required' });
    }
    
    let progress = await UserProgress.findOne({ user: req.user._id });
    
    if (!progress) {
      progress = new UserProgress({ user: req.user._id });
    }
    
    await progress.awardBadge(badgeId, name, description, icon, category);
    
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update streak
router.post('/streaks', authenticate, async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Streak type is required' });
    }
    
    let progress = await UserProgress.findOne({ user: req.user._id });
    
    if (!progress) {
      progress = new UserProgress({ user: req.user._id });
    }
    
    await progress.updateStreak(type);
    
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update stats
router.post('/stats', authenticate, async (req, res) => {
  try {
    const { stat, increment = 1 } = req.body;
    
    if (!stat) {
      return res.status(400).json({ error: 'Stat name is required' });
    }
    
    let progress = await UserProgress.findOne({ user: req.user._id });
    
    if (!progress) {
      progress = new UserProgress({ user: req.user._id });
    }
    
    // Update the specific stat
    if (progress.stats[stat] !== undefined) {
      progress.stats[stat] += increment;
      await progress.save();
    } else {
      return res.status(400).json({ error: 'Invalid stat name' });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available badges (predefined list)
router.get('/badges/available', authenticate, async (req, res) => {
  try {
    const availableBadges = [
      // Learning Badges
      { badgeId: 'first-quiz', name: 'Quiz Novice', description: 'Complete your first quiz', icon: '🎯', category: 'learning', pointsRequired: 0 },
      { badgeId: 'quiz-master', name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆', category: 'learning', pointsRequired: 0 },
      { badgeId: 'flashcard-fan', name: 'Flashcard Fan', description: 'Review 100 flashcards', icon: '📇', category: 'learning', pointsRequired: 0 },
      { badgeId: 'study-streak-7', name: 'Week Warrior', description: '7-day study streak', icon: '🔥', category: 'streak', pointsRequired: 0 },
      { badgeId: 'study-streak-30', name: 'Month Master', description: '30-day study streak', icon: '⭐', category: 'streak', pointsRequired: 0 },
      
      // Social Badges
      { badgeId: 'first-discussion', name: 'Conversationalist', description: 'Start your first discussion', icon: '💬', category: 'social', pointsRequired: 0 },
      { badgeId: 'helpful-peer', name: 'Helpful Peer', description: 'Give 10 peer reviews', icon: '🤝', category: 'social', pointsRequired: 0 },
      { badgeId: 'resource-sharer', name: 'Resource Sharer', description: 'Share 5 resources', icon: '📚', category: 'social', pointsRequired: 0 },
      { badgeId: 'study-group-leader', name: 'Study Group Leader', description: 'Create a study group', icon: '👥', category: 'social', pointsRequired: 0 },
      
      // Achievement Badges
      { badgeId: 'level-10', name: 'Rising Star', description: 'Reach level 10', icon: '🌟', category: 'achievement', pointsRequired: 1000 },
      { badgeId: 'level-25', name: 'Expert Learner', description: 'Reach level 25', icon: '💎', category: 'achievement', pointsRequired: 6250 },
      { badgeId: 'level-50', name: 'Master Scholar', description: 'Reach level 50', icon: '👑', category: 'achievement', pointsRequired: 25000 },
      { badgeId: 'points-1000', name: 'Point Collector', description: 'Earn 1,000 points', icon: '💰', category: 'achievement', pointsRequired: 1000 },
      { badgeId: 'points-10000', name: 'Point Hoarder', description: 'Earn 10,000 points', icon: '💎', category: 'achievement', pointsRequired: 10000 },
      
      // Special Badges
      { badgeId: 'early-adopter', name: 'Early Adopter', description: 'One of the first users', icon: '🚀', category: 'special', pointsRequired: 0 },
      { badgeId: 'ai-enthusiast', name: 'AI Enthusiast', description: 'Use AI assistants 20 times', icon: '🤖', category: 'special', pointsRequired: 0 }
    ];
    
    res.json(availableBadges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


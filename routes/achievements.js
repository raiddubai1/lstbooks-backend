import express from 'express';
import Achievement from '../models/Achievement.js';
import UserProgress from '../models/UserProgress.js';
import { authenticate, requireTeacherOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all achievements
router.get('/', authenticate, async (req, res) => {
  try {
    const { category, tier, isActive = true } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (tier) filter.tier = tier;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const achievements = await Achievement.find(filter).sort({ order: 1, tier: 1 });
    
    // Get user's progress to check which achievements are unlocked
    const userProgress = await UserProgress.findOne({ user: req.user._id });
    
    const achievementsWithStatus = achievements.map(achievement => {
      const unlocked = userProgress?.badges.some(b => b.badgeId === achievement.achievementId) || false;
      return {
        ...achievement.toObject(),
        unlocked,
        progress: unlocked ? 100 : 0 // TODO: Calculate actual progress
      };
    });
    
    res.json(achievementsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single achievement
router.get('/:id', authenticate, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    // Check if user has unlocked this achievement
    const userProgress = await UserProgress.findOne({ user: req.user._id });
    const unlocked = userProgress?.badges.some(b => b.badgeId === achievement.achievementId) || false;
    
    res.json({
      ...achievement.toObject(),
      unlocked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create achievement (teacher/admin only)
router.post('/', requireTeacherOrAdmin, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update achievement (teacher/admin only)
router.put('/:id', requireTeacherOrAdmin, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete achievement (teacher/admin only)
router.delete('/:id', requireTeacherOrAdmin, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check and award achievements for a user
router.post('/check', authenticate, async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({ user: req.user._id });
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    
    const achievements = await Achievement.find({ isActive: true });
    const newlyUnlocked = [];
    
    for (const achievement of achievements) {
      // Check if already unlocked
      const alreadyUnlocked = userProgress.badges.some(b => b.badgeId === achievement.achievementId);
      if (alreadyUnlocked) continue;
      
      // Check criteria
      let criteriaMetric = userProgress.stats[achievement.criteria.metric] || 0;
      if (achievement.criteria.metric === 'totalPoints') {
        criteriaMetric = userProgress.totalPoints;
      } else if (achievement.criteria.metric === 'level') {
        criteriaMetric = userProgress.level;
      }
      
      let criteriaMet = false;
      switch (achievement.criteria.comparison) {
        case 'gte':
          criteriaMet = criteriaMetric >= achievement.criteria.target;
          break;
        case 'lte':
          criteriaMet = criteriaMetric <= achievement.criteria.target;
          break;
        case 'eq':
          criteriaMet = criteriaMetric === achievement.criteria.target;
          break;
        case 'gt':
          criteriaMet = criteriaMetric > achievement.criteria.target;
          break;
        case 'lt':
          criteriaMet = criteriaMetric < achievement.criteria.target;
          break;
      }
      
      if (criteriaMet) {
        await userProgress.awardBadge(
          achievement.achievementId,
          achievement.name,
          achievement.description,
          achievement.icon,
          achievement.category
        );
        
        if (achievement.points > 0) {
          await userProgress.addPoints(
            achievement.points,
            'achievement_unlocked',
            `Unlocked achievement: ${achievement.name}`,
            achievement._id,
            'Achievement'
          );
        }
        
        newlyUnlocked.push(achievement);
      }
    }
    
    res.json({
      message: `Checked ${achievements.length} achievements`,
      newlyUnlocked,
      totalUnlocked: userProgress.badges.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


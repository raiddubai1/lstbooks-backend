import express from 'express';
import StudentPerformance from '../models/StudentPerformance.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/student-performance/my-performance
 * Get current user's performance data
 */
router.get('/my-performance', authenticate, async (req, res) => {
  try {
    const performance = await StudentPerformance.findOne({ user: req.user._id })
      .populate('weakAreas.subject', 'name')
      .populate('strongAreas.subject', 'name')
      .populate('topicPerformance.subject', 'name')
      .lean();

    if (!performance) {
      // Return empty performance structure
      return res.json({
        overallStats: {
          totalQuizzesTaken: 0,
          totalFlashcardsReviewed: 0,
          totalStudyTime: 0,
          averageQuizScore: 0,
          currentStreak: 0,
          longestStreak: 0
        },
        quizHistory: [],
        topicPerformance: [],
        weakAreas: [],
        strongAreas: [],
        learningProfile: {},
        recommendations: [],
        goals: []
      });
    }

    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ message: 'Failed to fetch performance data', error: error.message });
  }
});

/**
 * GET /api/student-performance/stats
 * Get summary statistics
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const performance = await StudentPerformance.findOne({ user: req.user._id }).lean();

    if (!performance) {
      return res.json({
        totalQuizzes: 0,
        averageScore: 0,
        studyTime: 0,
        streak: 0,
        weakAreasCount: 0,
        strongAreasCount: 0
      });
    }

    res.json({
      totalQuizzes: performance.overallStats.totalQuizzesTaken,
      averageScore: performance.overallStats.averageQuizScore,
      studyTime: performance.overallStats.totalStudyTime,
      streak: performance.overallStats.currentStreak,
      weakAreasCount: performance.weakAreas.length,
      strongAreasCount: performance.strongAreas.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

/**
 * POST /api/student-performance/set-goal
 * Set a study goal
 */
router.post('/set-goal', authenticate, async (req, res) => {
  try {
    const { type, target, deadline, description } = req.body;

    const performance = await StudentPerformance.getOrCreate(req.user._id);

    performance.goals.push({
      type,
      target,
      current: 0,
      deadline: deadline ? new Date(deadline) : null,
      description,
      achieved: false
    });

    await performance.save();

    res.json({ message: 'Goal set successfully', goals: performance.goals });
  } catch (error) {
    console.error('Error setting goal:', error);
    res.status(500).json({ message: 'Failed to set goal', error: error.message });
  }
});

/**
 * PUT /api/student-performance/update-learning-profile
 * Update learning preferences
 */
router.put('/update-learning-profile', authenticate, async (req, res) => {
  try {
    const { preferredStudyTime, studyPace, difficultyLevel } = req.body;

    const performance = await StudentPerformance.getOrCreate(req.user._id);

    if (preferredStudyTime) performance.learningProfile.preferredStudyTime = preferredStudyTime;
    if (studyPace) performance.learningProfile.studyPace = studyPace;
    if (difficultyLevel) performance.learningProfile.difficultyLevel = difficultyLevel;

    await performance.save();

    res.json({ message: 'Learning profile updated', learningProfile: performance.learningProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

/**
 * GET /api/student-performance/recommendations
 * Get AI-generated recommendations
 */
router.get('/recommendations', authenticate, async (req, res) => {
  try {
    const performance = await StudentPerformance.findOne({ user: req.user._id })
      .populate('weakAreas.subject', 'name')
      .lean();

    if (!performance || performance.weakAreas.length === 0) {
      return res.json({
        recommendations: [
          'Keep taking quizzes to build your performance profile',
          'Try different subjects to discover your strengths',
          'Set study goals to track your progress'
        ]
      });
    }

    const recommendations = performance.weakAreas.slice(0, 3).map(area => 
      `Focus on ${area.topic} - current score: ${area.averageScore}%`
    );

    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations', error: error.message });
  }
});

export default router;

import express from 'express';
import Progress from '../models/Progress.js';

const router = express.Router();

// Get user progress
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.params.userId })
      .populate('subject', 'name code')
      .populate('completedLabs', 'title')
      .populate('completedOSCE', 'title');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for specific subject
router.get('/user/:userId/subject/:subjectId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      user: req.params.userId, 
      subject: req.params.subjectId 
    }).populate('subject', 'name code');
    
    if (!progress) {
      return res.json({ message: 'No progress found', progress: null });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.params.userId });
    
    const stats = {
      totalStudyTime: allProgress.reduce((sum, p) => sum + p.studyTime, 0),
      totalQuizzes: allProgress.reduce((sum, p) => sum + p.quizAttempts.length, 0),
      averageScore: 0,
      totalFlashcardsReviewed: allProgress.reduce((sum, p) => sum + p.flashcardProgress.length, 0),
      completedLabs: allProgress.reduce((sum, p) => sum + p.completedLabs.length, 0),
      completedOSCE: allProgress.reduce((sum, p) => sum + p.completedOSCE.length, 0)
    };

    const allQuizAttempts = allProgress.flatMap(p => p.quizAttempts);
    if (allQuizAttempts.length > 0) {
      stats.averageScore = allQuizAttempts.reduce((sum, a) => sum + a.score, 0) / allQuizAttempts.length;
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


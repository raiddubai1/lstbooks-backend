import express from 'express';
import Progress from '../models/Progress.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get current user's progress for all subjects
router.get('/my-progress', authenticate, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('subject', 'name description yearId')
      .populate('completedLabs', 'title')
      .populate('completedOSCE', 'title')
      .populate('completedSkills', 'title')
      .sort({ updatedAt: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user progress (for admins/teachers to view student progress)
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.params.userId })
      .populate('subject', 'name description yearId')
      .populate('completedLabs', 'title')
      .populate('completedOSCE', 'title')
      .populate('completedSkills', 'title');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's progress for specific subject
router.get('/subject/:subjectId', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      subject: req.params.subjectId
    }).populate('subject', 'name description yearId');

    // Create progress record if it doesn't exist
    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        subject: req.params.subjectId
      });
      await progress.save();
      await progress.populate('subject', 'name description yearId');
    }

    // Calculate overall progress
    await progress.calculateOverallProgress();
    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for specific subject (for admins/teachers)
router.get('/user/:userId/subject/:subjectId', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.params.userId,
      subject: req.params.subjectId
    }).populate('subject', 'name description yearId');

    if (!progress) {
      return res.json({ message: 'No progress found', progress: null });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's dashboard stats
router.get('/my-stats', authenticate, async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.user._id });

    const stats = {
      totalStudyTime: allProgress.reduce((sum, p) => sum + p.studyTime, 0),
      totalQuizzes: allProgress.reduce((sum, p) => sum + p.quizAttempts.length, 0),
      averageScore: 0,
      totalFlashcardsReviewed: allProgress.reduce((sum, p) => sum + p.flashcardProgress.length, 0),
      completedLabs: allProgress.reduce((sum, p) => sum + p.completedLabs.length, 0),
      completedOSCE: allProgress.reduce((sum, p) => sum + p.completedOSCE.length, 0),
      completedSkills: allProgress.reduce((sum, p) => sum + p.completedSkills.length, 0),
      totalMilestones: allProgress.reduce((sum, p) => sum + p.milestones.length, 0),
      averageProgress: 0
    };

    const allQuizAttempts = allProgress.flatMap(p => p.quizAttempts);
    if (allQuizAttempts.length > 0) {
      stats.averageScore = Math.round(allQuizAttempts.reduce((sum, a) => sum + a.score, 0) / allQuizAttempts.length);
    }

    if (allProgress.length > 0) {
      stats.averageProgress = Math.round(allProgress.reduce((sum, p) => sum + p.overallProgress, 0) / allProgress.length);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats (for admins/teachers)
router.get('/user/:userId/stats', authenticate, async (req, res) => {
  try {
    const allProgress = await Progress.find({ user: req.params.userId });

    const stats = {
      totalStudyTime: allProgress.reduce((sum, p) => sum + p.studyTime, 0),
      totalQuizzes: allProgress.reduce((sum, p) => sum + p.quizAttempts.length, 0),
      averageScore: 0,
      totalFlashcardsReviewed: allProgress.reduce((sum, p) => sum + p.flashcardProgress.length, 0),
      completedLabs: allProgress.reduce((sum, p) => sum + p.completedLabs.length, 0),
      completedOSCE: allProgress.reduce((sum, p) => sum + p.completedOSCE.length, 0),
      completedSkills: allProgress.reduce((sum, p) => sum + p.completedSkills.length, 0),
      totalMilestones: allProgress.reduce((sum, p) => sum + p.milestones.length, 0),
      averageProgress: 0
    };

    const allQuizAttempts = allProgress.flatMap(p => p.quizAttempts);
    if (allQuizAttempts.length > 0) {
      stats.averageScore = Math.round(allQuizAttempts.reduce((sum, a) => sum + a.score, 0) / allQuizAttempts.length);
    }

    if (allProgress.length > 0) {
      stats.averageProgress = Math.round(allProgress.reduce((sum, p) => sum + p.overallProgress, 0) / allProgress.length);
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record quiz attempt
router.post('/quiz-attempt', authenticate, async (req, res) => {
  try {
    const { quizId, subjectId, score, totalQuestions, correctAnswers, timeSpent } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      subject: subjectId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        subject: subjectId
      });
    }

    // Add quiz attempt
    progress.quizAttempts.push({
      quizId,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent
    });

    // Update study time
    progress.studyTime += Math.round(timeSpent / 60);
    progress.lastAccessed = new Date();

    // Check for milestones
    progress.checkMilestones();

    // Calculate overall progress
    await progress.calculateOverallProgress();

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flashcard progress
router.post('/flashcard-review', authenticate, async (req, res) => {
  try {
    const { flashcardId, subjectId, quality, easeFactor, interval, repetitions } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      subject: subjectId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        subject: subjectId
      });
    }

    // Find existing flashcard progress or create new
    const existingIndex = progress.flashcardProgress.findIndex(
      f => f.flashcardId.toString() === flashcardId
    );

    const flashcardData = {
      flashcardId,
      easeFactor: easeFactor || 2.5,
      interval: interval || 0,
      repetitions: repetitions || 0,
      quality,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + (interval || 1) * 24 * 60 * 60 * 1000)
    };

    if (existingIndex >= 0) {
      progress.flashcardProgress[existingIndex] = flashcardData;
    } else {
      progress.flashcardProgress.push(flashcardData);
    }

    progress.lastAccessed = new Date();

    // Check for milestones
    progress.checkMilestones();

    // Calculate overall progress
    await progress.calculateOverallProgress();

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';

const router = express.Router();

// Get overall dashboard statistics
router.get('/', async (req, res) => {
  try {
    const [totalBooks, totalUsers, totalQuizzes, totalSubjects] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Quiz.countDocuments(),
      Subject.countDocuments()
    ]);

    res.json({
      totalBooks,
      totalUsers,
      totalQuizzes,
      totalSubjects
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get overview of all quizzes with stats
router.get('/quiz/overview', async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('subjectId', 'name');
    
    const overview = await Promise.all(
      quizzes.map(async (quiz) => {
        const attempts = await QuizAttempt.find({ quizId: quiz._id });
        
        if (attempts.length === 0) {
          return {
            quizId: quiz._id,
            title: quiz.title,
            subject: quiz.subjectId?.name || 'Unknown',
            attemptsCount: 0,
            avgScore: 0,
            avgPercent: 0,
            passRate: 0
          };
        }
        
        const totalPercent = attempts.reduce((sum, a) => sum + a.percent, 0);
        const passedCount = attempts.filter(a => a.percent >= 70).length;
        
        return {
          quizId: quiz._id,
          title: quiz.title,
          subject: quiz.subjectId?.name || 'Unknown',
          attemptsCount: attempts.length,
          avgScore: attempts.reduce((sum, a) => sum + a.totalScore, 0) / attempts.length,
          avgPercent: totalPercent / attempts.length,
          passRate: (passedCount / attempts.length) * 100
        };
      })
    );
    
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trend data for a specific quiz
router.get('/quiz/:id/trend', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    
    const attempts = await QuizAttempt.find({
      quizId: req.params.id,
      createdAt: { $gte: daysAgo }
    }).sort({ createdAt: 1 });
    
    // Group by day
    const trendData = {};
    attempts.forEach(attempt => {
      const date = attempt.createdAt.toISOString().split('T')[0];
      if (!trendData[date]) {
        trendData[date] = {
          date,
          attempts: [],
          avgScore: 0,
          avgPercent: 0,
          count: 0
        };
      }
      trendData[date].attempts.push(attempt);
      trendData[date].count++;
    });
    
    // Calculate averages for each day
    const trend = Object.values(trendData).map(day => {
      const totalPercent = day.attempts.reduce((sum, a) => sum + a.percent, 0);
      const totalScore = day.attempts.reduce((sum, a) => sum + a.totalScore, 0);
      
      return {
        date: day.date,
        avgScore: totalScore / day.count,
        avgPercent: totalPercent / day.count,
        attemptsCount: day.count
      };
    });
    
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user-specific quiz stats
router.get('/user/:userId/quiz-stats', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.params.userId })
      .populate('quizId', 'title');
    
    const stats = {
      totalAttempts: attempts.length,
      averagePercent: 0,
      quizzesTaken: new Set(attempts.map(a => a.quizId._id.toString())).size,
      recentAttempts: attempts.slice(-5).map(a => ({
        quizTitle: a.quizId.title,
        percent: a.percent,
        date: a.createdAt
      }))
    };
    
    if (attempts.length > 0) {
      stats.averagePercent = attempts.reduce((sum, a) => sum + a.percent, 0) / attempts.length;
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


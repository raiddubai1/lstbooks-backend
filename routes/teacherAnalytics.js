import express from 'express';
import User from '../models/User.js';
import StudentPerformance from '../models/StudentPerformance.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Quiz from '../models/Quiz.js';
import Subject from '../models/Subject.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * GET /api/teacher-analytics/overview
 * Get overview statistics for teacher dashboard
 */
router.get('/overview', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalQuizAttempts,
      averageScore,
      subjects
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      QuizAttempt.countDocuments(),
      QuizAttempt.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$percent' } } }
      ]),
      Subject.countDocuments()
    ]);

    res.json({
      totalStudents,
      activeStudents,
      totalQuizAttempts,
      averageScore: averageScore[0]?.avgScore || 0,
      totalSubjects: subjects
    });
  } catch (error) {
    console.error('Error fetching teacher overview:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/teacher-analytics/students
 * Get list of all students with their performance summary
 */
router.get('/students', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { search, sortBy = 'name', order = 'asc', page = 1, limit = 20 } = req.query;

    // Build query
    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get students
    const students = await User.find(query)
      .select('name email year university avatar createdAt')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Get performance data for each student
    const studentsWithPerformance = await Promise.all(
      students.map(async (student) => {
        const performance = await StudentPerformance.findOne({ user: student._id }).lean();
        const recentAttempts = await QuizAttempt.find({ userId: student._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        return {
          ...student,
          performance: performance ? {
            totalQuizzes: performance.overallStats.totalQuizzesTaken,
            averageScore: performance.overallStats.averageQuizScore,
            studyTime: performance.overallStats.totalStudyTime,
            streak: performance.overallStats.currentStreak,
            weakAreasCount: performance.weakAreas.length,
            strongAreasCount: performance.strongAreas.length
          } : {
            totalQuizzes: 0,
            averageScore: 0,
            studyTime: 0,
            streak: 0,
            weakAreasCount: 0,
            strongAreasCount: 0
          },
          recentActivity: recentAttempts.length
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      students: studentsWithPerformance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/teacher-analytics/student/:studentId
 * Get detailed analytics for a specific student
 */
router.get('/student/:studentId', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get student info
    const student = await User.findById(studentId)
      .select('name email year university avatar createdAt')
      .lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get performance data
    const performance = await StudentPerformance.findOne({ user: studentId })
      .populate('weakAreas.subject', 'name')
      .populate('strongAreas.subject', 'name')
      .populate('topicPerformance.subject', 'name')
      .lean();

    // Get quiz attempts with quiz details
    const quizAttempts = await QuizAttempt.find({ userId: studentId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('quizId', 'title subjectId')
      .lean();

    res.json({
      student,
      performance: performance || {
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
        strongAreas: []
      },
      quizAttempts
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/teacher-analytics/quiz/:quizId/stats
 * Get statistics for a specific quiz
 */
router.get('/quiz/:quizId/stats', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const attempts = await QuizAttempt.find({ quizId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      totalAttempts: attempts.length,
      uniqueStudents: new Set(attempts.map(a => a.userId?.toString())).size,
      averageScore: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.percent, 0) / attempts.length
        : 0,
      highestScore: attempts.length > 0
        ? Math.max(...attempts.map(a => a.percent))
        : 0,
      lowestScore: attempts.length > 0
        ? Math.min(...attempts.map(a => a.percent))
        : 0,
      averageDuration: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.durationSec, 0) / attempts.length
        : 0,
      passRate: attempts.length > 0
        ? (attempts.filter(a => a.percent >= 60).length / attempts.length) * 100
        : 0
    };

    res.json({
      quiz: {
        title: quiz.title,
        totalQuestions: quiz.questions.length,
        timeLimit: quiz.timeLimit
      },
      stats,
      recentAttempts: attempts.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/teacher-analytics/subject/:subjectId/performance
 * Get performance analytics for a specific subject
 */
router.get('/subject/:subjectId/performance', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId).lean();
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get all quizzes for this subject
    const quizzes = await Quiz.find({ subjectId }).lean();
    const quizIds = quizzes.map(q => q._id);

    // Get all attempts for these quizzes
    const attempts = await QuizAttempt.find({ quizId: { $in: quizIds } })
      .populate('userId', 'name email year')
      .lean();

    // Calculate subject-level stats
    const stats = {
      totalQuizzes: quizzes.length,
      totalAttempts: attempts.length,
      uniqueStudents: new Set(attempts.map(a => a.userId?.toString())).size,
      averageScore: attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.percent, 0) / attempts.length
        : 0,
      passRate: attempts.length > 0
        ? (attempts.filter(a => a.percent >= 60).length / attempts.length) * 100
        : 0
    };

    // Get topic performance from StudentPerformance
    const topicPerformance = await StudentPerformance.aggregate([
      { $unwind: '$topicPerformance' },
      { $match: { 'topicPerformance.subject': subject._id } },
      {
        $group: {
          _id: '$topicPerformance.topic',
          averageScore: { $avg: '$topicPerformance.averageScore' },
          totalAttempts: { $sum: '$topicPerformance.attemptsCount' }
        }
      },
      { $sort: { averageScore: 1 } }
    ]);

    res.json({
      subject: {
        name: subject.name,
        description: subject.description
      },
      stats,
      topicPerformance,
      quizzes: quizzes.map(q => ({
        _id: q._id,
        title: q.title,
        questionsCount: q.questions.length,
        attemptsCount: attempts.filter(a => a.quizId.toString() === q._id.toString()).length
      }))
    });
  } catch (error) {
    console.error('Error fetching subject performance:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/teacher-analytics/class-performance
 * Get class-wide performance trends
 */
router.get('/class-performance', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get quiz attempts over time
    const attemptsTrend = await QuizAttempt.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          averageScore: { $avg: '$percent' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top performers
    const topPerformers = await StudentPerformance.find()
      .sort({ 'overallStats.averageQuizScore': -1 })
      .limit(10)
      .populate('user', 'name email avatar')
      .lean();

    // Get students needing help (low average scores)
    const needsHelp = await StudentPerformance.find({
      'overallStats.averageQuizScore': { $lt: 60, $gt: 0 }
    })
      .sort({ 'overallStats.averageQuizScore': 1 })
      .limit(10)
      .populate('user', 'name email avatar')
      .lean();

    res.json({
      attemptsTrend,
      topPerformers: topPerformers.map(p => ({
        student: p.user,
        averageScore: p.overallStats.averageQuizScore,
        totalQuizzes: p.overallStats.totalQuizzesTaken,
        streak: p.overallStats.currentStreak
      })),
      needsHelp: needsHelp.map(p => ({
        student: p.user,
        averageScore: p.overallStats.averageQuizScore,
        weakAreasCount: p.weakAreas.length,
        totalQuizzes: p.overallStats.totalQuizzesTaken
      }))
    });
  } catch (error) {
    console.error('Error fetching class performance:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


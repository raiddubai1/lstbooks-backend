import express from 'express';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import OSCEStation from '../models/OSCEStation.js';
import Discussion from '../models/Discussion.js';
import StudyGroup from '../models/StudyGroup.js';
import UserProgress from '../models/UserProgress.js';
import ChatSession from '../models/ChatSession.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/analytics/overview - Get platform overview analytics
router.get('/analytics/overview', async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      totalSubjects,
      totalQuizzes,
      totalFlashcards,
      totalOSCEStations,
      totalDiscussions,
      totalStudyGroups,
      totalAIChatSessions,
      activeUsersToday,
      activeUsersWeek,
      activeUsersMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      Subject.countDocuments(),
      Quiz.countDocuments(),
      Flashcard.countDocuments(),
      OSCEStation.countDocuments(),
      Discussion.countDocuments(),
      StudyGroup.countDocuments(),
      ChatSession.countDocuments(),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    ]);

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        teachers: totalTeachers,
        admins: totalAdmins,
        activeToday: activeUsersToday,
        activeWeek: activeUsersWeek,
        activeMonth: activeUsersMonth
      },
      content: {
        subjects: totalSubjects,
        quizzes: totalQuizzes,
        flashcards: totalFlashcards,
        osceStations: totalOSCEStations,
        discussions: totalDiscussions,
        studyGroups: totalStudyGroups,
        aiChatSessions: totalAIChatSessions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/analytics/users - Get user analytics
router.get('/analytics/users', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get new users over time
    const newUsers = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get user distribution by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top active users
    const topActiveUsers = await UserProgress.find()
      .sort({ totalPoints: -1 })
      .limit(10)
      .populate('user', 'name email role');

    res.json({
      newUsers,
      usersByRole,
      topActiveUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/analytics/content - Get content analytics
router.get('/analytics/content', async (req, res) => {
  try {
    // Get quiz statistics
    const quizStats = await Quiz.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          avgQuestions: { $avg: { $size: '$questions' } }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      {
        $project: {
          subjectName: '$subject.name',
          count: 1,
          avgQuestions: { $round: ['$avgQuestions', 0] }
        }
      }
    ]);

    // Get flashcard statistics
    const flashcardStats = await Flashcard.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      { $unwind: '$subject' },
      {
        $project: {
          subjectName: '$subject.name',
          count: 1
        }
      }
    ]);

    // Get discussion statistics
    const discussionStats = await Discussion.aggregate([
      {
        $group: {
          _id: null,
          totalDiscussions: { $sum: 1 },
          totalPosts: { $sum: { $size: '$posts' } },
          avgPostsPerDiscussion: { $avg: { $size: '$posts' } }
        }
      }
    ]);

    res.json({
      quizStats,
      flashcardStats,
      discussionStats: discussionStats[0] || { totalDiscussions: 0, totalPosts: 0, avgPostsPerDiscussion: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users - Get all users with filters
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/content/pending - Get pending content for approval
router.get('/content/pending', async (req, res) => {
  try {
    const { type } = req.query;

    let pendingContent = [];

    if (!type || type === 'quizzes') {
      const quizzes = await Quiz.find({ status: 'pending' })
        .populate('createdBy', 'name email')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
      pendingContent.push(...quizzes.map(q => ({ ...q.toObject(), type: 'quiz' })));
    }

    if (!type || type === 'flashcards') {
      const flashcards = await Flashcard.find({ status: 'pending' })
        .populate('createdBy', 'name email')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
      pendingContent.push(...flashcards.map(f => ({ ...f.toObject(), type: 'flashcard' })));
    }

    if (!type || type === 'discussions') {
      const discussions = await Discussion.find({ status: 'pending' })
        .populate('author', 'name email')
        .populate('subject', 'name')
        .sort({ createdAt: -1 });
      pendingContent.push(...discussions.map(d => ({ ...d.toObject(), type: 'discussion' })));
    }

    res.json(pendingContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/content/approve/:type/:id - Approve content
router.put('/content/approve/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let content;

    switch (type) {
      case 'quiz':
        content = await Quiz.findByIdAndUpdate(
          id,
          { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
          { new: true }
        );
        break;
      case 'flashcard':
        content = await Flashcard.findByIdAndUpdate(
          id,
          { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
          { new: true }
        );
        break;
      case 'discussion':
        content = await Discussion.findByIdAndUpdate(
          id,
          { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/content/reject/:type/:id - Reject content
router.put('/content/reject/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason } = req.body;
    let content;

    switch (type) {
      case 'quiz':
        content = await Quiz.findByIdAndUpdate(
          id,
          { status: 'rejected', rejectionReason: reason, rejectedBy: req.user._id, rejectedAt: new Date() },
          { new: true }
        );
        break;
      case 'flashcard':
        content = await Flashcard.findByIdAndUpdate(
          id,
          { status: 'rejected', rejectionReason: reason, rejectedBy: req.user._id, rejectedAt: new Date() },
          { new: true }
        );
        break;
      case 'discussion':
        content = await Discussion.findByIdAndUpdate(
          id,
          { status: 'rejected', rejectionReason: reason, rejectedBy: req.user._id, rejectedAt: new Date() },
          { new: true }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/analytics/engagement - Get engagement analytics
router.get('/analytics/engagement', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get AI chat sessions over time
    const aiChatSessions = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get study group activity
    const studyGroupActivity = await StudyGroup.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get discussion activity
    const discussionActivity = await Discussion.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      aiChatSessions,
      studyGroupActivity,
      discussionActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


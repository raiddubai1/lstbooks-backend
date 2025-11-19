import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin, requireOwnerOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, year, university, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Default role is student, only allow student registration through public endpoint
    const userRole = role === 'teacher' || role === 'admin' ? 'student' : (role || 'student');

    const user = new User({
      name,
      email,
      password,
      year,
      university,
      role: userRole
    });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        university: user.university,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        year: user.year,
        university: user.university,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        teacherProfile: user.role === 'teacher' ? user.teacherProfile : undefined,
        adminProfile: user.role === 'admin' ? user.adminProfile : undefined
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add bookmark (authenticated users only - own bookmarks)
router.post('/:userId/bookmarks', authenticate, async (req, res) => {
  try {
    const { type, itemId, note } = req.body;
    const user = await User.findById(req.params.userId);
    
    user.bookmarks.push({ type, itemId, note });
    await user.save();
    
    res.json({ message: 'Bookmark added', bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user bookmarks (authenticated users only - own bookmarks)
router.get('/:userId/bookmarks', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update note (authenticated users only - own notes)
router.post('/:userId/notes', authenticate, async (req, res) => {
  try {
    const { type, itemId, content } = req.body;
    const user = await User.findById(req.params.userId);

    const existingNote = user.notes.find(n => n.itemId.toString() === itemId && n.type === type);
    if (existingNote) {
      existingNote.content = content;
      existingNote.updatedAt = new Date();
    } else {
      user.notes.push({ type, itemId, content });
    }

    await user.save();
    res.json({ message: 'Note saved', notes: user.notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only: Create teacher or admin account
router.post('/admin/create-user', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, teacherProfile, adminProfile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userData = {
      name,
      email,
      password,
      role,
      isActive: true,
      isVerified: true
    };

    if (role === 'teacher' && teacherProfile) {
      userData.teacherProfile = teacherProfile;
    }

    if (role === 'admin' && adminProfile) {
      userData.adminProfile = adminProfile;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/admin/users', authenticate, requireAdmin, async (req, res) => {
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
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role/status (admin only)
router.patch('/admin/users/:userId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role, isActive, isVerified } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof isVerified !== 'undefined') user.isVerified = isVerified;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


import express from 'express';
import StudyPlan from '../models/StudyPlan.js';
import { auth, isTeacher, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all study plans
router.get('/', async (req, res) => {
  try {
    const { subject, year, category, difficulty, search, sort = '-createdAt' } = req.query;
    
    const query = { isPublic: true };
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const plans = await StudyPlan.find(query)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .sort(sort);
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single study plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .populate('ratings.user', 'name');
    
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's enrolled plans
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const plans = await StudyPlan.find({ 'enrollments.user': req.user.userId })
      .populate('subject', 'name')
      .populate('createdBy', 'name');
    
    // Add user's enrollment data to each plan
    const plansWithProgress = plans.map(plan => {
      const enrollment = plan.enrollments.find(e => e.user.toString() === req.user.userId);
      return {
        ...plan.toObject(),
        userEnrollment: enrollment
      };
    });
    
    res.json(plansWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create study plan (teachers/admins only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const plan = new StudyPlan({
      ...req.body,
      createdBy: req.user.userId
    });
    
    await plan.save();
    await plan.populate('subject', 'name');
    await plan.populate('createdBy', 'name');
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update study plan (teachers/admins only)
router.put('/:id', auth, isTeacher, async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    
    // Check if user is creator or admin
    if (plan.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this plan' });
    }
    
    Object.assign(plan, req.body);
    await plan.save();
    await plan.populate('subject', 'name');
    await plan.populate('createdBy', 'name');
    
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete study plan (admins only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const plan = await StudyPlan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    
    res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in study plan
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const plan = await StudyPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = plan.enrollments.find(
      e => e.user.toString() === req.user.userId
    );
    
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this plan' });
    }
    
    plan.enrollments.push({
      user: req.user.userId,
      startDate: new Date(),
      currentDay: 1,
      completedDays: [],
      progress: 0,
      status: 'active'
    });
    
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update progress (mark day as complete)
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { day } = req.body;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    const enrollment = plan.enrollments.find(
      e => e.user.toString() === req.user.userId
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Not enrolled in this plan' });
    }

    // Mark day as completed
    if (!enrollment.completedDays.includes(day)) {
      enrollment.completedDays.push(day);
    }

    // Update current day
    enrollment.currentDay = Math.max(enrollment.currentDay, day + 1);

    // Calculate progress
    enrollment.progress = (enrollment.completedDays.length / plan.duration) * 100;

    // Check if completed
    if (enrollment.completedDays.length >= plan.duration) {
      enrollment.status = 'completed';
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update enrollment status
router.put('/:id/enrollment/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    const enrollment = plan.enrollments.find(
      e => e.user.toString() === req.user.userId
    );

    if (!enrollment) {
      return res.status(400).json({ error: 'Not enrolled in this plan' });
    }

    enrollment.status = status;
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rate study plan
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const plan = await StudyPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    // Check if user already rated
    const existingRatingIndex = plan.ratings.findIndex(
      r => r.user.toString() === req.user.userId
    );

    if (existingRatingIndex > -1) {
      plan.ratings[existingRatingIndex].rating = rating;
      plan.ratings[existingRatingIndex].comment = comment;
    } else {
      plan.ratings.push({
        user: req.user.userId,
        rating,
        comment
      });
    }

    await plan.save();
    await plan.populate('ratings.user', 'name');

    res.json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


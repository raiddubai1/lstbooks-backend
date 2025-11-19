import express from 'express';
import Reminder from '../models/Reminder.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all reminders for current user
router.get('/my-reminders', authenticate, async (req, res) => {
  try {
    const { status, priority, upcoming } = req.query;
    
    const query = { user: req.user._id };
    
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'pending') {
      query.isCompleted = false;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    let reminders = await Reminder.find(query)
      .sort({ reminderDate: 1 });
    
    // Filter upcoming reminders (next 7 days)
    if (upcoming === 'true') {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      reminders = reminders.filter(r => 
        !r.isCompleted && 
        r.reminderDate >= now && 
        r.reminderDate <= nextWeek
      );
    }
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get overdue reminders
router.get('/overdue', authenticate, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      user: req.user._id,
      isCompleted: false,
      reminderDate: { $lt: new Date() }
    }).sort({ reminderDate: 1 });
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's reminders
router.get('/today', authenticate, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const reminders = await Reminder.find({
      user: req.user._id,
      isCompleted: false,
      reminderDate: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ reminderDate: 1 });
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single reminder
router.get('/:id', authenticate, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create reminder
router.post('/', authenticate, async (req, res) => {
  try {
    const reminder = new Reminder({
      ...req.body,
      user: req.user._id
    });
    
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update reminder
router.put('/:id', authenticate, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark reminder as completed
router.patch('/:id/complete', authenticate, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    await reminder.markCompleted();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete reminder
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


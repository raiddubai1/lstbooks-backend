import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // When to remind
  reminderDate: {
    type: Date,
    required: true,
    index: true
  },
  // Recurrence pattern
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none'
  },
  // Related content (optional)
  relatedContent: {
    contentType: {
      type: String,
      enum: ['subject', 'quiz', 'flashcard', 'lab', 'osce', 'skill', 'year', 'note', null]
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId
    },
    contentTitle: String
  },
  // Status
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  // Notification settings
  isNotified: {
    type: Boolean,
    default: false
  },
  notifiedAt: {
    type: Date
  },
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
reminderSchema.index({ user: 1, reminderDate: 1 });
reminderSchema.index({ user: 1, isCompleted: 1, reminderDate: 1 });
reminderSchema.index({ user: 1, priority: -1, reminderDate: 1 });

// Method to check if reminder is overdue
reminderSchema.methods.isOverdue = function() {
  return !this.isCompleted && new Date() > this.reminderDate;
};

// Method to mark as completed
reminderSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.completedAt = new Date();
  return this.save();
};

export default mongoose.model('Reminder', reminderSchema);


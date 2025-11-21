import mongoose from 'mongoose';

const dailyTaskSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  tasks: [{
    type: {
      type: String,
      enum: ['read', 'quiz', 'flashcard', 'video', 'practice', 'review'],
      required: true
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    resourceType: {
      type: String,
      enum: ['Book', 'RevisionNote', 'Quiz', 'Flashcard', 'Video', 'PastPaper', 'OSCE']
    },
    title: String,
    duration: Number, // in minutes
    completed: {
      type: Boolean,
      default: false
    }
  }],
  estimatedTime: Number // total minutes for the day
});

const studyPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  year: {
    type: String,
    enum: ['Foundation Year', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'All Years'],
    default: 'All Years'
  },
  duration: {
    type: Number,
    required: true // total days
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  category: {
    type: String,
    enum: ['exam-prep', 'subject-mastery', 'quick-review', 'comprehensive', 'osce-prep'],
    default: 'subject-mastery'
  },
  dailyTasks: [dailyTaskSchema],
  goals: [{
    type: String
  }],
  prerequisites: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enrollments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    currentDay: {
      type: Number,
      default: 1
    },
    completedDays: [{
      type: Number
    }],
    progress: {
      type: Number,
      default: 0 // percentage
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active'
    }
  }],
  totalEnrollments: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0 // percentage of users who completed
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
studyPlanSchema.index({ subject: 1, year: 1 });
studyPlanSchema.index({ category: 1, difficulty: 1 });
studyPlanSchema.index({ tags: 1 });
studyPlanSchema.index({ 'enrollments.user': 1 });

// Calculate average rating
studyPlanSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  
  // Update total enrollments
  this.totalEnrollments = this.enrollments.length;
  
  // Calculate completion rate
  const completed = this.enrollments.filter(e => e.status === 'completed').length;
  this.completionRate = this.totalEnrollments > 0 ? (completed / this.totalEnrollments) * 100 : 0;
  
  next();
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

export default StudyPlan;


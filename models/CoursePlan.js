import mongoose from 'mongoose';

const weekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true
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
  topics: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  resources: [{
    resourceType: {
      type: String,
      enum: ['video', 'pdf', 'quiz', 'flashcard', 'lab', 'osce', 'skill', 'resource', 'external'],
      required: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'weeks.resources.resourceType'
    },
    title: String,
    url: String,
    description: String
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    type: {
      type: String,
      enum: ['quiz', 'lab', 'reading', 'practice', 'project', 'other']
    }
  }],
  completed: {
    type: Boolean,
    default: false
  }
});

const coursePlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    index: true
  },
  year: {
    type: String,
    enum: ['Foundation', '1', '2', '3', '4', '5', 'All'],
    default: 'All',
    index: true
  },
  semester: {
    type: String,
    enum: ['1', '2', 'Summer', 'Full Year'],
    default: 'Full Year'
  },
  academicYear: {
    type: String, // e.g., "2024-2025"
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  weeks: [weekSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  totalWeeks: {
    type: Number,
    default: 0
  },
  completedWeeks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
coursePlanSchema.index({ subject: 1, year: 1 });
coursePlanSchema.index({ createdBy: 1, createdAt: -1 });
coursePlanSchema.index({ isTemplate: 1 });
coursePlanSchema.index({ tags: 1 });

// Virtual for progress percentage
coursePlanSchema.virtual('progressPercentage').get(function() {
  if (this.totalWeeks === 0) return 0;
  return Math.round((this.completedWeeks / this.totalWeeks) * 100);
});

// Update totalWeeks and completedWeeks before saving
coursePlanSchema.pre('save', function(next) {
  this.totalWeeks = this.weeks.length;
  this.completedWeeks = this.weeks.filter(w => w.completed).length;
  next();
});

// Ensure virtuals are included in JSON
coursePlanSchema.set('toJSON', { virtuals: true });
coursePlanSchema.set('toObject', { virtuals: true });

const CoursePlan = mongoose.model('CoursePlan', coursePlanSchema);

export default CoursePlan;


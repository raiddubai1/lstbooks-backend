import mongoose from 'mongoose';

const revisionNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  year: {
    type: String,
    enum: ['Foundation Year', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'All Years'],
    default: 'All Years'
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  mnemonics: [{
    acronym: String,
    meaning: String,
    explanation: String
  }],
  diagrams: [{
    title: String,
    imageUrl: String,
    description: String
  }],
  pdfUrl: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  estimatedReadTime: {
    type: Number, // in minutes
    default: 5
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['theory', 'clinical', 'practical', 'exam-prep', 'quick-review'],
    default: 'theory'
  },
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
  views: {
    type: Number,
    default: 0
  },
  downloads: {
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
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
revisionNoteSchema.index({ subject: 1, year: 1, topic: 1 });
revisionNoteSchema.index({ tags: 1 });
revisionNoteSchema.index({ category: 1 });
revisionNoteSchema.index({ createdBy: 1 });

// Calculate average rating before saving
revisionNoteSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

const RevisionNote = mongoose.model('RevisionNote', revisionNoteSchema);

export default RevisionNote;


import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  strengths: {
    type: String,
    required: true
  },
  improvements: {
    type: String,
    required: true
  },
  additionalComments: String,
  isAnonymous: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const peerReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Content type and reference
  contentType: {
    type: String,
    enum: ['note', 'essay', 'case-study', 'presentation', 'research', 'other'],
    required: true,
    index: true
  },
  // Related academic content
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    index: true
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    index: true
  },
  // Content details
  content: {
    type: String,
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String, // file type: pdf, doc, ppt, etc.
    size: Number
  }],
  // Review settings
  maxReviewers: {
    type: Number,
    default: 5,
    min: 1,
    max: 20
  },
  deadline: {
    type: Date,
    required: true
  },
  allowAnonymous: {
    type: Boolean,
    default: true
  },
  requireBothStrengthsAndImprovements: {
    type: Boolean,
    default: true
  },
  // Feedback
  feedback: [feedbackSchema],
  // Status
  status: {
    type: String,
    enum: ['open', 'in-review', 'completed', 'closed'],
    default: 'open',
    index: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // Tags for searchability
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound indexes
peerReviewSchema.index({ subject: 1, status: 1 });
peerReviewSchema.index({ year: 1, status: 1 });
peerReviewSchema.index({ contentType: 1, status: 1 });
peerReviewSchema.index({ author: 1, status: 1 });

// Virtual for feedback count
peerReviewSchema.virtual('feedbackCount').get(function() {
  return this.feedback.length;
});

// Virtual for average rating
peerReviewSchema.virtual('averageRating').get(function() {
  if (this.feedback.length === 0) return 0;
  const sum = this.feedback.reduce((acc, f) => acc + f.rating, 0);
  return (sum / this.feedback.length).toFixed(1);
});

// Virtual for is full
peerReviewSchema.virtual('isFull').get(function() {
  return this.feedback.length >= this.maxReviewers;
});

// Virtual for is expired
peerReviewSchema.virtual('isExpired').get(function() {
  return new Date() > this.deadline;
});

// Method to add feedback
peerReviewSchema.methods.addFeedback = function(reviewerId, feedbackData) {
  // Check if already reviewed
  const existingFeedback = this.feedback.find(f => f.reviewer.toString() === reviewerId.toString());
  if (existingFeedback) {
    throw new Error('You have already reviewed this submission');
  }
  
  // Check if full
  if (this.feedback.length >= this.maxReviewers) {
    throw new Error('Maximum number of reviewers reached');
  }
  
  // Check if expired
  if (new Date() > this.deadline) {
    throw new Error('Review deadline has passed');
  }
  
  // Check if author is trying to review their own work
  if (this.author.toString() === reviewerId.toString()) {
    throw new Error('You cannot review your own submission');
  }
  
  this.feedback.push({
    reviewer: reviewerId,
    ...feedbackData
  });
  
  // Update status
  if (this.feedback.length >= this.maxReviewers) {
    this.status = 'completed';
  } else if (this.feedback.length > 0 && this.status === 'open') {
    this.status = 'in-review';
  }
  
  return this.save();
};

// Ensure virtuals are included in JSON
peerReviewSchema.set('toJSON', { virtuals: true });
peerReviewSchema.set('toObject', { virtuals: true });

export default mongoose.model('PeerReview', peerReviewSchema);


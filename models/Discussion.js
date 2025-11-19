import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Related content (optional)
  relatedContent: {
    contentType: {
      type: String,
      enum: ['subject', 'quiz', 'flashcard', 'lab', 'osce', 'skill', 'year', null]
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId
    },
    contentTitle: String
  },
  // Subject for categorization
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    index: true
  },
  // Year for categorization
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    index: true
  },
  // Tags for better searchability
  tags: [{
    type: String,
    trim: true
  }],
  // Category
  category: {
    type: String,
    enum: ['question', 'discussion', 'announcement', 'resource'],
    default: 'discussion',
    index: true
  },
  // Replies
  replies: [replySchema],
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Status
  isPinned: {
    type: Boolean,
    default: false
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
discussionSchema.index({ subject: 1, createdAt: -1 });
discussionSchema.index({ year: 1, createdAt: -1 });
discussionSchema.index({ category: 1, createdAt: -1 });
discussionSchema.index({ author: 1, createdAt: -1 });
discussionSchema.index({ isPinned: -1, createdAt: -1 });
discussionSchema.index({ tags: 1 });

// Virtual for reply count
discussionSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Virtual for like count
discussionSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to add reply
discussionSchema.methods.addReply = function(userId, content) {
  this.replies.push({
    user: userId,
    content
  });
  return this.save();
};

// Method to toggle like
discussionSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Method to increment views
discussionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Ensure virtuals are included in JSON
discussionSchema.set('toJSON', { virtuals: true });
discussionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Discussion', discussionSchema);


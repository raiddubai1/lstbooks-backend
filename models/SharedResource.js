import mongoose from 'mongoose';

const sharedResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
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
  resourceType: {
    type: String,
    enum: ['file', 'link', 'note', 'video', 'document', 'presentation', 'other'],
    required: true,
    index: true
  },
  // For files
  fileUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  mimeType: {
    type: String
  },
  // For links
  externalUrl: {
    type: String
  },
  // For notes
  content: {
    type: String
  },
  // Categorization
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
  category: {
    type: String,
    enum: ['lecture-notes', 'study-guide', 'practice-questions', 'summary', 'reference', 'tutorial', 'other'],
    default: 'other',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Engagement
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Comments/Reviews
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Ratings
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }],
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  // Moderation
  isApproved: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
sharedResourceSchema.index({ subject: 1, year: 1 });
sharedResourceSchema.index({ resourceType: 1, category: 1 });
sharedResourceSchema.index({ author: 1, createdAt: -1 });
sharedResourceSchema.index({ isPublic: 1, isApproved: 1 });
sharedResourceSchema.index({ tags: 1 });

// Virtual for like count
sharedResourceSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
sharedResourceSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for average rating
sharedResourceSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

// Virtual for rating count
sharedResourceSchema.virtual('ratingCount').get(function() {
  return this.ratings ? this.ratings.length : 0;
});

// Ensure virtuals are included in JSON
sharedResourceSchema.set('toJSON', { virtuals: true });
sharedResourceSchema.set('toObject', { virtuals: true });

// Instance method to toggle like
sharedResourceSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
  } else {
    this.likes.push(userId);
  }
  return this.save();
};

// Instance method to add comment
sharedResourceSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text
  });
  return this.save();
};

// Instance method to add/update rating
sharedResourceSchema.methods.addRating = function(userId, rating) {
  const existingRating = this.ratings.find(r => r.user.toString() === userId.toString());
  if (existingRating) {
    existingRating.rating = rating;
  } else {
    this.ratings.push({ user: userId, rating });
  }
  return this.save();
};

// Instance method to increment views
sharedResourceSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment downloads
sharedResourceSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

const SharedResource = mongoose.model('SharedResource', sharedResourceSchema);

export default SharedResource;


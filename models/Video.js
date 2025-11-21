import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number, // in seconds
    required: true
  },
  description: String
});

const videoSchema = new mongoose.Schema({
  title: {
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
    ref: 'Subject',
    required: true
  },
  year: {
    type: String,
    required: true,
    enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
  },
  topic: {
    type: String,
    required: true
  },
  // Video source
  videoUrl: {
    type: String,
    required: true
  },
  videoType: {
    type: String,
    enum: ['youtube', 'vimeo', 'upload', 'external'],
    default: 'youtube'
  },
  thumbnailUrl: String,
  
  // Video metadata
  duration: {
    type: Number, // in seconds
    required: true
  },
  quality: {
    type: String,
    enum: ['720p', '1080p', '4k'],
    default: '1080p'
  },
  
  // Organization
  category: {
    type: String,
    enum: ['lecture', 'tutorial', 'demonstration', 'case-study', 'review', 'animation'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  tags: [String],
  
  // Chapters/Timestamps
  chapters: [chapterSchema],
  
  // Resources
  attachments: [{
    name: String,
    url: String,
    type: String // pdf, pptx, etc.
  }],
  
  // Instructor
  instructor: {
    name: String,
    credentials: String,
    bio: String
  },
  
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments
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
    timestamp: Number, // optional - comment on specific timestamp
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Watch progress tracking
  watchProgress: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number, // percentage 0-100
      default: 0
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  
  // Access control
  isPublic: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  
  // Creator
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
videoSchema.index({ subject: 1, year: 1, topic: 1 });
videoSchema.index({ category: 1, difficulty: 1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ 'watchProgress.user': 1 });

export default mongoose.model('Video', videoSchema);


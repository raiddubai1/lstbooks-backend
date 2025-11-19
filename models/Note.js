import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: 'blue',
    enum: ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'indigo', 'gray']
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  // Reference to specific content (optional)
  relatedContent: {
    contentType: {
      type: String,
      enum: ['quiz', 'flashcard', 'lab', 'osce', 'skill', 'year', null]
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  // Collaboration features (future)
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
noteSchema.index({ user: 1, subject: 1, createdAt: -1 });
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ user: 1, tags: 1 });

export default mongoose.model('Note', noteSchema);


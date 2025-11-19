import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  contentType: {
    type: String,
    required: true,
    enum: ['subject', 'quiz', 'flashcard', 'lab', 'osce', 'skill', 'year', 'note']
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Store content details for quick access (denormalized)
  contentDetails: {
    title: String,
    description: String,
    subjectName: String
  },
  // Optional notes about why bookmarked
  notes: {
    type: String,
    trim: true
  },
  // Folder/category for organization
  folder: {
    type: String,
    default: 'General',
    trim: true
  },
  // Priority/importance
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  // Quick access flag
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, contentType: 1, contentId: 1 }, { unique: true });

// Index for efficient queries
bookmarkSchema.index({ user: 1, folder: 1, createdAt: -1 });
bookmarkSchema.index({ user: 1, isFavorite: -1, createdAt: -1 });
bookmarkSchema.index({ user: 1, contentType: 1 });

export default mongoose.model('Bookmark', bookmarkSchema);


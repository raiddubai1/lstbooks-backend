import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['pdf', 'video', 'slide', 'document', 'image', 'audio', 'other'],
    required: true,
    index: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  fileSize: {
    type: Number // in bytes
  },
  duration: {
    type: Number // for videos/audio in seconds
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    index: true
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4', '5', 'All'],
    default: 'All'
  },
  topics: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // For external resources (YouTube, etc.)
  isExternal: {
    type: Boolean,
    default: false
  },
  externalSource: {
    type: String,
    enum: ['youtube', 'vimeo', 'google-drive', 'dropbox', 'other'],
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
resourceSchema.index({ type: 1, subject: 1 });
resourceSchema.index({ uploadedBy: 1, createdAt: -1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ featured: 1, createdAt: -1 });

// Virtual for formatted file size
resourceSchema.virtual('formattedSize').get(function() {
  if (!this.fileSize) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.fileSize === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for formatted duration
resourceSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Ensure virtuals are included in JSON
resourceSchema.set('toJSON', { virtuals: true });
resourceSchema.set('toObject', { virtuals: true });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;


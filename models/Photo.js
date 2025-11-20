import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Dental Anatomy',
      'Oral Pathology',
      'Periodontology',
      'Endodontics',
      'Prosthodontics',
      'Oral Surgery',
      'Orthodontics',
      'Pediatric Dentistry',
      'Radiology',
      'Clinical Cases',
      'Procedures',
      'Instruments',
      'Lab Work',
      'Other'
    ],
    default: 'Other'
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  resolution: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number // in bytes
  },
  source: {
    type: String,
    trim: true
  },
  copyright: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
photoSchema.index({ category: 1, subcategory: 1 });
photoSchema.index({ tags: 1 });
photoSchema.index({ featured: 1 });

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;


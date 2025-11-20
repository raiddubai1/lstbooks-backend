import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  stepNumber: {
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
    required: true
  },
  duration: {
    type: String, // e.g., "5-10 minutes"
    trim: true
  },
  materials: [{
    type: String,
    trim: true
  }],
  instruments: [{
    type: String,
    trim: true
  }],
  tips: [{
    type: String,
    trim: true
  }],
  warnings: [{
    type: String,
    trim: true
  }],
  imageUrl: String,
  videoUrl: String
});

const treatmentProtocolSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: [
      'Operative Dentistry',
      'Endodontics',
      'Periodontics',
      'Prosthodontics',
      'Oral Surgery',
      'Orthodontics',
      'Pediatric Dentistry',
      'Preventive Dentistry',
      'Emergency Procedures',
      'Diagnosis',
      'Radiology',
      'Anesthesia',
      'Other'
    ],
    required: true,
    index: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  estimatedTime: {
    type: String, // e.g., "45-60 minutes"
    trim: true
  },
  // Clinical Information
  indications: [{
    type: String,
    trim: true
  }],
  contraindications: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  // Step-by-step procedure
  steps: [stepSchema],
  // Materials and Equipment
  requiredMaterials: [{
    type: String,
    trim: true
  }],
  requiredInstruments: [{
    type: String,
    trim: true
  }],
  // Clinical Considerations
  complications: [{
    type: String,
    trim: true
  }],
  postTreatmentCare: [{
    type: String,
    trim: true
  }],
  followUp: {
    type: String,
    trim: true
  },
  // Evidence and References
  evidenceLevel: {
    type: String,
    enum: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Expert Opinion'],
    default: 'Expert Opinion'
  },
  references: [{
    title: String,
    authors: String,
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
  // Media
  thumbnailUrl: String,
  videoUrl: String,
  diagramUrls: [String],
  // Metadata
  tags: [{
    type: String,
    trim: true
  }],
  relatedProtocols: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TreatmentProtocol'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
treatmentProtocolSchema.index({ category: 1, difficulty: 1 });
treatmentProtocolSchema.index({ tags: 1 });
treatmentProtocolSchema.index({ verified: 1, featured: 1 });
treatmentProtocolSchema.index({ title: 'text', description: 'text', tags: 'text' });

const TreatmentProtocol = mongoose.model('TreatmentProtocol', treatmentProtocolSchema);

export default TreatmentProtocol;


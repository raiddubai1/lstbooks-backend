import mongoose from 'mongoose';

/**
 * Year Model
 * Represents academic years in the dental program
 * Foundation Year, Year 1, Year 2, Year 3, Year 4, Year 5
 */

const yearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Foundation Year', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
  },
  displayName: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 5
  },
  description: {
    type: String,
    required: true
  },
  // Year-specific resources
  resources: {
    videoSummaries: [{
      title: String,
      url: String,
      description: String,
      duration: Number, // in minutes
      thumbnail: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    pdfNotes: [{
      title: String,
      url: String,
      description: String,
      fileSize: Number, // in bytes
      pages: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    externalLinks: [{
      title: String,
      url: String,
      description: String,
      type: { type: String, enum: ['article', 'video', 'website', 'other'] }
    }]
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  // Statistics
  stats: {
    totalSubjects: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    totalFlashcards: { type: Number, default: 0 },
    totalLabs: { type: Number, default: 0 },
    totalOSCE: { type: Number, default: 0 },
    totalSkills: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
yearSchema.index({ order: 1 });
yearSchema.index({ name: 1 });

// Virtual for getting all subjects in this year
yearSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'yearId'
});

// Method to update stats
yearSchema.methods.updateStats = async function() {
  const Subject = mongoose.model('Subject');
  const Quiz = mongoose.model('Quiz');
  const Flashcard = mongoose.model('Flashcard');
  const Lab = mongoose.model('Lab');
  const OSCE = mongoose.model('OSCE');
  const Skill = mongoose.model('Skill');

  const subjects = await Subject.find({ yearId: this._id });
  const subjectIds = subjects.map(s => s._id);

  this.stats.totalSubjects = subjects.length;
  this.stats.totalQuizzes = await Quiz.countDocuments({ subjectId: { $in: subjectIds } });
  this.stats.totalFlashcards = await Flashcard.countDocuments({ subjectId: { $in: subjectIds } });
  this.stats.totalLabs = await Lab.countDocuments({ subjectId: { $in: subjectIds } });
  this.stats.totalOSCE = await OSCE.countDocuments({ subjectId: { $in: subjectIds } });
  this.stats.totalSkills = await Skill.countDocuments({ subjectId: { $in: subjectIds } });

  await this.save();
};

const Year = mongoose.model('Year', yearSchema);

export default Year;


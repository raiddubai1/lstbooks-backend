import mongoose from 'mongoose';

const pastPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer', 'Final', 'Midterm', 'Other'],
    default: 'Final'
  },
  examType: {
    type: String,
    enum: ['Final Exam', 'Midterm', 'Quiz', 'Mock Exam', 'Practice Test', 'Other'],
    default: 'Final Exam'
  },
  academicYear: {
    type: String,
    enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'All Years'],
    default: 'All Years'
  },
  fileUrl: {
    type: String,
    required: true,
    trim: true
  },
  solutionUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalMarks: {
    type: Number
  },
  duration: {
    type: Number, // in minutes
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  topics: [String],
  tags: [String],
  downloads: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
pastPaperSchema.index({ subject: 1, year: 1, academicYear: 1 });
pastPaperSchema.index({ examType: 1 });

const PastPaper = mongoose.model('PastPaper', pastPaperSchema);

export default PastPaper;


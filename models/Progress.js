import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number, // in seconds
  completedAt: { type: Date, default: Date.now }
});

const flashcardProgressSchema = new mongoose.Schema({
  flashcardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard' },
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 0 },
  repetitions: { type: Number, default: 0 },
  nextReview: Date,
  lastReviewed: Date,
  quality: Number // 0-5 rating from last review
});

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  quizAttempts: [quizAttemptSchema],
  flashcardProgress: [flashcardProgressSchema],
  completedChapters: [String],
  completedLabs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lab' }],
  completedOSCE: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OSCE' }],
  studyTime: { type: Number, default: 0 }, // in minutes
  lastAccessed: Date
}, {
  timestamps: true
});

export default mongoose.model('Progress', progressSchema);


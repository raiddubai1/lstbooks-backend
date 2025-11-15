import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true }, // UUID of the question
  answerProvided: { type: String, default: '' }, // User's answer
  correct: { type: Boolean, required: true }, // Whether answer was correct
  pointsEarned: { type: Number, default: 0 } // Points earned for this question
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for anonymous
  answers: [answerSchema],
  totalScore: { type: Number, required: true }, // Total points earned
  maxScore: { type: Number, required: true }, // Maximum possible points
  percent: { type: Number, required: true }, // Percentage score
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date, default: null },
  durationSec: { type: Number, default: 0 }, // Duration in seconds
  isTimedOut: { type: Boolean, default: false }, // Whether submission was due to timeout
  questionOrder: [String] // Array of question IDs in the order they were presented (for shuffled quizzes)
}, {
  timestamps: true
});

// Index for faster queries
quizAttemptSchema.index({ quizId: 1, createdAt: -1 });
quizAttemptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);


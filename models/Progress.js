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
  completedOSCE: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OSCEStation' }],
  completedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  studyTime: { type: Number, default: 0 }, // in minutes
  lastAccessed: Date,

  // Overall progress percentage (0-100)
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },

  // Milestones
  milestones: [{
    type: {
      type: String,
      enum: ['first_quiz', 'perfect_score', 'quiz_master', 'flashcard_master', 'lab_complete', 'osce_complete', 'skill_master', 'subject_complete']
    },
    achievedAt: { type: Date, default: Date.now },
    description: String
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ user: 1, subject: 1 }, { unique: true });

// Virtual for quiz statistics
progressSchema.virtual('quizStats').get(function() {
  if (this.quizAttempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0
    };
  }

  const totalAttempts = this.quizAttempts.length;
  const totalScore = this.quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const bestScore = Math.max(...this.quizAttempts.map(a => a.score));
  const totalTimeSpent = this.quizAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);

  return {
    totalAttempts,
    averageScore: Math.round(totalScore / totalAttempts),
    bestScore,
    totalTimeSpent: Math.round(totalTimeSpent / 60) // Convert to minutes
  };
});

// Virtual for flashcard statistics
progressSchema.virtual('flashcardStats').get(function() {
  if (this.flashcardProgress.length === 0) {
    return {
      total: 0,
      mastered: 0,
      learning: 0,
      reviewing: 0
    };
  }

  const mastered = this.flashcardProgress.filter(f => f.repetitions >= 3 && f.easeFactor >= 2.5).length;
  const learning = this.flashcardProgress.filter(f => f.repetitions === 0).length;
  const reviewing = this.flashcardProgress.length - mastered - learning;

  return {
    total: this.flashcardProgress.length,
    mastered,
    learning,
    reviewing
  };
});

// Method to calculate overall progress
progressSchema.methods.calculateOverallProgress = async function() {
  const Subject = mongoose.model('Subject');
  const Quiz = mongoose.model('Quiz');
  const Flashcard = mongoose.model('Flashcard');
  const Lab = mongoose.model('Lab');
  const OSCEStation = mongoose.model('OSCEStation');
  const Skill = mongoose.model('Skill');

  if (!this.subject) {
    this.overallProgress = 0;
    return;
  }

  // Get total counts for this subject
  const [totalQuizzes, totalFlashcards, totalLabs, totalOSCE, totalSkills] = await Promise.all([
    Quiz.countDocuments({ subjectId: this.subject }),
    Flashcard.countDocuments({ subjectId: this.subject }),
    Lab.countDocuments({ subjectId: this.subject }),
    OSCEStation.countDocuments({ subjectId: this.subject }),
    Skill.countDocuments({ subjectId: this.subject })
  ]);

  let totalWeight = 0;
  let weightedProgress = 0;

  // Quiz progress (30% weight)
  if (totalQuizzes > 0) {
    const uniqueQuizzes = new Set(this.quizAttempts.map(a => a.quizId.toString())).size;
    const quizProgress = (uniqueQuizzes / totalQuizzes) * 100;
    weightedProgress += quizProgress * 0.3;
    totalWeight += 0.3;
  }

  // Flashcard progress (25% weight)
  if (totalFlashcards > 0) {
    const flashcardProgress = (this.flashcardStats.mastered / totalFlashcards) * 100;
    weightedProgress += flashcardProgress * 0.25;
    totalWeight += 0.25;
  }

  // Lab progress (15% weight)
  if (totalLabs > 0) {
    const labProgress = (this.completedLabs.length / totalLabs) * 100;
    weightedProgress += labProgress * 0.15;
    totalWeight += 0.15;
  }

  // OSCE progress (20% weight)
  if (totalOSCE > 0) {
    const osceProgress = (this.completedOSCE.length / totalOSCE) * 100;
    weightedProgress += osceProgress * 0.2;
    totalWeight += 0.2;
  }

  // Skills progress (10% weight)
  if (totalSkills > 0) {
    const skillsProgress = (this.completedSkills.length / totalSkills) * 100;
    weightedProgress += skillsProgress * 0.1;
    totalWeight += 0.1;
  }

  // Calculate final progress
  this.overallProgress = totalWeight > 0 ? Math.round(weightedProgress / totalWeight) : 0;
};

// Method to check and award milestones
progressSchema.methods.checkMilestones = function() {
  const milestoneTypes = this.milestones.map(m => m.type);

  // First quiz completion
  if (this.quizAttempts.length === 1 && !milestoneTypes.includes('first_quiz')) {
    this.milestones.push({
      type: 'first_quiz',
      description: 'Completed your first quiz!'
    });
  }

  // Perfect score
  if (this.quizStats.bestScore === 100 && !milestoneTypes.includes('perfect_score')) {
    this.milestones.push({
      type: 'perfect_score',
      description: 'Achieved a perfect score!'
    });
  }

  // Flashcard master
  if (this.flashcardStats.mastered >= 50 && !milestoneTypes.includes('flashcard_master')) {
    this.milestones.push({
      type: 'flashcard_master',
      description: 'Mastered 50+ flashcards!'
    });
  }
};

// Set virtuals to be included in JSON
progressSchema.set('toJSON', { virtuals: true });
progressSchema.set('toObject', { virtuals: true });

export default mongoose.model('Progress', progressSchema);


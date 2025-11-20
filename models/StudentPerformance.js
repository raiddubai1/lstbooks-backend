import mongoose from 'mongoose';

/**
 * 📊 STUDENT PERFORMANCE MODEL
 * 
 * Tracks student learning progress, quiz scores, weak areas, and study patterns.
 * Used by AI to provide personalized recommendations and adaptive learning.
 */

const quizPerformanceSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number, // in seconds
  completedAt: {
    type: Date,
    default: Date.now
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  }
});

const topicPerformanceSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  attemptsCount: {
    type: Number,
    default: 0
  },
  lastAttempt: Date,
  trend: {
    type: String,
    enum: ['improving', 'declining', 'stable', 'new'],
    default: 'new'
  }
});

const studentPerformanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Overall Statistics
  overallStats: {
    totalQuizzesTaken: { type: Number, default: 0 },
    totalFlashcardsReviewed: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }, // in minutes
    averageQuizScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }, // days
    longestStreak: { type: Number, default: 0 }
  },
  
  // Quiz Performance History
  quizHistory: [quizPerformanceSchema],
  
  // Topic-wise Performance
  topicPerformance: [topicPerformanceSchema],
  
  // Weak Areas (topics with < 60% average score)
  weakAreas: [{
    topic: String,
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    averageScore: Number,
    needsReview: { type: Boolean, default: true }
  }],
  
  // Strong Areas (topics with > 80% average score)
  strongAreas: [{
    topic: String,
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    averageScore: Number
  }],
  
  // Learning Preferences (detected from behavior)
  learningProfile: {
    preferredStudyTime: String, // 'morning', 'afternoon', 'evening', 'night'
    averageSessionDuration: Number, // in minutes
    learningPace: { type: String, enum: ['fast', 'moderate', 'slow'], default: 'moderate' },
    difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  },
  
  // AI Recommendations
  recommendations: [{
    type: { type: String, enum: ['quiz', 'flashcard', 'video', 'topic', 'skill', 'lab', 'osce'] },
    contentId: mongoose.Schema.Types.ObjectId,
    reason: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false }
  }],
  
  // Study Goals
  goals: [{
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0, min: 0, max: 100 }
  }],
  
  // Last Activity
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
studentPerformanceSchema.index({ user: 1 });
studentPerformanceSchema.index({ 'weakAreas.topic': 1 });
studentPerformanceSchema.index({ 'strongAreas.topic': 1 });
studentPerformanceSchema.index({ lastActive: -1 });

// Update lastActive before saving
studentPerformanceSchema.pre('save', function(next) {
  this.lastActive = new Date();
  this.updatedAt = new Date();
  next();
});

// Instance method to add quiz result
studentPerformanceSchema.methods.addQuizResult = function(quizId, score, totalQuestions, correctAnswers, timeSpent, topic, subjectId) {
  // Add to quiz history
  this.quizHistory.push({
    quizId,
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    completedAt: new Date()
  });

  // Update overall stats
  this.overallStats.totalQuizzesTaken += 1;
  this.overallStats.totalStudyTime += Math.round(timeSpent / 60); // Convert to minutes

  // Recalculate average quiz score
  const totalScore = this.quizHistory.reduce((sum, q) => sum + q.score, 0);
  this.overallStats.averageQuizScore = Math.round(totalScore / this.quizHistory.length);

  // Update topic performance
  if (topic) {
    this.updateTopicPerformance(topic, subjectId, score);
  }

  return this.save();
};

// Instance method to update topic performance
studentPerformanceSchema.methods.updateTopicPerformance = function(topic, subjectId, score) {
  // Find existing topic performance
  let topicPerf = this.topicPerformance.find(t => t.topic === topic);

  if (topicPerf) {
    // Update existing
    const newAverage = ((topicPerf.averageScore * topicPerf.attemptsCount) + score) / (topicPerf.attemptsCount + 1);
    topicPerf.averageScore = Math.round(newAverage);
    topicPerf.attemptsCount += 1;
    topicPerf.lastAttempt = new Date();

    // Determine trend
    if (score > topicPerf.averageScore) {
      topicPerf.trend = 'improving';
    } else if (score < topicPerf.averageScore) {
      topicPerf.trend = 'declining';
    } else {
      topicPerf.trend = 'stable';
    }
  } else {
    // Create new
    this.topicPerformance.push({
      topic,
      subject: subjectId,
      averageScore: score,
      attemptsCount: 1,
      lastAttempt: new Date(),
      trend: 'new'
    });
  }

  // Update weak/strong areas
  this.updateWeakAndStrongAreas();
};

// Instance method to identify weak and strong areas
studentPerformanceSchema.methods.updateWeakAndStrongAreas = function() {
  this.weakAreas = [];
  this.strongAreas = [];

  this.topicPerformance.forEach(tp => {
    if (tp.averageScore < 60 && tp.attemptsCount >= 2) {
      this.weakAreas.push({
        topic: tp.topic,
        subject: tp.subject,
        averageScore: tp.averageScore,
        needsReview: true
      });
    } else if (tp.averageScore >= 80 && tp.attemptsCount >= 2) {
      this.strongAreas.push({
        topic: tp.topic,
        subject: tp.subject,
        averageScore: tp.averageScore
      });
    }
  });
};

// Instance method to get personalized recommendations
studentPerformanceSchema.methods.getRecommendations = function() {
  const recommendations = [];

  // Recommend quizzes for weak areas
  this.weakAreas.forEach(area => {
    recommendations.push({
      type: 'quiz',
      reason: `Practice ${area.topic} - Current score: ${area.averageScore}%`,
      priority: 'high'
    });
  });

  // Recommend advanced content for strong areas
  this.strongAreas.slice(0, 2).forEach(area => {
    recommendations.push({
      type: 'skill',
      reason: `Master ${area.topic} - You're doing great! (${area.averageScore}%)`,
      priority: 'low'
    });
  });

  return recommendations;
};

// Static method to get or create performance record
studentPerformanceSchema.statics.getOrCreate = async function(userId) {
  let performance = await this.findOne({ user: userId });

  if (!performance) {
    performance = new this({ user: userId });
    await performance.save();
  }

  return performance;
};

const StudentPerformance = mongoose.model('StudentPerformance', studentPerformanceSchema);

export default StudentPerformance;


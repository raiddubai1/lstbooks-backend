import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  category: {
    type: String,
    enum: ['learning', 'social', 'achievement', 'streak', 'special'],
    default: 'achievement'
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
});

const pointHistorySchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  description: String,
  relatedId: mongoose.Schema.Types.ObjectId,
  relatedType: {
    type: String,
    enum: ['quiz', 'flashcard', 'discussion', 'study-group', 'peer-review', 'shared-resource', 'ai-chat', 'other']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const streakSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily-login', 'study-session', 'quiz-completion'],
    required: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date
});

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  // Points System
  totalPoints: {
    type: Number,
    default: 0,
    index: true
  },
  level: {
    type: Number,
    default: 1,
    index: true
  },
  pointsToNextLevel: {
    type: Number,
    default: 100
  },
  pointHistory: [pointHistorySchema],
  
  // Badges
  badges: [badgeSchema],
  
  // Streaks
  streaks: [streakSchema],
  
  // Activity Stats
  stats: {
    quizzesCompleted: { type: Number, default: 0 },
    flashcardsReviewed: { type: Number, default: 0 },
    discussionsCreated: { type: Number, default: 0 },
    commentsPosted: { type: Number, default: 0 },
    studyGroupsJoined: { type: Number, default: 0 },
    peerReviewsGiven: { type: Number, default: 0 },
    resourcesShared: { type: Number, default: 0 },
    aiChatsStarted: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 }, // in minutes
    daysActive: { type: Number, default: 0 }
  },
  
  // Last activity tracking
  lastLoginDate: Date,
  lastStudyDate: Date
}, {
  timestamps: true
});

// Compound indexes
userProgressSchema.index({ totalPoints: -1, level: -1 });

// Virtual for badge count
userProgressSchema.virtual('badgeCount').get(function() {
  return this.badges.length;
});

// Calculate level based on points
userProgressSchema.methods.calculateLevel = function() {
  // Level formula: level = floor(sqrt(totalPoints / 100)) + 1
  const newLevel = Math.floor(Math.sqrt(this.totalPoints / 100)) + 1;
  this.level = newLevel;
  
  // Points needed for next level
  const nextLevelPoints = Math.pow(newLevel, 2) * 100;
  this.pointsToNextLevel = nextLevelPoints - this.totalPoints;
  
  return this.level;
};

// Add points
userProgressSchema.methods.addPoints = function(points, action, description, relatedId, relatedType) {
  this.totalPoints += points;
  this.pointHistory.push({
    points,
    action,
    description,
    relatedId,
    relatedType
  });
  
  this.calculateLevel();
  return this.save();
};

// Award badge
userProgressSchema.methods.awardBadge = function(badgeId, name, description, icon, category) {
  // Check if badge already earned
  const existingBadge = this.badges.find(b => b.badgeId === badgeId);
  if (existingBadge) {
    return this;
  }
  
  this.badges.push({
    badgeId,
    name,
    description,
    icon,
    category
  });
  
  return this.save();
};

// Update streak
userProgressSchema.methods.updateStreak = function(type) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = this.streaks.find(s => s.type === type);
  
  if (!streak) {
    streak = { type, currentStreak: 1, longestStreak: 1, lastActivityDate: today };
    this.streaks.push(streak);
  } else {
    const lastDate = new Date(streak.lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
      return this;
    } else if (daysDiff === 1) {
      // Consecutive day
      streak.currentStreak += 1;
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    } else {
      // Streak broken
      streak.currentStreak = 1;
    }
    
    streak.lastActivityDate = today;
  }
  
  return this.save();
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;


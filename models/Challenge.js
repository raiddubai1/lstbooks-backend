import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  pointsEarned: {
    type: Number,
    default: 0
  }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🎯'
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'special', 'community'],
    required: true
  },
  category: {
    type: String,
    enum: ['quiz', 'flashcard', 'study-time', 'social', 'streak', 'mixed'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  goal: {
    metric: {
      type: String,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    unit: String
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badge: {
      badgeId: String,
      name: String,
      description: String,
      icon: String,
      category: String
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [participantSchema],
  maxParticipants: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
challengeSchema.index({ type: 1, isActive: 1, startDate: 1, endDate: 1 });
challengeSchema.index({ 'participants.user': 1 });

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
  if (this.participants.length === 0) return 0;
  const completed = this.participants.filter(p => p.completed).length;
  return (completed / this.participants.length) * 100;
});

// Check if challenge is expired
challengeSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate;
});

// Check if challenge is full
challengeSchema.virtual('isFull').get(function() {
  if (this.maxParticipants === 0) return false;
  return this.participants.length >= this.maxParticipants;
});

// Instance method to join challenge
challengeSchema.methods.joinChallenge = function(userId) {
  const alreadyJoined = this.participants.some(p => p.user.toString() === userId.toString());
  if (alreadyJoined) {
    throw new Error('User already joined this challenge');
  }
  if (this.isFull) {
    throw new Error('Challenge is full');
  }
  if (this.isExpired) {
    throw new Error('Challenge has expired');
  }
  
  this.participants.push({ user: userId });
  return this.save();
};

// Instance method to update progress
challengeSchema.methods.updateProgress = function(userId, progress) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (!participant) {
    throw new Error('User not participating in this challenge');
  }
  
  participant.progress = progress;
  
  // Check if completed
  if (progress >= this.goal.target && !participant.completed) {
    participant.completed = true;
    participant.completedAt = new Date();
    participant.pointsEarned = this.rewards.points;
  }
  
  return this.save();
};

challengeSchema.set('toJSON', { virtuals: true });
challengeSchema.set('toObject', { virtuals: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;


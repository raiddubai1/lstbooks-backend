import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['learning', 'social', 'streak', 'milestone', 'special'],
    default: 'learning'
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  points: {
    type: Number,
    default: 0
  },
  criteria: {
    type: {
      type: String,
      enum: ['count', 'streak', 'total', 'percentage', 'custom'],
      required: true
    },
    metric: {
      type: String,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    comparison: {
      type: String,
      enum: ['gte', 'lte', 'eq', 'gt', 'lt'],
      default: 'gte'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for querying
achievementSchema.index({ category: 1, tier: 1, isActive: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;


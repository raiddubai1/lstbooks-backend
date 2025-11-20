import mongoose from 'mongoose';

// Card schema for individual flashcards in the spaced repetition system
const cardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  imageUrl: String,
  tags: [String],
  
  // Spaced repetition algorithm data (SM-2 algorithm)
  easeFactor: {
    type: Number,
    default: 2.5 // Initial ease factor
  },
  interval: {
    type: Number,
    default: 0 // Days until next review
  },
  repetitions: {
    type: Number,
    default: 0 // Number of successful repetitions
  },
  nextReviewDate: {
    type: Date,
    default: Date.now
  },
  lastReviewDate: Date,
  
  // Performance tracking
  totalReviews: {
    type: Number,
    default: 0
  },
  correctReviews: {
    type: Number,
    default: 0
  },
  incorrectReviews: {
    type: Number,
    default: 0
  },
  averageQuality: {
    type: Number,
    default: 0 // Average quality rating (0-5)
  },
  
  // Status
  status: {
    type: String,
    enum: ['new', 'learning', 'review', 'mastered'],
    default: 'new'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Deck schema for organizing cards
const deckSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  year: {
    type: String,
    enum: ['All', '1', '2', '3', '4', '5'],
    default: 'All'
  },
  category: {
    type: String,
    enum: [
      'Anatomy',
      'Physiology',
      'Pathology',
      'Pharmacology',
      'Clinical Skills',
      'Diagnosis',
      'Treatment',
      'Radiology',
      'Surgery',
      'Preventive',
      'Other'
    ],
    default: 'Other'
  },
  
  cards: [cardSchema],
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalCards: {
    type: Number,
    default: 0
  },
  newCards: {
    type: Number,
    default: 0
  },
  learningCards: {
    type: Number,
    default: 0
  },
  reviewCards: {
    type: Number,
    default: 0
  },
  masteredCards: {
    type: Number,
    default: 0
  },
  
  // Settings
  newCardsPerDay: {
    type: Number,
    default: 20
  },
  maxReviewsPerDay: {
    type: Number,
    default: 100
  },
  
  tags: [String],
  
  // Engagement
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subscriberCount: {
    type: Number,
    default: 0
  },
  
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Update statistics before saving
deckSchema.pre('save', function(next) {
  this.totalCards = this.cards.length;
  this.newCards = this.cards.filter(c => c.status === 'new').length;
  this.learningCards = this.cards.filter(c => c.status === 'learning').length;
  this.reviewCards = this.cards.filter(c => c.status === 'review').length;
  this.masteredCards = this.cards.filter(c => c.status === 'mastered').length;
  this.subscriberCount = this.subscribers.length;
  next();
});

export default mongoose.model('SpacedRepetitionDeck', deckSchema);


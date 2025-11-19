import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  assistantType: {
    type: String,
    enum: ['study-assistant', 'osce-coach', 'case-generator'],
    default: 'study-assistant',
    index: true
  },
  messages: [messageSchema],
  // Context
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year'
  },
  topic: {
    type: String
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  // Stats
  messageCount: {
    type: Number,
    default: 0
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes
chatSessionSchema.index({ user: 1, assistantType: 1 });
chatSessionSchema.index({ user: 1, createdAt: -1 });
chatSessionSchema.index({ user: 1, isPinned: -1, lastMessageAt: -1 });

// Update message count and last message time before saving
chatSessionSchema.pre('save', function(next) {
  this.messageCount = this.messages.length;
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

// Instance method to add message
chatSessionSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content });
  
  // Auto-generate title from first user message if still default
  if (this.title === 'New Chat' && role === 'user' && this.messages.length <= 2) {
    this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  }
  
  return this.save();
};

// Instance method to clear messages
chatSessionSchema.methods.clearMessages = function() {
  this.messages = [];
  this.messageCount = 0;
  return this.save();
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;


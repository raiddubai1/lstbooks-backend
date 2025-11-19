import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  scheduledAt: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  location: String,
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Related content
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    index: true
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    index: true
  },
  // Members
  members: [memberSchema],
  maxMembers: {
    type: Number,
    default: 20
  },
  // Privacy
  isPrivate: {
    type: Boolean,
    default: false
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  // Study sessions
  sessions: [sessionSchema],
  // Settings
  allowMemberInvites: {
    type: Boolean,
    default: true
  },
  requireApproval: {
    type: Boolean,
    default: false
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound indexes
studyGroupSchema.index({ subject: 1, isActive: 1 });
studyGroupSchema.index({ year: 1, isActive: 1 });
studyGroupSchema.index({ isPrivate: 1, isActive: 1 });

// Virtual for member count
studyGroupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for upcoming sessions
studyGroupSchema.virtual('upcomingSessions').get(function() {
  const now = new Date();
  return this.sessions.filter(s => new Date(s.scheduledAt) > now);
});

// Method to add member
studyGroupSchema.methods.addMember = function(userId, role = 'member') {
  if (this.members.length >= this.maxMembers) {
    throw new Error('Group is full');
  }
  
  const existingMember = this.members.find(m => m.user.toString() === userId.toString());
  if (existingMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({ user: userId, role });
  return this.save();
};

// Method to remove member
studyGroupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(m => m.user.toString() !== userId.toString());
  return this.save();
};

// Method to update member role
studyGroupSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  if (!member) {
    throw new Error('Member not found');
  }
  member.role = newRole;
  return this.save();
};

// Method to add session
studyGroupSchema.methods.addSession = function(sessionData, creatorId) {
  this.sessions.push({ ...sessionData, createdBy: creatorId });
  return this.save();
};

// Generate invite code
studyGroupSchema.methods.generateInviteCode = function() {
  this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  return this.save();
};

// Ensure virtuals are included in JSON
studyGroupSchema.set('toJSON', { virtuals: true });
studyGroupSchema.set('toObject', { virtuals: true });

export default mongoose.model('StudyGroup', studyGroupSchema);


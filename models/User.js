import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const bookmarkSchema = new mongoose.Schema({
  type: { type: String, enum: ['subject', 'chapter', 'quiz', 'flashcard', 'osce', 'lab'] },
  itemId: mongoose.Schema.Types.ObjectId,
  note: String,
  createdAt: { type: Date, default: Date.now }
});

const noteSchema = new mongoose.Schema({
  type: { type: String, enum: ['subject', 'chapter', 'quiz', 'flashcard', 'osce', 'lab'] },
  itemId: mongoose.Schema.Types.ObjectId,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
    required: true
  },
  year: Number,
  university: String,
  avatar: String,
  // Teacher-specific fields
  teacherProfile: {
    specialization: String,
    bio: String,
    qualifications: [String],
    yearsOfExperience: Number,
    subjectsTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
  },
  // Admin-specific fields
  adminProfile: {
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageContent: { type: Boolean, default: true },
      viewAnalytics: { type: Boolean, default: true },
      manageSettings: { type: Boolean, default: true }
    }
  },
  bookmarks: [bookmarkSchema],
  notes: [noteSchema],
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  },
  // Account status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);


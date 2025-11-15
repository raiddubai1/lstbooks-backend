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
  year: Number,
  university: String,
  avatar: String,
  bookmarks: [bookmarkSchema],
  notes: [noteSchema],
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
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


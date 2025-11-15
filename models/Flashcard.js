import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
}, {
  timestamps: true
});

export default mongoose.model('Flashcard', flashcardSchema);


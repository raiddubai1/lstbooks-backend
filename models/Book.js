import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number
  },
  edition: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Dental Anatomy', 'Oral Pathology', 'Periodontology', 'Endodontics', 'Prosthodontics', 'Oral Surgery', 'Orthodontics', 'Pediatric Dentistry', 'General', 'Other'],
    default: 'General'
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    trim: true
  },
  pages: {
    type: Number
  },
  language: {
    type: String,
    default: 'English'
  },
  available: {
    type: Boolean,
    default: true
  },
  tags: [String]
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;


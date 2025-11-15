import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { category, available, search } = req.query;
    
    // Build query
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (available !== undefined) {
      query.available = available === 'true';
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(query).sort({ createdAt: -1 });
    
    // If no books in database, return sample data
    if (books.length === 0) {
      return res.json([
        {
          _id: 'sample1',
          title: 'Dental Anatomy and Physiology',
          author: 'Dr. John Smith',
          isbn: '978-0-123456-78-9',
          publisher: 'Medical Publishers Inc.',
          publishedYear: 2023,
          edition: '5th Edition',
          category: 'Dental Anatomy',
          description: 'Comprehensive guide to dental anatomy and physiology for dental students.',
          pages: 450,
          language: 'English',
          available: true,
          tags: ['anatomy', 'physiology', 'dental']
        },
        {
          _id: 'sample2',
          title: 'Clinical Periodontology',
          author: 'Dr. Sarah Johnson',
          isbn: '978-0-987654-32-1',
          publisher: 'Dental Education Press',
          publishedYear: 2022,
          edition: '3rd Edition',
          category: 'Periodontology',
          description: 'Essential textbook covering all aspects of periodontal disease and treatment.',
          pages: 520,
          language: 'English',
          available: true,
          tags: ['periodontology', 'clinical', 'treatment']
        },
        {
          _id: 'sample3',
          title: 'Endodontics: Principles and Practice',
          author: 'Dr. Michael Brown',
          isbn: '978-0-456789-01-2',
          publisher: 'Advanced Dental Books',
          publishedYear: 2024,
          edition: '6th Edition',
          category: 'Endodontics',
          description: 'Modern approach to endodontic diagnosis and treatment techniques.',
          pages: 380,
          language: 'English',
          available: true,
          tags: ['endodontics', 'root canal', 'treatment']
        }
      ]);
    }
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new book
router.post('/', async (req, res) => {
  try {
    const bookData = req.body;

    // Validation
    if (!bookData.title || !bookData.author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


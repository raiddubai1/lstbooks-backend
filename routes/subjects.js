import express from 'express';
import Subject from '../models/Subject.js';
import Book from '../models/Book.js';
import PastPaper from '../models/PastPaper.js';
import Photo from '../models/Photo.js';
import TreatmentProtocol from '../models/TreatmentProtocol.js';
import Quiz from '../models/Quiz.js';
import { Deck } from '../models/SpacedRepetition.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all subjects (public - no auth required)
// Supports filtering by yearId: /api/subjects?yearId=xxx
router.get('/', async (req, res) => {
  try {
    const { yearId } = req.query;
    const query = yearId ? { yearId } : {};

    const subjects = await Subject.find(query)
      .populate('yearId', 'name displayName order')
      .sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subject by ID with all related resources
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('yearId', 'name displayName order');
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Fetch all related resources from different collections
    // Match by subject name (category field in most models)
    const subjectName = subject.name;

    const [books, pastPapers, photos, protocols, quizzes, flashcardDecks] = await Promise.all([
      // Books - match by category
      Book.find({ category: subjectName, available: true })
        .select('title author category coverImage pages')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Past Papers - match by subject field
      PastPaper.find({ subject: subjectName })
        .select('title subject year semester examType fileUrl')
        .limit(20)
        .sort({ year: -1, createdAt: -1 }),

      // Photos - match by category
      Photo.find({ category: subjectName })
        .select('title category imageUrl thumbnailUrl')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Treatment Protocols - match by category
      TreatmentProtocol.find({ category: subjectName })
        .select('title category difficulty estimatedTime thumbnailUrl')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Quizzes - match by subjectId
      Quiz.find({ subjectId: req.params.id, isPublic: true })
        .select('title description difficulty year questions createdBy isAIGenerated')
        .populate('createdBy', 'name')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Flashcard Decks - match by subject reference
      Deck.find({ subject: req.params.id, isPublic: true })
        .select('name description category totalCards owner')
        .populate('owner', 'name')
        .limit(20)
        .sort({ createdAt: -1 })
    ]);

    // Return subject with all aggregated resources
    res.json({
      ...subject.toObject(),
      relatedResources: {
        books,
        pastPapers,
        photos,
        protocols,
        quizzes,
        flashcardDecks
      },
      stats: {
        totalBooks: books.length,
        totalPastPapers: pastPapers.length,
        totalPhotos: photos.length,
        totalProtocols: protocols.length,
        totalQuizzes: quizzes.length,
        totalFlashcardDecks: flashcardDecks.length,
        totalResources: books.length + pastPapers.length + photos.length + protocols.length + quizzes.length + flashcardDecks.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subject (teacher or admin only)
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { name, description, resources, yearId } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const subject = new Subject({
      name,
      description,
      resources: resources || [],
      yearId: yearId || null
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { name, description, resources } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, description, resources },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subject (teacher or admin only)
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully', subject });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


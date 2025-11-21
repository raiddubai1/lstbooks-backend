import express from 'express';
import Year from '../models/Year.js';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import { Deck } from '../models/SpacedRepetition.js';
import Book from '../models/Book.js';
import PastPaper from '../models/PastPaper.js';
import Photo from '../models/Photo.js';
import TreatmentProtocol from '../models/TreatmentProtocol.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Get all years (public) with calculated stats
router.get('/', async (req, res) => {
  try {
    const years = await Year.find({ isActive: true }).sort({ order: 1 });

    // Calculate stats for each year
    const yearsWithStats = await Promise.all(years.map(async (year) => {
      const yearObj = year.toObject();

      // Get all subjects for this year
      const subjects = await Subject.find({ yearId: year._id });
      const subjectIds = subjects.map(s => s._id);

      // Count quizzes and flashcard decks for these subjects
      const [totalQuizzes, totalFlashcards] = await Promise.all([
        Quiz.countDocuments({ subjectId: { $in: subjectIds }, isPublic: true }),
        Deck.countDocuments({ subject: { $in: subjectIds }, isPublic: true })
      ]);

      // Update stats
      yearObj.stats = {
        ...yearObj.stats,
        totalSubjects: subjects.length,
        totalQuizzes,
        totalFlashcards,
        totalLabs: 0, // Not implemented yet
        totalOSCE: 0, // Not implemented yet
        totalSkills: 0, // Not implemented yet
        totalStudents: 0 // Not tracked yet
      };

      return yearObj;
    }));

    res.json(yearsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get year by ID with subjects and all related resources (public)
router.get('/:id', async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    // Get all subjects for this year
    const subjects = await Subject.find({ yearId: year._id }).sort({ name: 1 });
    const subjectIds = subjects.map(s => s._id);
    const subjectNames = subjects.map(s => s.name);

    // Map year name to academicYear format used in PastPaper model
    const yearNameMap = {
      'Foundation Year': 'Foundation Year',
      'Year 1': 'Year 1',
      'Year 2': 'Year 2',
      'Year 3': 'Year 3',
      'Year 4': 'Year 4',
      'Year 5': 'Year 5'
    };
    const academicYear = yearNameMap[year.name] || 'All Years';

    // Fetch all related resources from different collections in parallel
    const [books, pastPapers, photos, protocols, quizzes, flashcardDecks] = await Promise.all([
      // Books: match by category (subject names)
      Book.find({
        category: { $in: subjectNames },
        available: true
      })
        .select('title author category coverImage pages')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Past Papers: match by academicYear field
      PastPaper.find({
        academicYear: academicYear
      })
        .select('title subject year semester examType fileUrl')
        .limit(20)
        .sort({ year: -1, createdAt: -1 }),

      // Photos: match by category (subject names)
      Photo.find({
        category: { $in: subjectNames }
      })
        .select('title category imageUrl thumbnailUrl')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Treatment Protocols: match by category (subject names)
      TreatmentProtocol.find({
        category: { $in: subjectNames }
      })
        .select('title category difficulty estimatedTime thumbnailUrl')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Quizzes: match by subjectId
      Quiz.find({
        subjectId: { $in: subjectIds },
        isPublic: true
      })
        .select('title description difficulty year questions createdBy isAIGenerated')
        .populate('createdBy', 'name')
        .limit(20)
        .sort({ createdAt: -1 }),

      // Flashcard Decks: match by subject reference
      Deck.find({
        subject: { $in: subjectIds },
        isPublic: true
      })
        .select('name description category totalCards owner')
        .populate('owner', 'name')
        .limit(20)
        .sort({ createdAt: -1 })
    ]);

    const yearObj = year.toObject();
    yearObj.stats = {
      ...yearObj.stats,
      totalSubjects: subjects.length,
      totalQuizzes: quizzes.length,
      totalFlashcards: flashcardDecks.length,
      totalBooks: books.length,
      totalPastPapers: pastPapers.length,
      totalPhotos: photos.length,
      totalProtocols: protocols.length,
      totalResources: books.length + pastPapers.length + photos.length + protocols.length + quizzes.length + flashcardDecks.length,
      totalLabs: 0,
      totalOSCE: 0,
      totalSkills: 0,
      totalStudents: 0
    };

    res.json({
      ...yearObj,
      subjects,
      relatedResources: {
        books,
        pastPapers,
        photos,
        protocols,
        quizzes,
        flashcardDecks
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get year by name (public)
router.get('/name/:name', async (req, res) => {
  try {
    const year = await Year.findOne({ name: req.params.name });
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    // Get all subjects for this year
    const subjects = await Subject.find({ yearId: year._id }).sort({ name: 1 });

    res.json({
      ...year.toObject(),
      subjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update year (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { description, resources, isActive } = req.body;

    const year = await Year.findByIdAndUpdate(
      req.params.id,
      { description, resources, isActive },
      { new: true, runValidators: true }
    );

    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add video summary to year (teacher or admin only)
router.post('/:id/videos', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, url, description, duration, thumbnail } = req.body;

    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    year.resources.videoSummaries.push({
      title,
      url,
      description,
      duration,
      thumbnail
    });

    await year.save();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add PDF note to year (teacher or admin only)
router.post('/:id/pdfs', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, url, description, fileSize, pages } = req.body;

    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    year.resources.pdfNotes.push({
      title,
      url,
      description,
      fileSize,
      pages
    });

    await year.save();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update year stats (teacher or admin only)
router.post('/:id/update-stats', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ error: 'Year not found' });
    }

    await year.updateStats();
    res.json(year);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


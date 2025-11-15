import express from 'express';
import Flashcard from '../models/Flashcard.js';

const router = express.Router();

// Get all flashcards
router.get('/', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    if (subjectId) filter.subjectId = subjectId;

    const flashcards = await Flashcard.find(filter)
      .populate('subjectId', 'name description')
      .sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flashcard by ID
router.get('/:id', async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id)
      .populate('subjectId', 'name description');
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new flashcard
router.post('/', async (req, res) => {
  try {
    const { question, answer, subjectId } = req.body;

    if (!question || !answer || !subjectId) {
      return res.status(400).json({ error: 'Question, answer, and subjectId are required' });
    }

    const flashcard = new Flashcard({
      question,
      answer,
      subjectId
    });

    await flashcard.save();
    await flashcard.populate('subjectId', 'name description');
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flashcard
router.put('/:id', async (req, res) => {
  try {
    const { question, answer, subjectId } = req.body;

    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { question, answer, subjectId },
      { new: true, runValidators: true }
    ).populate('subjectId', 'name description');

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete flashcard
router.delete('/:id', async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);

    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


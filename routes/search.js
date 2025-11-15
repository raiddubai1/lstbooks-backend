import express from 'express';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import OSCE from '../models/OSCE.js';
import Lab from '../models/Lab.js';

const router = express.Router();

// Global search
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const searchRegex = new RegExp(q, 'i');

    const [subjects, quizzes, flashcards, osce, labs] = await Promise.all([
      Subject.find({ 
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { 'chapters.title': searchRegex }
        ]
      }).select('name code description').limit(10),
      
      Quiz.find({ title: searchRegex }).populate('subject', 'name').limit(10),
      
      Flashcard.find({ 
        $or: [
          { front: searchRegex },
          { back: searchRegex }
        ]
      }).populate('subject', 'name').limit(10),
      
      OSCE.find({ 
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).populate('subject', 'name').limit(10),
      
      Lab.find({ 
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      }).populate('subject', 'name').limit(10)
    ]);

    res.json({
      subjects,
      quizzes,
      flashcards,
      osce,
      labs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


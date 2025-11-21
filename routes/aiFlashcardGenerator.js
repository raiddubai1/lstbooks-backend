import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * POST /api/ai-flashcard-generator/generate
 * Generate flashcards using AI from a topic or PDF content
 * Available to all authenticated users for self-study
 */
router.post('/generate', authenticate, async (req, res) => {
  try {
    const {
      topic,
      content,
      cardCount,
      difficulty,
      subject,
      includeHints
    } = req.body;

    // Validate input
    if (!topic && !content) {
      return res.status(400).json({ error: 'Topic or content is required' });
    }

    const numCards = parseInt(cardCount) || 10;
    if (numCards < 1 || numCards > 50) {
      return res.status(400).json({ error: 'Card count must be between 1 and 50' });
    }

    // For now, generate sample flashcards based on the topic/content
    // In production, this would call an AI service (OpenAI, Claude, etc.)
    const generatedCards = generateSampleFlashcards(
      topic || 'Extracted from content',
      difficulty || 'medium',
      numCards,
      includeHints
    );

    res.json({
      success: true,
      flashcards: generatedCards,
      metadata: {
        topic: topic || 'From content',
        difficulty,
        cardCount: generatedCards.length,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai-flashcard-generator/create-deck
 * Generate and save flashcards to spaced repetition deck in one step
 * Available to all authenticated users for self-study
 * Students create private decks, teachers/admins can make them public
 */
router.post('/create-deck', authenticate, async (req, res) => {
  try {
    const {
      deckName,
      topic,
      content,
      cardCount,
      difficulty,
      subject,
      year,
      includeHints,
      isPublic
    } = req.body;

    // Generate flashcards
    const generatedCards = generateSampleFlashcards(
      topic || 'Extracted from content',
      difficulty || 'medium',
      parseInt(cardCount) || 10,
      includeHints
    );

    // Import SpacedRepetition model
    const SpacedRepetition = (await import('../models/SpacedRepetition.js')).default;

    // Determine if deck should be public based on user role
    // Teachers and admins can create public decks, students create private decks
    const shouldBePublic = (req.user.role === 'teacher' || req.user.role === 'admin') && isPublic;

    // Create deck with generated cards
    const deck = new SpacedRepetition({
      name: deckName || `AI Generated: ${topic || 'Flashcards'}`,
      description: `Auto-generated flashcard deck on ${topic || 'various topics'} with ${generatedCards.length} cards`,
      subject,
      year: year || 'All',
      category: 'Other',
      cards: generatedCards.map(card => ({
        front: card.front,
        back: card.back,
        tags: card.tags || []
      })),
      owner: req.user._id,
      isPublic: shouldBePublic,
      newCardsPerDay: 20,
      maxReviewsPerDay: 100
    });

    await deck.save();

    const populatedDeck = await SpacedRepetition.findById(deck._id)
      .populate('subject', 'name')
      .populate('owner', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      deck: populatedDeck
    });
  } catch (error) {
    console.error('Error creating flashcard deck:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Helper function to generate sample flashcards
 * In production, replace this with actual AI API calls
 */
function generateSampleFlashcards(topic, difficulty, count, includeHints) {
  const flashcards = [];
  const templates = getFlashcardTemplates(topic, difficulty);

  for (let i = 0; i < Math.min(count, templates.length * 2); i++) {
    const template = templates[i % templates.length];
    const variation = Math.floor(i / templates.length);
    
    const card = {
      front: variation === 0 ? template.front : template.altFront || template.front,
      back: template.back,
      tags: [topic, difficulty]
    };

    if (includeHints && template.hint) {
      card.hint = template.hint;
    }

    flashcards.push(card);
  }

  return flashcards;
}

/**
 * Get flashcard templates based on topic
 * This is a placeholder - in production, use AI to generate these
 */
function getFlashcardTemplates(topic, difficulty) {
  // Sample templates for dental topics
  const templates = [
    {
      front: `What is ${topic}?`,
      back: `${topic} is a fundamental concept in dentistry that involves specific procedures and techniques used in clinical practice.`,
      altFront: `Define ${topic}`,
      hint: 'Think about the basic definition and purpose'
    },
    {
      front: `What are the main indications for ${topic}?`,
      back: `The main indications include: 1) Clinical necessity, 2) Patient symptoms, 3) Diagnostic findings, 4) Treatment planning requirements.`,
      altFront: `When is ${topic} indicated?`,
      hint: 'Consider clinical scenarios'
    },
    {
      front: `What are the contraindications for ${topic}?`,
      back: `Contraindications may include: 1) Patient health conditions, 2) Anatomical limitations, 3) Insufficient bone/tissue, 4) Active infection.`,
      altFront: `When should ${topic} be avoided?`,
      hint: 'Think about patient safety'
    },
    {
      front: `What materials/instruments are used in ${topic}?`,
      back: `Common materials include: composite resin, amalgam, glass ionomer, or specialized instruments depending on the specific procedure.`,
      altFront: `List the key materials for ${topic}`,
      hint: 'Consider the clinical setup'
    },
    {
      front: `What are the steps involved in ${topic}?`,
      back: `The procedure typically involves: 1) Preparation, 2) Isolation, 3) Main procedure, 4) Finishing, 5) Post-operative care.`,
      altFront: `Describe the procedure for ${topic}`,
      hint: 'Think step-by-step'
    },
    {
      front: `What are common complications of ${topic}?`,
      back: `Potential complications include: pain, swelling, infection, bleeding, or procedure-specific issues that require monitoring.`,
      altFront: `What can go wrong with ${topic}?`,
      hint: 'Consider post-operative issues'
    },
    {
      front: `What is the prognosis for ${topic}?`,
      back: `The prognosis is generally good when performed correctly, with success rates varying based on patient factors and technique.`,
      altFront: `What are the expected outcomes of ${topic}?`,
      hint: 'Think about long-term results'
    },
    {
      front: `What patient education is needed for ${topic}?`,
      back: `Patients should be informed about: procedure details, expected outcomes, post-operative care, and potential complications.`,
      altFront: `What should patients know about ${topic}?`,
      hint: 'Consider informed consent'
    }
  ];

  return templates;
}

export default router;


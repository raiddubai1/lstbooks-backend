import express from 'express';
import SpacedRepetitionDeck from '../models/SpacedRepetition.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/spaced-repetition/decks
 * Get all decks (user's own + public decks)
 */
router.get('/decks', authenticate, async (req, res) => {
  try {
    const { category, subject, year, search } = req.query;

    const query = {
      $or: [
        { owner: req.user._id },
        { isPublic: true }
      ]
    };

    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (year && year !== 'All') query.year = year;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const decks = await SpacedRepetitionDeck.find(query)
      .populate('subject', 'name')
      .populate('owner', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spaced-repetition/decks/:id
 * Get single deck with cards
 */
router.get('/decks/:id', authenticate, async (req, res) => {
  try {
    const deck = await SpacedRepetitionDeck.findById(req.params.id)
      .populate('subject', 'name')
      .populate('owner', 'name email')
      .lean();

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Check access
    if (!deck.isPublic && deck.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/decks
 * Create new deck
 */
router.post('/decks', authenticate, async (req, res) => {
  try {
    const deck = new SpacedRepetitionDeck({
      ...req.body,
      owner: req.user._id
    });

    await deck.save();

    const populatedDeck = await SpacedRepetitionDeck.findById(deck._id)
      .populate('subject', 'name')
      .populate('owner', 'name email')
      .lean();

    res.status(201).json(populatedDeck);
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/spaced-repetition/decks/:id
 * Update deck
 */
router.put('/decks/:id', authenticate, async (req, res) => {
  try {
    const deck = await SpacedRepetitionDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    if (deck.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(deck, req.body);
    await deck.save();

    const populatedDeck = await SpacedRepetitionDeck.findById(deck._id)
      .populate('subject', 'name')
      .populate('owner', 'name email')
      .lean();

    res.json(populatedDeck);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/spaced-repetition/decks/:id
 * Delete deck
 */
router.delete('/decks/:id', authenticate, async (req, res) => {
  try {
    const deck = await SpacedRepetitionDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    if (deck.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await deck.deleteOne();
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: error.message });
  }


/**
 * GET /api/spaced-repetition/decks/:id/due-cards
 * Get cards due for review
 */
router.get('/decks/:id/due-cards', authenticate, async (req, res) => {
  try {
    const deck = await SpacedRepetitionDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Get cards due for review
    const now = new Date();
    const dueCards = deck.cards.filter(card =>
      new Date(card.nextReviewDate) <= now
    );

    // Limit by settings
    const newCardsToday = dueCards.filter(c => c.status === 'new').slice(0, deck.newCardsPerDay);
    const reviewCards = dueCards.filter(c => c.status !== 'new').slice(0, deck.maxReviewsPerDay);

    const cardsToStudy = [...newCardsToday, ...reviewCards];

    res.json({
      deck: {
        _id: deck._id,
        name: deck.name,
        totalCards: deck.totalCards,
        newCards: deck.newCards,
        reviewCards: deck.reviewCards
      },
      dueCards: cardsToStudy,
      dueCount: cardsToStudy.length
    });
  } catch (error) {
    console.error('Error fetching due cards:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/decks/:deckId/cards/:cardId/review
 * Submit card review (SM-2 algorithm)
 */
router.post('/decks/:deckId/cards/:cardId/review', authenticate, async (req, res) => {
  try {
    const { quality } = req.body; // Quality: 0-5 (0=complete blackout, 5=perfect response)

    if (quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'Quality must be between 0 and 5' });
    }

    const deck = await SpacedRepetitionDeck.findById(req.params.deckId);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const card = deck.cards.id(req.params.cardId);

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // SM-2 Algorithm
    const oldEaseFactor = card.easeFactor;
    const oldInterval = card.interval;
    const oldRepetitions = card.repetitions;

    // Update ease factor
    let newEaseFactor = oldEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newInterval;
    let newRepetitions;

    if (quality < 3) {
      // Incorrect response - restart
      newRepetitions = 0;
      newInterval = 1;
      card.status = 'learning';
      card.incorrectReviews += 1;
    } else {
      // Correct response
      if (oldRepetitions === 0) {
        newInterval = 1;
        newRepetitions = 1;
        card.status = 'learning';
      } else if (oldRepetitions === 1) {
        newInterval = 6;
        newRepetitions = 2;
        card.status = 'review';
      } else {
        newInterval = Math.round(oldInterval * newEaseFactor);
        newRepetitions = oldRepetitions + 1;

        // Mark as mastered if interval > 21 days
        if (newInterval > 21) {
          card.status = 'mastered';
        } else {
          card.status = 'review';
        }
      }
      card.correctReviews += 1;
    }

    // Update card
    card.easeFactor = newEaseFactor;
    card.interval = newInterval;
    card.repetitions = newRepetitions;
    card.lastReviewDate = new Date();
    card.nextReviewDate = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    card.totalReviews += 1;
    card.averageQuality = ((card.averageQuality * (card.totalReviews - 1)) + quality) / card.totalReviews;

    await deck.save();

    res.json({
      card: card.toObject(),
      nextReviewDate: card.nextReviewDate,
      interval: newInterval,
      status: card.status
    });
  } catch (error) {
    console.error('Error reviewing card:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/decks/:id/subscribe
 * Subscribe to a public deck
 */
router.post('/decks/:id/subscribe', authenticate, async (req, res) => {
  try {
    const deck = await SpacedRepetitionDeck.findById(req.params.id);

    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    if (!deck.isPublic) {
      return res.status(403).json({ error: 'Cannot subscribe to private deck' });
    }

    if (!deck.subscribers.includes(req.user._id)) {
      deck.subscribers.push(req.user._id);
      await deck.save();
    }

    res.json({ message: 'Subscribed successfully', subscriberCount: deck.subscriberCount });
  } catch (error) {
    console.error('Error subscribing to deck:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


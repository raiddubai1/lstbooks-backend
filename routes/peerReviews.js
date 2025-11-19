import express from 'express';
import PeerReview from '../models/PeerReview.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all peer reviews with filters
router.get('/', async (req, res) => {
  try {
    const { subject, year, contentType, status, search } = req.query;
    
    const query = {};
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (contentType) query.contentType = contentType;
    if (status) query.status = status;
    
    // Only show public reviews or user's own reviews
    if (req.user) {
      query.$or = [
        { isPublic: true },
        { author: req.user._id }
      ];
    } else {
      query.isPublic = true;
    }
    
    let reviews = await PeerReview.find(query)
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('feedback.reviewer', 'name email')
      .sort({ createdAt: -1 });
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      reviews = reviews.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my peer reviews (submitted)
router.get('/my-submissions', authenticate, async (req, res) => {
  try {
    const reviews = await PeerReview.find({ author: req.user._id })
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('feedback.reviewer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my reviews (given)
router.get('/my-reviews', authenticate, async (req, res) => {
  try {
    const reviews = await PeerReview.find({ 'feedback.reviewer': req.user._id })
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('feedback.reviewer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single peer review
router.get('/:id', async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id)
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('feedback.reviewer', 'name email');
    
    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }
    
    // Check if user has access
    if (!review.isPublic && req.user) {
      if (review.author._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'This review is private' });
      }
    } else if (!review.isPublic && !req.user) {
      return res.status(403).json({ error: 'This review is private' });
    }
    
    // Hide reviewer identity if anonymous
    review.feedback = review.feedback.map(f => {
      if (f.isAnonymous && req.user && f.reviewer._id.toString() !== req.user._id.toString()) {
        return {
          ...f.toObject(),
          reviewer: { name: 'Anonymous', email: '' }
        };
      }
      return f;
    });
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create peer review
router.post('/', authenticate, async (req, res) => {
  try {
    const review = new PeerReview({
      ...req.body,
      author: req.user._id
    });
    
    await review.save();
    await review.populate('author', 'name email');
    await review.populate('subject', 'name');
    await review.populate('year', 'name');
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update peer review
router.put('/:id', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    // Check if user is author
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the author can update this review' });
    }

    // Don't allow updates if there's already feedback
    if (review.feedback.length > 0) {
      return res.status(400).json({ error: 'Cannot update review after receiving feedback' });
    }

    Object.assign(review, req.body);
    await review.save();
    await review.populate('author', 'name email');
    await review.populate('subject', 'name');
    await review.populate('year', 'name');

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete peer review
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    // Check if user is author
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the author can delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Peer review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit feedback
router.post('/:id/feedback', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    await review.addFeedback(req.user._id, req.body);
    await review.populate('feedback.reviewer', 'name email');

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update feedback (only your own)
router.put('/:id/feedback/:feedbackId', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    const feedback = review.feedback.id(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check if user is the reviewer
    if (feedback.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own feedback' });
    }

    // Update feedback fields
    Object.assign(feedback, req.body);
    await review.save();
    await review.populate('feedback.reviewer', 'name email');

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete feedback (only your own)
router.delete('/:id/feedback/:feedbackId', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    const feedback = review.feedback.id(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Check if user is the reviewer
    if (feedback.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own feedback' });
    }

    feedback.deleteOne();

    // Update status if needed
    if (review.feedback.length === 0) {
      review.status = 'open';
    }

    await review.save();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update status (author only)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Peer review not found' });
    }

    // Check if user is author
    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the author can update the status' });
    }

    review.status = req.body.status;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;


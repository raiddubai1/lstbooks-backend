import express from 'express';
import Discussion from '../models/Discussion.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all discussions with filters
router.get('/', async (req, res) => {
  try {
    const { subject, year, category, tags, search, sort = 'recent' } = req.query;
    
    const query = {};
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (category) query.category = category;
    if (tags) query.tags = { $in: tags.split(',') };
    
    let discussions = await Discussion.find(query)
      .populate('author', 'name email role')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('replies.user', 'name email role');
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      discussions = discussions.filter(d => 
        d.title.toLowerCase().includes(searchLower) ||
        d.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    if (sort === 'recent') {
      discussions.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === 'popular') {
      discussions.sort((a, b) => b.views - a.views);
    } else if (sort === 'mostLiked') {
      discussions.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sort === 'mostReplies') {
      discussions.sort((a, b) => b.replies.length - a.replies.length);
    }
    
    // Pinned discussions first
    const pinned = discussions.filter(d => d.isPinned);
    const regular = discussions.filter(d => !d.isPinned);
    
    res.json([...pinned, ...regular]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single discussion
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'name email role')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('replies.user', 'name email role');
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    // Increment views
    await discussion.incrementViews();
    
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my discussions
router.get('/user/my-discussions', authenticate, async (req, res) => {
  try {
    const discussions = await Discussion.find({ author: req.user._id })
      .populate('subject', 'name')
      .populate('year', 'name')
      .sort({ createdAt: -1 });
    
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create discussion
router.post('/', authenticate, async (req, res) => {
  try {
    const discussion = new Discussion({
      ...req.body,
      author: req.user._id
    });
    
    await discussion.save();
    await discussion.populate('author', 'name email role');
    await discussion.populate('subject', 'name');
    await discussion.populate('year', 'name');
    
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update discussion
router.put('/:id', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ 
      _id: req.params.id, 
      author: req.user._id 
    });
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found or unauthorized' });
    }
    
    Object.assign(discussion, req.body);
    await discussion.save();
    await discussion.populate('author', 'name email role');
    await discussion.populate('subject', 'name');
    await discussion.populate('year', 'name');
    
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete discussion
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ 
      _id: req.params.id, 
      author: req.user._id 
    });
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found or unauthorized' });
    }
    
    await discussion.deleteOne();
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle like on discussion
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    
    await discussion.toggleLike(req.user._id);
    res.json({ likes: discussion.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply to discussion
router.post('/:id/replies', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    if (discussion.isClosed) {
      return res.status(400).json({ error: 'Discussion is closed' });
    }

    await discussion.addReply(req.user._id, req.body.content);
    await discussion.populate('replies.user', 'name email role');

    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle like on reply
router.post('/:id/replies/:replyId/like', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    const index = reply.likes.indexOf(req.user._id);
    if (index > -1) {
      reply.likes.splice(index, 1);
    } else {
      reply.likes.push(req.user._id);
    }

    await discussion.save();
    res.json({ likes: reply.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark reply as accepted answer
router.patch('/:id/replies/:replyId/accept', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    // Only author can accept answers
    if (discussion.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the author can accept answers' });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Unmark all other replies
    discussion.replies.forEach(r => {
      r.isAcceptedAnswer = false;
    });

    // Mark this reply as accepted
    reply.isAcceptedAnswer = true;
    discussion.isResolved = true;

    await discussion.save();
    await discussion.populate('replies.user', 'name email role');

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete reply
router.delete('/:id/replies/:replyId', authenticate, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Only reply author or discussion author can delete
    if (reply.user.toString() !== req.user._id.toString() &&
        discussion.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    reply.deleteOne();
    await discussion.save();

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle pin (admin/teacher only)
router.patch('/:id/pin', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers and admins can pin discussions' });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle close (admin/teacher only)
router.patch('/:id/close', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers and admins can close discussions' });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    discussion.isClosed = !discussion.isClosed;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


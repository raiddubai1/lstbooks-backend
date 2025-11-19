import express from 'express';
import SharedResource from '../models/SharedResource.js';
import { authenticate, requireTeacherOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all shared resources with filters
router.get('/', async (req, res) => {
  try {
    const { subject, year, resourceType, category, search, featured, sortBy } = req.query;
    
    const query = {
      isPublic: true,
      isApproved: true
    };
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    if (resourceType) query.resourceType = resourceType;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let sortOptions = { createdAt: -1 };
    if (sortBy === 'popular') sortOptions = { downloads: -1, views: -1 };
    if (sortBy === 'likes') sortOptions = { likes: -1 };
    if (sortBy === 'recent') sortOptions = { createdAt: -1 };
    
    const resources = await SharedResource.find(query)
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('comments.user', 'name email')
      .sort(sortOptions);
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my shared resources
router.get('/my-resources', authenticate, async (req, res) => {
  try {
    const resources = await SharedResource.find({ author: req.user._id })
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured resources
router.get('/featured', async (req, res) => {
  try {
    const resources = await SharedResource.find({ 
      isFeatured: true,
      isPublic: true,
      isApproved: true
    })
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .limit(10)
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single shared resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id)
      .populate('author', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('comments.user', 'name email')
      .populate('ratings.user', 'name');
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Increment views
    await resource.incrementViews();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create shared resource
router.post('/', authenticate, async (req, res) => {
  try {
    const resource = new SharedResource({
      ...req.body,
      author: req.user._id
    });
    
    await resource.save();
    await resource.populate('author', 'name email');
    await resource.populate('subject', 'name');
    await resource.populate('year', 'name');
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update shared resource
router.put('/:id', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Only author can update
    if (resource.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }
    
    Object.assign(resource, req.body);
    await resource.save();
    await resource.populate('author', 'name email');
    await resource.populate('subject', 'name');
    await resource.populate('year', 'name');
    
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete shared resource
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Only author or admin can delete
    if (resource.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }
    
    await SharedResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle like
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    await resource.toggleLike(req.user._id);
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    await resource.addComment(req.user._id, req.body.text);
    await resource.populate('comments.user', 'name email');
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id/comments/:commentId', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const comment = resource.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Only comment author or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    comment.deleteOne();
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update rating
router.post('/:id/rating', authenticate, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    await resource.addRating(req.user._id, rating);
    res.json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Increment downloads
router.post('/:id/download', async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    await resource.incrementDownloads();
    res.json({ message: 'Download counted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle featured (admin/teacher only)
router.patch('/:id/featured', requireTeacherOrAdmin, async (req, res) => {
  try {
    const resource = await SharedResource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    resource.isFeatured = !resource.isFeatured;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


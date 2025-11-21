import express from 'express';
import Video from '../models/Video.js';
import { auth, isTeacher, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all videos with filters
router.get('/', async (req, res) => {
  try {
    const { 
      subject, 
      year, 
      topic, 
      category, 
      difficulty, 
      search,
      sort = '-createdAt',
      limit = 50
    } = req.query;
    
    const filter = { isPublic: true };
    
    if (subject) filter.subject = subject;
    if (year) filter.year = year;
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }
    
    const videos = await Video.find(filter)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name')
      .sort(sort)
      .limit(parseInt(limit))
      .select('-comments -watchProgress'); // Exclude large arrays
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name email')
      .populate('comments.user', 'name');
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's watch history
router.get('/user/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const videos = await Video.find({ 'watchProgress.user': userId })
      .populate('subject', 'name')
      .select('title description thumbnailUrl duration category watchProgress')
      .sort('-watchProgress.lastWatchedAt');
    
    // Filter to only include user's progress
    const history = videos.map(video => {
      const userProgress = video.watchProgress.find(
        p => p.user.toString() === userId
      );
      return {
        ...video.toObject(),
        userProgress
      };
    });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new video (teachers/admins only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const video = new Video({
      ...req.body,
      uploadedBy: req.user.userId
    });
    
    await video.save();
    await video.populate('subject', 'name');
    
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update video
router.put('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Check if user is creator or admin
    if (video.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this video' });
    }
    
    Object.assign(video, req.body);
    await video.save();
    await video.populate('subject', 'name');
    
    res.json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete video (admins only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike video
router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user.userId;
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const likeIndex = video.likes.findIndex(
      like => like.user.toString() === userId
    );
    
    if (likeIndex > -1) {
      // Unlike
      video.likes.splice(likeIndex, 1);
    } else {
      // Like
      video.likes.push({ user: userId });
    }
    
    await video.save();
    res.json({ likes: video.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text, timestamp } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    video.comments.push({
      user: req.user.userId,
      text,
      timestamp
    });

    await video.save();
    await video.populate('comments.user', 'name');

    res.json(video.comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update watch progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body; // 0-100
    const video = await Video.findById(req.params.id);
    const userId = req.user.userId;

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const progressIndex = video.watchProgress.findIndex(
      p => p.user.toString() === userId
    );

    const completed = progress >= 90; // Consider completed if 90%+ watched

    if (progressIndex > -1) {
      // Update existing progress
      video.watchProgress[progressIndex].progress = progress;
      video.watchProgress[progressIndex].lastWatchedAt = new Date();
      video.watchProgress[progressIndex].completed = completed;
    } else {
      // Add new progress
      video.watchProgress.push({
        user: userId,
        progress,
        completed
      });
    }

    await video.save();
    res.json({ progress, completed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video statistics (for teachers/admins)
router.get('/:id/stats', auth, isTeacher, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const stats = {
      views: video.views,
      likes: video.likes.length,
      comments: video.comments.length,
      totalWatchers: video.watchProgress.length,
      completedWatchers: video.watchProgress.filter(p => p.completed).length,
      averageProgress: video.watchProgress.length > 0
        ? video.watchProgress.reduce((sum, p) => sum + p.progress, 0) / video.watchProgress.length
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


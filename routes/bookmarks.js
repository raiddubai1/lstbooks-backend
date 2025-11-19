import express from 'express';
import Bookmark from '../models/Bookmark.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all bookmarks for current user
router.get('/my-bookmarks', authenticate, async (req, res) => {
  try {
    const { contentType, folder, isFavorite } = req.query;
    
    const query = { user: req.user._id };
    
    if (contentType) {
      query.contentType = contentType;
    }
    
    if (folder) {
      query.folder = folder;
    }
    
    if (isFavorite !== undefined) {
      query.isFavorite = isFavorite === 'true';
    }
    
    const bookmarks = await Bookmark.find(query)
      .sort({ isFavorite: -1, createdAt: -1 });
    
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all folders for current user
router.get('/folders', authenticate, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id });
    const folders = [...new Set(bookmarks.map(b => b.folder))].sort();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if content is bookmarked
router.get('/check/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      contentType,
      contentId
    });
    res.json({ isBookmarked: !!bookmark, bookmark });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create bookmark
router.post('/', authenticate, async (req, res) => {
  try {
    const bookmark = new Bookmark({
      ...req.body,
      user: req.user._id
    });
    
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Content already bookmarked' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Update bookmark
router.put('/:id', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle favorite status
router.patch('/:id/favorite', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    bookmark.isFavorite = !bookmark.isFavorite;
    await bookmark.save();
    
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete bookmark
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete bookmark by content
router.delete('/content/:contentType/:contentId', authenticate, async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      contentType,
      contentId
    });
    
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


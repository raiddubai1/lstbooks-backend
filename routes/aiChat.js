import express from 'express';
import ChatSession from '../models/ChatSession.js';
import { authenticate } from '../middleware/auth.js';
import { generateAIResponse, checkAIServiceHealth } from '../services/aiService.js';

const router = express.Router();

// Get all chat sessions for user
router.get('/sessions', authenticate, async (req, res) => {
  try {
    const { assistantType } = req.query;
    
    const query = { user: req.user._id };
    if (assistantType) query.assistantType = assistantType;
    
    const sessions = await ChatSession.find(query)
      .populate('subject', 'name')
      .populate('year', 'name')
      .sort({ isPinned: -1, lastMessageAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chat session
router.get('/sessions/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('subject', 'name')
      .populate('year', 'name');
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new chat session
router.post('/sessions', authenticate, async (req, res) => {
  try {
    const session = new ChatSession({
      user: req.user._id,
      ...req.body
    });
    
    await session.save();
    await session.populate('subject', 'name');
    await session.populate('year', 'name');
    
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update chat session
router.put('/sessions/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    // Only allow updating certain fields
    const allowedUpdates = ['title', 'subject', 'year', 'topic', 'isPinned', 'tags'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });
    
    await session.save();
    await session.populate('subject', 'name');
    await session.populate('year', 'name');
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete chat session
router.delete('/sessions/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatSession.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message to AI
router.post('/sessions/:id/message', authenticate, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Add user message
    await session.addMessage('user', content);

    // Build context for AI (subject, topic, user performance, etc.)
    const context = {
      userId: req.user._id,
      subjectId: session.subject,
      topic: session.topic,
      yearId: session.year
    };

    // Generate AI response with content recommendations and personalization
    const aiResponse = await generateAIResponse(session.messages, session.assistantType, context);

    // Add AI response
    await session.addMessage('assistant', aiResponse);

    await session.populate('subject', 'name');
    await session.populate('year', 'name');

    res.json(session);
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear chat session messages
router.post('/sessions/:id/clear', authenticate, async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    await session.clearMessages();

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check for AI service
router.get('/health', authenticate, async (req, res) => {
  try {
    const health = await checkAIServiceHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;


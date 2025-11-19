import express from 'express';
import ChatSession from '../models/ChatSession.js';
import { authenticate } from '../middleware/auth.js';

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

// Send message to AI (this is a mock implementation - you would integrate with OpenAI/Claude API)
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
    
    // Generate AI response (MOCK - replace with actual AI API call)
    const aiResponse = generateMockAIResponse(content, session.assistantType);
    
    // Add AI response
    await session.addMessage('assistant', aiResponse);
    
    await session.populate('subject', 'name');
    await session.populate('year', 'name');
    
    res.json(session);
  } catch (error) {
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

// Mock AI response generator (replace with actual AI API integration)
function generateMockAIResponse(userMessage, assistantType) {
  const responses = {
    'study-assistant': [
      "That's a great question! Let me help you understand this concept better. ",
      "I'd be happy to explain that! ",
      "Let me break this down for you step by step. ",
      "Excellent question! Here's what you need to know: "
    ],
    'osce-coach': [
      "Good approach! For this OSCE scenario, consider the following steps: ",
      "Let's practice this clinical skill together. ",
      "That's a good start! Here's how you can improve: ",
      "In a real OSCE station, you would want to: "
    ],
    'case-generator': [
      "Here's an interesting clinical case for you: ",
      "Let me present a case that will test your clinical reasoning: ",
      "Consider this patient scenario: ",
      "Here's a case that covers the topic you're studying: "
    ]
  };
  
  const responseStarters = responses[assistantType] || responses['study-assistant'];
  const starter = responseStarters[Math.floor(Math.random() * responseStarters.length)];
  
  // Simple mock response
  return `${starter}${userMessage.toLowerCase().includes('what') ? 'This is a fundamental concept in dental medicine. ' : ''}${userMessage.toLowerCase().includes('how') ? 'The process involves several key steps. ' : ''}I'm here to help you learn! (Note: This is a demo response. In production, this would be powered by an AI model like GPT-4 or Claude.)`;
}

export default router;


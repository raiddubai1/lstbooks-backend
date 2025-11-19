import express from 'express';
import StudyGroup from '../models/StudyGroup.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all study groups with filters
router.get('/', async (req, res) => {
  try {
    const { subject, year, search } = req.query;
    
    const query = { isActive: true };
    
    if (subject) query.subject = subject;
    if (year) query.year = year;
    
    let groups = await StudyGroup.find(query)
      .populate('creator', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });
    
    // Filter out private groups unless user is a member
    if (req.user) {
      groups = groups.filter(g => 
        !g.isPrivate || 
        g.members.some(m => m.user._id.toString() === req.user._id.toString())
      );
    } else {
      groups = groups.filter(g => !g.isPrivate);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      groups = groups.filter(g => 
        g.name.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my study groups
router.get('/my-groups', authenticate, async (req, res) => {
  try {
    const groups = await StudyGroup.find({
      'members.user': req.user._id,
      isActive: true
    })
      .populate('creator', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single study group
router.get('/:id', async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('subject', 'name')
      .populate('year', 'name')
      .populate('members.user', 'name email role')
      .populate('sessions.createdBy', 'name email')
      .populate('sessions.attendees', 'name email');
    
    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }
    
    // Check if private and user is not a member
    if (group.isPrivate && req.user) {
      const isMember = group.members.some(m => m.user._id.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ error: 'This is a private group' });
      }
    } else if (group.isPrivate && !req.user) {
      return res.status(403).json({ error: 'This is a private group' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create study group
router.post('/', authenticate, async (req, res) => {
  try {
    const group = new StudyGroup({
      ...req.body,
      creator: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });
    
    if (group.isPrivate) {
      await group.generateInviteCode();
    }
    
    await group.save();
    await group.populate('creator', 'name email');
    await group.populate('subject', 'name');
    await group.populate('year', 'name');
    await group.populate('members.user', 'name email');
    
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update study group
router.put('/:id', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }
    
    // Check if user is admin
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update the group' });
    }
    
    Object.assign(group, req.body);
    await group.save();
    await group.populate('creator', 'name email');
    await group.populate('subject', 'name');
    await group.populate('year', 'name');
    await group.populate('members.user', 'name email');
    
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete study group
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is creator
    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the creator can delete the group' });
    }

    await group.deleteOne();
    res.json({ message: 'Study group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join study group
router.post('/:id/join', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if private and invite code matches
    if (group.isPrivate) {
      if (!req.body.inviteCode || req.body.inviteCode !== group.inviteCode) {
        return res.status(403).json({ error: 'Invalid invite code' });
      }
    }

    await group.addMember(req.user._id);
    await group.populate('members.user', 'name email');

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Leave study group
router.post('/:id/leave', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Can't leave if you're the creator
    if (group.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Creator cannot leave the group. Delete it instead.' });
    }

    await group.removeMember(req.user._id);

    res.json({ message: 'Left study group successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Remove member (admin only)
router.delete('/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is admin
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove members' });
    }

    // Can't remove creator
    if (group.creator.toString() === req.params.userId) {
      return res.status(400).json({ error: 'Cannot remove the creator' });
    }

    await group.removeMember(req.params.userId);
    await group.populate('members.user', 'name email');

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update member role (admin only)
router.patch('/:id/members/:userId/role', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is admin
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update member roles' });
    }

    // Can't change creator's role
    if (group.creator.toString() === req.params.userId) {
      return res.status(400).json({ error: 'Cannot change creator\'s role' });
    }

    await group.updateMemberRole(req.params.userId, req.body.role);
    await group.populate('members.user', 'name email');

    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add study session
router.post('/:id/sessions', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'Only members can create sessions' });
    }

    await group.addSession(req.body, req.user._id);
    await group.populate('sessions.createdBy', 'name email');
    await group.populate('sessions.attendees', 'name email');

    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// RSVP to session
router.post('/:id/sessions/:sessionId/rsvp', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ error: 'Only members can RSVP to sessions' });
    }

    const session = group.sessions.id(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Toggle RSVP
    const index = session.attendees.indexOf(req.user._id);
    if (index > -1) {
      session.attendees.splice(index, 1);
    } else {
      session.attendees.push(req.user._id);
    }

    await group.save();
    await group.populate('sessions.attendees', 'name email');

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete session
router.delete('/:id/sessions/:sessionId', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    const session = group.sessions.id(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check if user is session creator or group admin
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    const isSessionCreator = session.createdBy.toString() === req.user._id.toString();
    const isAdmin = member && member.role === 'admin';

    if (!isSessionCreator && !isAdmin) {
      return res.status(403).json({ error: 'Only session creator or group admin can delete sessions' });
    }

    session.deleteOne();
    await group.save();

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Regenerate invite code (admin only)
router.post('/:id/regenerate-code', authenticate, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Study group not found' });
    }

    // Check if user is admin
    const member = group.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can regenerate invite code' });
    }

    if (!group.isPrivate) {
      return res.status(400).json({ error: 'Group is not private' });
    }

    await group.generateInviteCode();

    res.json({ inviteCode: group.inviteCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import yearRoutes from './routes/years.js';
import subjectRoutes from './routes/subjects.js';
import quizRoutes from './routes/quizzes.js';
import flashcardRoutes from './routes/flashcards.js';
import osceRoutes from './routes/osce.js';
import labRoutes from './routes/labs.js';
import skillRoutes from './routes/skills.js';
import userRoutes from './routes/users.js';
import progressRoutes from './routes/progress.js';
import searchRoutes from './routes/search.js';
import dashboardRoutes from './routes/dashboard.js';
import bookRoutes from './routes/books.js';
import pastPaperRoutes from './routes/pastPapers.js';
import photoRoutes from './routes/photos.js';
import noteRoutes from './routes/notes.js';
import bookmarkRoutes from './routes/bookmarks.js';
import reminderRoutes from './routes/reminders.js';
import discussionRoutes from './routes/discussions.js';
import studyGroupRoutes from './routes/studyGroups.js';
import peerReviewRoutes from './routes/peerReviews.js';
import sharedResourceRoutes from './routes/sharedResources.js';
import aiChatRoutes from './routes/aiChat.js';
import gamificationRoutes from './routes/gamification.js';
import achievementRoutes from './routes/achievements.js';
import challengeRoutes from './routes/challenges.js';
import adminRoutes from './routes/admin.js';
import studentPerformanceRoutes from './routes/studentPerformance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/years', yearRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/osce', osceRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/past-papers', pastPaperRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/peer-reviews', peerReviewRoutes);
app.use('/api/shared-resources', sharedResourceRoutes);
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student-performance', studentPerformanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'lstBooks API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 lstBooks API ready at http://localhost:${PORT}/api`);
});


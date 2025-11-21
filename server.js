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
import aiChatRoutes from './routes/aiChat.js';
import adminRoutes from './routes/admin.js';
import studentPerformanceRoutes from './routes/studentPerformance.js';
import teacherAnalyticsRoutes from './routes/teacherAnalytics.js';
import resourceRoutes from './routes/resources.js';
import coursePlanRoutes from './routes/coursePlans.js';
import treatmentProtocolRoutes from './routes/treatmentProtocols.js';
import aiQuizGeneratorRoutes from './routes/aiQuizGenerator.js';
import aiFlashcardGeneratorRoutes from './routes/aiFlashcardGenerator.js';
import spacedRepetitionRoutes from './routes/spacedRepetition.js';
import revisionNoteRoutes from './routes/revisionNotes.js';
import { startKeepAlive} from './keepAlive.js';

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
app.use('/api/ai-chat', aiChatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student-performance', studentPerformanceRoutes);
app.use('/api/teacher-analytics', teacherAnalyticsRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/course-plans', coursePlanRoutes);
app.use('/api/treatment-protocols', treatmentProtocolRoutes);
app.use('/api/ai-quiz-generator', aiQuizGeneratorRoutes);
app.use('/api/ai-flashcard-generator', aiFlashcardGeneratorRoutes);
app.use('/api/spaced-repetition', spacedRepetitionRoutes);
app.use('/api/revision-notes', revisionNoteRoutes);

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

  // Start keep-alive service (only in production)
  startKeepAlive();
});


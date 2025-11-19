import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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
import noteRoutes from './routes/notes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/notes', noteRoutes);

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


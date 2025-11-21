import express from 'express';
import Quiz from '../models/Quiz.js';
import FlashcardSet from '../models/FlashcardSet.js';
import Subject from '../models/Subject.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get user's weak areas based on quiz and flashcard performance
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Analyze quiz performance
    const quizzes = await Quiz.find({ 'attempts.user': userId })
      .populate('subject', 'name');
    
    const subjectPerformance = {};
    const topicPerformance = {};
    
    // Process quiz attempts
    quizzes.forEach(quiz => {
      quiz.attempts
        .filter(attempt => attempt.user.toString() === userId)
        .forEach(attempt => {
          const subjectId = quiz.subject?._id?.toString();
          const subjectName = quiz.subject?.name || 'Unknown';
          
          if (!subjectPerformance[subjectId]) {
            subjectPerformance[subjectId] = {
              subjectId,
              subjectName,
              totalAttempts: 0,
              totalScore: 0,
              quizzesTaken: new Set(),
              topics: new Set()
            };
          }
          
          subjectPerformance[subjectId].totalAttempts++;
          subjectPerformance[subjectId].totalScore += attempt.score;
          subjectPerformance[subjectId].quizzesTaken.add(quiz._id.toString());
          
          if (quiz.topic) {
            subjectPerformance[subjectId].topics.add(quiz.topic);
            
            if (!topicPerformance[quiz.topic]) {
              topicPerformance[quiz.topic] = {
                topic: quiz.topic,
                subject: subjectName,
                totalAttempts: 0,
                totalScore: 0,
                quizCount: 0
              };
            }
            
            topicPerformance[quiz.topic].totalAttempts++;
            topicPerformance[quiz.topic].totalScore += attempt.score;
            topicPerformance[quiz.topic].quizCount++;
          }
        });
    });
    
    // Calculate averages and identify weak areas
    const weakSubjects = Object.values(subjectPerformance)
      .map(subject => ({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        averageScore: subject.totalScore / subject.totalAttempts,
        totalAttempts: subject.totalAttempts,
        quizzesTaken: subject.quizzesTaken.size,
        topicsCount: subject.topics.size
      }))
      .filter(subject => subject.averageScore < 70) // Weak if below 70%
      .sort((a, b) => a.averageScore - b.averageScore);
    
    const weakTopics = Object.values(topicPerformance)
      .map(topic => ({
        topic: topic.topic,
        subject: topic.subject,
        averageScore: topic.totalScore / topic.totalAttempts,
        totalAttempts: topic.totalAttempts,
        quizCount: topic.quizCount
      }))
      .filter(topic => topic.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 10); // Top 10 weakest topics
    
    // Get overall statistics
    const totalQuizAttempts = Object.values(subjectPerformance)
      .reduce((sum, s) => sum + s.totalAttempts, 0);
    
    const overallAverage = totalQuizAttempts > 0
      ? Object.values(subjectPerformance)
          .reduce((sum, s) => sum + s.totalScore, 0) / totalQuizAttempts
      : 0;
    
    // Get recommended resources for weak areas
    const recommendations = [];
    
    for (const weakSubject of weakSubjects.slice(0, 3)) {
      // Get quizzes for this subject
      const subjectQuizzes = await Quiz.find({ 
        subject: weakSubject.subjectId,
        isPublic: true 
      })
        .limit(3)
        .select('title difficulty');
      
      recommendations.push({
        type: 'subject',
        subjectId: weakSubject.subjectId,
        subjectName: weakSubject.subjectName,
        averageScore: weakSubject.averageScore,
        recommendedQuizzes: subjectQuizzes,
        message: `Focus on ${weakSubject.subjectName} - Your average score is ${weakSubject.averageScore.toFixed(1)}%`
      });
    }
    
    res.json({
      weakSubjects,
      weakTopics,
      recommendations,
      statistics: {
        totalQuizAttempts,
        overallAverage: overallAverage.toFixed(1),
        subjectsAnalyzed: Object.keys(subjectPerformance).length,
        topicsAnalyzed: Object.keys(topicPerformance).length
      }
    });
  } catch (error) {
    console.error('Error analyzing weak areas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed analysis for a specific subject
router.get('/subject/:subjectId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { subjectId } = req.params;
    
    const quizzes = await Quiz.find({ 
      subject: subjectId,
      'attempts.user': userId 
    });
    
    const topicBreakdown = {};
    
    quizzes.forEach(quiz => {
      quiz.attempts
        .filter(attempt => attempt.user.toString() === userId)
        .forEach(attempt => {
          const topic = quiz.topic || 'General';
          
          if (!topicBreakdown[topic]) {
            topicBreakdown[topic] = {
              topic,
              attempts: 0,
              totalScore: 0,
              quizzes: []
            };
          }
          
          topicBreakdown[topic].attempts++;
          topicBreakdown[topic].totalScore += attempt.score;
          topicBreakdown[topic].quizzes.push({
            quizId: quiz._id,
            title: quiz.title,
            score: attempt.score,
            date: attempt.completedAt
          });
        });
    });
    
    const analysis = Object.values(topicBreakdown).map(topic => ({
      topic: topic.topic,
      averageScore: topic.totalScore / topic.attempts,
      attempts: topic.attempts,
      quizzes: topic.quizzes.sort((a, b) => a.score - b.score)
    }));
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


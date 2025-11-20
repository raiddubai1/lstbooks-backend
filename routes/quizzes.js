import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import StudentPerformance from '../models/StudentPerformance.js';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to check answer correctness
const checkAnswer = (userAnswer, correctAnswer, type) => {
  if (!userAnswer) return false;

  const userAns = userAnswer.trim().toLowerCase();
  const correctAns = correctAnswer.trim().toLowerCase();

  if (type === 'MCQ') {
    return userAns === correctAns;
  } else {
    // For short answer, allow exact match or close match
    return userAns === correctAns || userAns.includes(correctAns) || correctAns.includes(userAns);
  }
};

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = {};
    if (subjectId) filter.subjectId = subjectId;

    const quizzes = await Quiz.find(filter)
      .populate('subjectId', 'name description')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const { forAttempt } = req.query;
    const quiz = await Quiz.findById(req.params.id)
      .populate('subjectId', 'name description');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // If requesting for attempt, remove correct answers
    if (forAttempt === 'true') {
      const quizObj = quiz.toObject();
      quizObj.questions = quizObj.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        points: q.points,
        resources: q.resources
        // answer is intentionally excluded
      }));
      return res.json(quizObj);
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new quiz (teacher or admin only)
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, questions } = req.body;

    if (!title || !subjectId) {
      return res.status(400).json({ error: 'Title and subjectId are required' });
    }

    const quiz = new Quiz({
      title,
      subjectId,
      questions: questions || []
    });

    await quiz.save();
    await quiz.populate('subjectId', 'name description');

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update quiz (teacher or admin only)
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { title, subjectId, questions } = req.body;

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, subjectId, questions },
      { new: true, runValidators: true }
    ).populate('subjectId', 'name description');

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quiz (teacher or admin only)
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check single answer (for instant feedback)
router.post('/:id/check-answer', async (req, res) => {
  try {
    const { questionIndex, userAnswer } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
      return res.status(400).json({ error: 'Invalid question index' });
    }

    const question = quiz.questions[questionIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    res.json({
      isCorrect,
      correctAnswer: question.answer,
      resources: question.resources || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ADVANCED QUIZ ENDPOINTS ==========

// Start a new quiz attempt (authenticated users only)
router.post('/:id/start', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Determine question order (shuffle if needed)
    let questionOrder = quiz.questions.map(q => q.id);
    if (quiz.shuffleQuestions) {
      questionOrder = shuffleArray(questionOrder);
    }

    // Calculate max score
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    // Create attempt
    const attempt = new QuizAttempt({
      quizId: quiz._id,
      userId: userId || null,
      answers: [],
      totalScore: 0,
      maxScore,
      percent: 0,
      startedAt: new Date(),
      questionOrder
    });

    await attempt.save();

    // Calculate deadline if timed
    let deadline = null;
    if (quiz.timeLimit) {
      deadline = new Date(Date.now() + quiz.timeLimit * 1000);
    }

    res.status(201).json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      deadline,
      questionOrder,
      maxScore,
      timeLimit: quiz.timeLimit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz attempt
router.post('/:id/submit', async (req, res) => {
  try {
    const { attemptId, answers, timedOut } = req.body;

    if (!attemptId) {
      return res.status(400).json({ error: 'attemptId is required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    const attempt = await QuizAttempt.findById(attemptId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    // Check if already submitted
    if (attempt.finishedAt) {
      return res.status(400).json({ error: 'Attempt already submitted' });
    }

    // Create question map for easy lookup
    const questionMap = {};
    quiz.questions.forEach(q => {
      questionMap[q.id] = q;
    });

    // Evaluate answers
    const evaluatedAnswers = [];
    let totalScore = 0;

    Object.keys(answers).forEach(questionId => {
      const question = questionMap[questionId];
      if (!question) return;

      const userAnswer = answers[questionId] || '';
      const isCorrect = checkAnswer(userAnswer, question.answer, question.type);
      const pointsEarned = isCorrect ? (question.points || 1) : 0;

      evaluatedAnswers.push({
        questionId,
        answerProvided: userAnswer,
        correct: isCorrect,
        pointsEarned
      });

      totalScore += pointsEarned;
    });

    // Calculate duration and percent
    const finishedAt = new Date();
    const durationSec = Math.floor((finishedAt - attempt.startedAt) / 1000);
    const percent = attempt.maxScore > 0 ? (totalScore / attempt.maxScore) * 100 : 0;

    // Update attempt
    attempt.answers = evaluatedAnswers;
    attempt.totalScore = totalScore;
    attempt.percent = percent;
    attempt.finishedAt = finishedAt;
    attempt.durationSec = durationSec;
    attempt.isTimedOut = timedOut || false;

    await attempt.save();

    // 📊 TRACK STUDENT PERFORMANCE
    if (attempt.userId) {
      try {
        const performance = await StudentPerformance.getOrCreate(attempt.userId);
        const correctCount = evaluatedAnswers.filter(a => a.correct).length;

        // Extract topic from quiz title (simple heuristic)
        const topic = quiz.title.split('-')[0].trim();

        await performance.addQuizResult(
          quiz._id,
          percent,
          quiz.questions.length,
          correctCount,
          durationSec,
          topic,
          quiz.subjectId
        );
      } catch (perfError) {
        console.error('Error tracking performance:', perfError);
        // Don't fail the quiz submission if performance tracking fails
      }
    }

    res.json({
      attemptId: attempt._id,
      totalScore,
      maxScore: attempt.maxScore,
      percent,
      correctAnswers: evaluatedAnswers.filter(a => a.correct).length,
      totalQuestions: quiz.questions.length,
      durationSec,
      isTimedOut: attempt.isTimedOut
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attempt details and results
router.get('/:id/attempts/:attemptId', async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quizId', 'title questions');

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.quizId._id.toString() !== req.params.id) {
      return res.status(400).json({ error: 'Attempt does not belong to this quiz' });
    }

    // Build detailed results with questions and answers
    const quiz = attempt.quizId;
    const questionMap = {};
    quiz.questions.forEach(q => {
      questionMap[q.id] = q;
    });

    const detailedAnswers = attempt.answers.map(ans => {
      const question = questionMap[ans.questionId];
      return {
        questionId: ans.questionId,
        questionText: question?.questionText || '',
        type: question?.type || '',
        options: question?.options || [],
        userAnswer: ans.answerProvided,
        correctAnswer: question?.answer || '',
        correct: ans.correct,
        pointsEarned: ans.pointsEarned,
        maxPoints: question?.points || 1,
        resources: question?.resources || []
      };
    });

    res.json({
      attemptId: attempt._id,
      quizTitle: quiz.title,
      totalScore: attempt.totalScore,
      maxScore: attempt.maxScore,
      percent: attempt.percent,
      durationSec: attempt.durationSec,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
      isTimedOut: attempt.isTimedOut,
      answers: detailedAnswers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent attempts for a quiz (admin/results view)
router.get('/:id/results', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const attempts = await QuizAttempt.find({ quizId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get aggregated stats for a quiz
router.get('/:id/stats', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ quizId: req.params.id });

    if (attempts.length === 0) {
      return res.json({
        attemptsCount: 0,
        averageScore: 0,
        averagePercent: 0,
        passRate: 0,
        averageDuration: 0
      });
    }

    const totalPercent = attempts.reduce((sum, a) => sum + a.percent, 0);
    const totalDuration = attempts.reduce((sum, a) => sum + a.durationSec, 0);
    const passedCount = attempts.filter(a => a.percent >= 70).length; // 70% pass threshold

    res.json({
      attemptsCount: attempts.length,
      averageScore: attempts.reduce((sum, a) => sum + a.totalScore, 0) / attempts.length,
      averagePercent: totalPercent / attempts.length,
      passRate: (passedCount / attempts.length) * 100,
      averageDuration: totalDuration / attempts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import quizzes from JSON (bulk upload)
router.post('/import', async (req, res) => {
  try {
    const { quizzes } = req.body;

    if (!Array.isArray(quizzes)) {
      return res.status(400).json({ error: 'quizzes must be an array' });
    }

    const createdQuizzes = [];

    for (const quizData of quizzes) {
      // Ensure each question has an ID
      if (quizData.questions) {
        quizData.questions = quizData.questions.map(q => ({
          ...q,
          id: q.id || uuidv4()
        }));
      }

      const quiz = new Quiz(quizData);
      await quiz.save();
      await quiz.populate('subjectId', 'name description');
      createdQuizzes.push(quiz);
    }

    res.status(201).json({
      message: `Successfully imported ${createdQuizzes.length} quizzes`,
      quizzes: createdQuizzes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


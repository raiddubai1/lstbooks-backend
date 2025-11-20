import express from 'express';
import Quiz from '../models/Quiz.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * POST /api/ai-quiz-generator/generate
 * Generate quiz questions using AI
 */
router.post('/generate', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const {
      topic,
      difficulty,
      questionCount,
      questionTypes,
      subject,
      year,
      includeExplanations
    } = req.body;

    // Validate input
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const numQuestions = parseInt(questionCount) || 10;
    if (numQuestions < 1 || numQuestions > 50) {
      return res.status(400).json({ error: 'Question count must be between 1 and 50' });
    }

    // For now, generate sample questions based on the topic
    // In production, this would call an AI service (OpenAI, Claude, etc.)
    const generatedQuestions = generateSampleQuestions(
      topic,
      difficulty || 'medium',
      numQuestions,
      questionTypes || ['multiple-choice'],
      includeExplanations
    );

    res.json({
      success: true,
      questions: generatedQuestions,
      metadata: {
        topic,
        difficulty,
        questionCount: generatedQuestions.length,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/ai-quiz-generator/create-quiz
 * Generate and save quiz in one step
 */
router.post('/create-quiz', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const {
      title,
      topic,
      difficulty,
      questionCount,
      questionTypes,
      subject,
      year,
      includeExplanations,
      timeLimit
    } = req.body;

    // Generate questions
    const generatedQuestions = generateSampleQuestions(
      topic,
      difficulty || 'medium',
      parseInt(questionCount) || 10,
      questionTypes || ['multiple-choice'],
      includeExplanations
    );

    // Create quiz
    const quiz = new Quiz({
      title: title || `AI Generated Quiz: ${topic}`,
      description: `Auto-generated quiz on ${topic} with ${generatedQuestions.length} questions`,
      subject,
      year: year || 'All',
      difficulty: difficulty || 'medium',
      questions: generatedQuestions,
      timeLimit: timeLimit || 30,
      passingScore: 70,
      createdBy: req.user._id,
      isAIGenerated: true
    });

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('subject', 'name')
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      quiz: populatedQuiz
    });
  } catch (error) {
    console.error('Error creating AI quiz:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Helper function to generate sample questions
 * In production, replace this with actual AI API calls
 */
function generateSampleQuestions(topic, difficulty, count, types, includeExplanations) {
  const questions = [];
  const questionTemplates = getQuestionTemplates(topic, difficulty);

  for (let i = 0; i < Math.min(count, questionTemplates.length); i++) {
    const template = questionTemplates[i];
    const questionType = types[i % types.length];

    const question = {
      question: template.question,
      type: questionType,
      points: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
      ...template
    };

    if (includeExplanations) {
      question.explanation = template.explanation || `This question tests your understanding of ${topic}.`;
    }

    questions.push(question);
  }

  return questions;
}

/**
 * Get question templates based on topic
 * This is a placeholder - in production, use AI to generate these
 */
function getQuestionTemplates(topic, difficulty) {
  // Sample templates for dental topics
  const templates = [
    {
      question: `What is the primary indication for ${topic}?`,
      options: [
        'Carious lesion',
        'Fractured tooth',
        'Esthetic improvement',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: `${topic} can be indicated for various reasons including caries, fractures, and esthetics.`
    },
    {
      question: `Which material is commonly used in ${topic}?`,
      options: [
        'Composite resin',
        'Amalgam',
        'Glass ionomer',
        'Depends on the case'
      ],
      correctAnswer: 3,
      explanation: 'Material selection depends on various clinical factors.'
    }
  ];

  return templates;
}

export default router;


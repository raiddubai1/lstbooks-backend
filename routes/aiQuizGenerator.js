import express from 'express';
import Quiz from '../models/Quiz.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * POST /api/ai-quiz-generator/generate
 * Generate quiz questions using AI
 * Available to all authenticated users for self-study
 */
router.post('/generate', authenticate, async (req, res) => {
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
 * Available to all authenticated users for self-study
 * Students create private quizzes, teachers/admins can make them public
 */
router.post('/create-quiz', authenticate, async (req, res) => {
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

    // Determine if quiz should be public based on user role
    // Teachers and admins can create public quizzes, students create private quizzes
    const isPublic = req.user.role === 'teacher' || req.user.role === 'admin';

    // Create quiz
    const quiz = new Quiz({
      title: title || `AI Generated Quiz: ${topic}`,
      description: `Auto-generated quiz on ${topic} with ${generatedQuestions.length} questions`,
      subjectId: subject,
      year: year || 'All',
      difficulty: difficulty || 'medium',
      questions: generatedQuestions,
      timeLimit: timeLimit || 30,
      passingScore: 70,
      createdBy: req.user._id,
      isAIGenerated: true,
      isPublic: isPublic
    });

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('subjectId', 'name')
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
  const baseTemplates = getQuestionTemplates(topic, difficulty);

  // Generate the requested number of questions by cycling through templates
  for (let i = 0; i < count; i++) {
    const template = baseTemplates[i % baseTemplates.length];
    const questionType = types[i % types.length];

    // Map question type to Quiz model enum values
    const modelType = questionType === 'multiple-choice' ? 'MCQ' : 'ShortAnswer';

    const question = {
      questionText: template.question,
      type: modelType,
      options: template.options || [],
      answer: template.answer,
      points: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1,
      resources: []
    };

    if (includeExplanations && template.explanation) {
      question.explanation = template.explanation;
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
      answer: 'All of the above',
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
      answer: 'Depends on the case',
      explanation: 'Material selection depends on various clinical factors.'
    },
    {
      question: `What is the most important consideration when performing ${topic}?`,
      options: [
        'Patient comfort',
        'Proper technique',
        'Sterile environment',
        'All are equally important'
      ],
      answer: 'All are equally important',
      explanation: 'All factors contribute to successful treatment outcomes.'
    },
    {
      question: `Which of the following is a contraindication for ${topic}?`,
      options: [
        'Severe periodontal disease',
        'Uncontrolled diabetes',
        'Poor oral hygiene',
        'All of the above'
      ],
      answer: 'All of the above',
      explanation: 'These conditions can compromise treatment success.'
    },
    {
      question: `What is the recommended follow-up period after ${topic}?`,
      options: [
        '1 week',
        '2 weeks',
        '1 month',
        'Depends on the case'
      ],
      answer: 'Depends on the case',
      explanation: 'Follow-up timing varies based on individual patient needs.'
    },
    {
      question: `Which diagnostic tool is most useful for evaluating ${topic}?`,
      options: [
        'Radiograph',
        'Clinical examination',
        'Patient history',
        'All of the above'
      ],
      answer: 'All of the above',
      explanation: 'Comprehensive diagnosis requires multiple assessment methods.'
    },
    {
      question: `What is the success rate of ${topic} when performed correctly?`,
      options: [
        '60-70%',
        '70-80%',
        '80-90%',
        '90-95%'
      ],
      answer: '90-95%',
      explanation: 'Proper technique and patient compliance lead to high success rates.'
    },
    {
      question: `Which complication is most commonly associated with ${topic}?`,
      options: [
        'Infection',
        'Pain',
        'Swelling',
        'All can occur'
      ],
      answer: 'All can occur',
      explanation: 'Various complications may arise depending on individual cases.'
    },
    {
      question: `What patient education is essential before ${topic}?`,
      options: [
        'Post-operative care',
        'Expected outcomes',
        'Potential risks',
        'All of the above'
      ],
      answer: 'All of the above',
      explanation: 'Comprehensive patient education improves compliance and outcomes.'
    },
    {
      question: `Which factor most influences the prognosis of ${topic}?`,
      options: [
        'Patient age',
        'Overall health',
        'Oral hygiene',
        'All factors combined'
      ],
      answer: 'All factors combined',
      explanation: 'Multiple factors interact to determine treatment success.'
    }
  ];

  return templates;
}

export default router;


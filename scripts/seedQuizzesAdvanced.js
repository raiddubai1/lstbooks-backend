import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Quiz from '../models/Quiz.js';
import Subject from '../models/Subject.js';

dotenv.config();

const seedQuizzesAdvanced = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('✅ Connected to MongoDB');

    // Get subjects
    const subjects = await Subject.find().limit(3);
    if (subjects.length < 3) {
      console.log('❌ Error: Need at least 3 subjects in database. Please seed subjects first.');
      process.exit(1);
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing quizzes');

    // Advanced Quiz 1: Timed MCQ Quiz
    const quiz1 = new Quiz({
      title: 'Dental Anatomy Fundamentals - Timed Assessment',
      subjectId: subjects[0]._id,
      timeLimit: 600, // 10 minutes
      shuffleQuestions: true,
      questions: [
        {
          id: uuidv4(),
          questionText: 'How many permanent teeth does an adult human typically have?',
          type: 'MCQ',
          options: ['28', '30', '32', '34'],
          answer: '32',
          points: 2,
          resources: ['https://example.com/dental-anatomy']
        },
        {
          id: uuidv4(),
          questionText: 'Which tooth surface faces toward the tongue?',
          type: 'MCQ',
          options: ['Buccal', 'Lingual', 'Mesial', 'Distal'],
          answer: 'Lingual',
          points: 2,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What is the hardest substance in the human body?',
          type: 'MCQ',
          options: ['Bone', 'Dentin', 'Enamel', 'Cementum'],
          answer: 'Enamel',
          points: 2,
          resources: ['https://example.com/tooth-structure']
        },
        {
          id: uuidv4(),
          questionText: 'Which teeth are also known as "cuspids"?',
          type: 'MCQ',
          options: ['Incisors', 'Canines', 'Premolars', 'Molars'],
          answer: 'Canines',
          points: 2,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'At what age do the first permanent molars typically erupt?',
          type: 'MCQ',
          options: ['4-5 years', '6-7 years', '8-9 years', '10-11 years'],
          answer: '6-7 years',
          points: 2,
          resources: ['https://example.com/tooth-eruption']
        }
      ]
    });

    // Advanced Quiz 2: Mixed Question Types (No Time Limit)
    const quiz2 = new Quiz({
      title: 'Oral Pathology & Diagnosis',
      subjectId: subjects[1]._id,
      timeLimit: null, // No time limit
      shuffleQuestions: false,
      questions: [
        {
          id: uuidv4(),
          questionText: 'What is the most common cause of tooth decay?',
          type: 'ShortAnswer',
          options: [],
          answer: 'bacteria',
          points: 3,
          resources: ['https://example.com/dental-caries']
        },
        {
          id: uuidv4(),
          questionText: 'Which bacteria is primarily responsible for dental caries?',
          type: 'MCQ',
          options: ['Streptococcus mutans', 'E. coli', 'Staphylococcus aureus', 'Lactobacillus'],
          answer: 'Streptococcus mutans',
          points: 2,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What does "gingivitis" refer to?',
          type: 'ShortAnswer',
          options: [],
          answer: 'inflammation of the gums',
          points: 3,
          resources: ['https://example.com/periodontal-disease']
        },
        {
          id: uuidv4(),
          questionText: 'Which vitamin deficiency can lead to bleeding gums?',
          type: 'MCQ',
          options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
          answer: 'Vitamin C',
          points: 2,
          resources: []
        }
      ]
    });

    // Advanced Quiz 3: Timed Short Answer Quiz
    const quiz3 = new Quiz({
      title: 'Dental Procedures & Techniques - Quick Assessment',
      subjectId: subjects[2]._id,
      timeLimit: 300, // 5 minutes
      shuffleQuestions: true,
      questions: [
        {
          id: uuidv4(),
          questionText: 'What is the process of removing tartar from teeth called?',
          type: 'ShortAnswer',
          options: [],
          answer: 'scaling',
          points: 2,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What material is commonly used for dental fillings?',
          type: 'ShortAnswer',
          options: [],
          answer: 'amalgam',
          points: 2,
          resources: ['https://example.com/dental-materials']
        },
        {
          id: uuidv4(),
          questionText: 'What does RCT stand for in dentistry?',
          type: 'ShortAnswer',
          options: [],
          answer: 'root canal treatment',
          points: 3,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What is the term for a tooth-colored filling material?',
          type: 'ShortAnswer',
          options: [],
          answer: 'composite',
          points: 2,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What is the name of the procedure to whiten teeth?',
          type: 'ShortAnswer',
          options: [],
          answer: 'bleaching',
          points: 1,
          resources: []
        },
        {
          id: uuidv4(),
          questionText: 'What is a dental crown?',
          type: 'ShortAnswer',
          options: [],
          answer: 'cap',
          points: 2,
          resources: ['https://example.com/restorative-dentistry']
        }
      ]
    });

    // Save quizzes
    await quiz1.save();
    await quiz2.save();
    await quiz3.save();

    console.log('✅ Successfully seeded 3 advanced quizzes:');
    console.log(`   1. ${quiz1.title} (${quiz1.questions.length} questions, ${quiz1.timeLimit}s time limit)`);
    console.log(`   2. ${quiz2.title} (${quiz2.questions.length} questions, no time limit)`);
    console.log(`   3. ${quiz3.title} (${quiz3.questions.length} questions, ${quiz3.timeLimit}s time limit)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedQuizzesAdvanced();


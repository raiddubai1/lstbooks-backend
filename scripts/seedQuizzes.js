import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';
import Subject from '../models/Subject.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

const seedQuizzes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if subjects exist
    const subjects = await Subject.find().limit(3);
    if (subjects.length < 3) {
      console.log('❌ Error: Less than 3 subjects found. Please seed subjects first.');
      process.exit(1);
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('🗑️  Cleared existing quizzes');

    // Sample quizzes
    const quizzes = [
      {
        title: 'Dental Anatomy Fundamentals',
        subjectId: subjects[0]._id,
        questions: [
          {
            questionText: 'How many permanent teeth does an adult human have?',
            type: 'MCQ',
            options: ['28', '30', '32', '34'],
            answer: '32',
            resources: ['https://example.com/dental-anatomy', 'https://example.com/tooth-count']
          },
          {
            questionText: 'Which tooth surface faces the tongue?',
            type: 'MCQ',
            options: ['Buccal', 'Lingual', 'Mesial', 'Distal'],
            answer: 'Lingual',
            resources: ['https://example.com/tooth-surfaces']
          },
          {
            questionText: 'What is the hardest substance in the human body?',
            type: 'ShortAnswer',
            options: [],
            answer: 'Enamel',
            resources: ['https://example.com/tooth-structure', 'https://example.com/enamel-properties']
          },
          {
            questionText: 'Which teeth are also known as cuspids?',
            type: 'MCQ',
            options: ['Incisors', 'Canines', 'Premolars', 'Molars'],
            answer: 'Canines',
            resources: ['https://example.com/tooth-types']
          },
          {
            questionText: 'What is the name of the soft tissue inside the tooth?',
            type: 'ShortAnswer',
            options: [],
            answer: 'Pulp',
            resources: ['https://example.com/tooth-anatomy']
          }
        ]
      },
      {
        title: 'Oral Hygiene and Prevention',
        subjectId: subjects[1]._id,
        questions: [
          {
            questionText: 'How many times per day should you brush your teeth?',
            type: 'MCQ',
            options: ['Once', 'Twice', 'Three times', 'Four times'],
            answer: 'Twice',
            resources: ['https://example.com/oral-hygiene-guidelines']
          },
          {
            questionText: 'What is the recommended fluoride concentration in toothpaste for adults?',
            type: 'MCQ',
            options: ['500 ppm', '1000 ppm', '1450 ppm', '2000 ppm'],
            answer: '1450 ppm',
            resources: ['https://example.com/fluoride-guidelines', 'https://example.com/toothpaste-standards']
          },
          {
            questionText: 'What is the primary cause of dental caries?',
            type: 'ShortAnswer',
            options: [],
            answer: 'Bacteria',
            resources: ['https://example.com/dental-caries', 'https://example.com/cavity-prevention']
          },
          {
            questionText: 'Which vitamin deficiency can lead to bleeding gums?',
            type: 'MCQ',
            options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
            answer: 'Vitamin C',
            resources: ['https://example.com/nutrition-oral-health']
          }
        ]
      },
      {
        title: 'Dental Procedures and Treatments',
        subjectId: subjects[2]._id,
        questions: [
          {
            questionText: 'What does RCT stand for in dentistry?',
            type: 'ShortAnswer',
            options: [],
            answer: 'Root Canal Treatment',
            resources: ['https://example.com/endodontics', 'https://example.com/root-canal-procedure']
          },
          {
            questionText: 'Which material is commonly used for dental fillings?',
            type: 'MCQ',
            options: ['Gold', 'Composite resin', 'Silver', 'All of the above'],
            answer: 'All of the above',
            resources: ['https://example.com/dental-materials', 'https://example.com/filling-types']
          },
          {
            questionText: 'What is the process of removing tartar from teeth called?',
            type: 'ShortAnswer',
            options: [],
            answer: 'Scaling',
            resources: ['https://example.com/periodontal-treatment']
          },
          {
            questionText: 'Which type of crown covers the entire visible portion of the tooth?',
            type: 'MCQ',
            options: ['Partial crown', 'Full crown', 'Onlay', 'Inlay'],
            answer: 'Full crown',
            resources: ['https://example.com/prosthodontics', 'https://example.com/dental-crowns']
          },
          {
            questionText: 'What is the minimum time recommended for fluoride varnish to remain on teeth?',
            type: 'MCQ',
            options: ['30 minutes', '1 hour', '2 hours', '4 hours'],
            answer: '4 hours',
            resources: ['https://example.com/fluoride-application']
          }
        ]
      }
    ];

    // Insert quizzes
    const createdQuizzes = await Quiz.insertMany(quizzes);
    
    console.log('✅ Created quizzes:');
    createdQuizzes.forEach((quiz, index) => {
      console.log(`   📝 ${quiz.title} (${quiz.questions.length} questions)`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log(`   Total quizzes: ${createdQuizzes.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedQuizzes();


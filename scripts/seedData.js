import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import OSCE from '../models/OSCE.js';
import Lab from '../models/Lab.js';

dotenv.config();

const subjects = [
  {
    name: 'Operative Dentistry',
    code: 'DENT301',
    description: 'Study of dental caries, cavity preparation, and restorative procedures',
    icon: '🦷',
    color: '#3B82F6',
    year: 3,
    semester: 1,
    totalHours: 120,
    credits: 6,
    learningOutcomes: [
      'Understand principles of cavity preparation',
      'Master direct and indirect restorative techniques',
      'Apply biomechanical principles in tooth preparation'
    ],
    chapters: [
      {
        title: 'Introduction to Operative Dentistry',
        description: 'Fundamental concepts and principles',
        order: 1,
        topics: ['Definition', 'Scope', 'Historical perspective', 'Modern approaches'],
        keyPoints: [
          'Operative dentistry focuses on diagnosis and treatment of dental caries',
          'Minimally invasive dentistry is the modern standard',
          'Prevention is key to reducing operative interventions'
        ],
        content: 'Operative dentistry is the branch of dentistry that deals with the diagnosis, treatment, and prevention of dental caries...'
      },
      {
        title: 'Dental Caries',
        description: 'Etiology, pathogenesis, and classification',
        order: 2,
        topics: ['Caries process', 'Risk factors', 'Classification systems', 'Detection methods'],
        keyPoints: [
          'Caries is a multifactorial disease',
          'Early detection allows for conservative treatment',
          'ICDAS classification system is widely used'
        ],
        content: 'Dental caries is a biofilm-mediated, dynamic disease resulting in net mineral loss of dental hard tissues...'
      },
      {
        title: 'Cavity Preparation Principles',
        description: 'GV Black classification and modern cavity design',
        order: 3,
        topics: ['GV Black classification', 'Cavity nomenclature', 'Preparation principles', 'Retention and resistance'],
        keyPoints: [
          'Extension for prevention is outdated',
          'Minimal intervention is preferred',
          'Cavity design depends on material choice'
        ],
        content: 'Cavity preparation follows specific principles to ensure optimal restoration longevity...'
      }
    ]
  },
  {
    name: 'Orthodontics',
    code: 'DENT302',
    description: 'Diagnosis and treatment of malocclusion and dentofacial abnormalities',
    icon: '🦷',
    color: '#10B981',
    year: 3,
    semester: 2,
    totalHours: 100,
    credits: 5,
    learningOutcomes: [
      'Diagnose various types of malocclusion',
      'Understand growth and development',
      'Plan orthodontic treatment'
    ],
    chapters: [
      {
        title: 'Introduction to Orthodontics',
        description: 'Basic concepts and terminology',
        order: 1,
        topics: ['Definition', 'Classification of malocclusion', 'Angles classification'],
        keyPoints: [
          'Orthodontics corrects irregularities of teeth and jaws',
          'Angles classification is fundamental',
          'Early intervention can prevent severe malocclusion'
        ]
      }
    ]
  }
];

const perioSubject = {
  name: 'Periodontics',
  code: 'DENT303',
  description: 'Study of supporting structures of teeth and their diseases',
  icon: '🦷',
  color: '#EF4444',
  year: 3,
  semester: 1,
  totalHours: 90,
  credits: 5,
  learningOutcomes: [
    'Diagnose periodontal diseases',
    'Perform periodontal examination',
    'Plan periodontal treatment'
  ],
  chapters: [
    {
      title: 'Anatomy of Periodontium',
      description: 'Structure and function of periodontal tissues',
      order: 1,
      topics: ['Gingiva', 'Periodontal ligament', 'Cementum', 'Alveolar bone'],
      keyPoints: [
        'Periodontium consists of four main tissues',
        'Understanding anatomy is crucial for diagnosis',
        'Healthy periodontium is essential for tooth support'
      ]
    }
  ]
};

const anatomySubject = {
  name: 'Head & Neck Anatomy',
  code: 'DENT101',
  description: 'Comprehensive study of head and neck structures',
  icon: '🧠',
  color: '#8B5CF6',
  year: 1,
  semester: 1,
  totalHours: 150,
  credits: 8,
  learningOutcomes: [
    'Identify anatomical structures of head and neck',
    'Understand neurovascular supply',
    'Apply anatomy to clinical practice'
  ],
  chapters: [
    {
      title: 'Osteology of the Skull',
      description: 'Bones of the cranium and face',
      order: 1,
      topics: ['Cranial bones', 'Facial bones', 'Foramina', 'Sutures'],
      keyPoints: [
        'Skull consists of 22 bones',
        'Important foramina transmit nerves and vessels',
        'Understanding skull anatomy is fundamental'
      ]
    }
  ]
};

const materialsSubject = {
  name: 'Dental Materials',
  code: 'DENT201',
  description: 'Properties and applications of dental materials',
  icon: '⚗️',
  color: '#F59E0B',
  year: 2,
  semester: 1,
  totalHours: 80,
  credits: 4,
  learningOutcomes: [
    'Understand material properties',
    'Select appropriate materials',
    'Handle materials correctly'
  ],
  chapters: [
    {
      title: 'Introduction to Dental Materials',
      description: 'Classification and properties',
      order: 1,
      topics: ['Material classification', 'Physical properties', 'Mechanical properties', 'Biocompatibility'],
      keyPoints: [
        'Materials must be biocompatible',
        'Understanding properties guides selection',
        'Proper handling ensures success'
      ]
    }
  ]
};

subjects.push(perioSubject, anatomySubject, materialsSubject);

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Subject.deleteMany({});
    await Quiz.deleteMany({});
    await Flashcard.deleteMany({});
    await OSCE.deleteMany({});
    await Lab.deleteMany({});
    console.log('Cleared existing data');

    // Insert subjects
    const insertedSubjects = await Subject.insertMany(subjects);
    console.log(`✅ Inserted ${insertedSubjects.length} subjects`);

    // Create sample quizzes
    const quizzes = [];
    for (const subject of insertedSubjects) {
      quizzes.push({
        title: `${subject.name} - Chapter 1 Quiz`,
        subject: subject._id,
        description: `Test your knowledge on ${subject.chapters[0]?.title || 'basics'}`,
        difficulty: 'medium',
        timeLimit: 15,
        questions: [
          {
            question: `What is the main focus of ${subject.name}?`,
            type: 'multiple-choice',
            options: [
              subject.description,
              'General dentistry',
              'Oral surgery',
              'Dental hygiene'
            ],
            correctAnswer: subject.description,
            explanation: `${subject.name} specifically deals with ${subject.description.toLowerCase()}`,
            difficulty: 'easy',
            points: 1
          }
        ]
      });
    }
    await Quiz.insertMany(quizzes);
    console.log(`✅ Inserted ${quizzes.length} quizzes`);

    // Create sample flashcards
    const flashcards = [];
    const operativeDentSubject = insertedSubjects.find(s => s.code === 'DENT301');
    if (operativeDentSubject) {
      flashcards.push(
        {
          subject: operativeDentSubject._id,
          front: 'What does ICDAS stand for?',
          back: 'International Caries Detection and Assessment System',
          difficulty: 'easy',
          category: 'Terminology'
        },
        {
          subject: operativeDentSubject._id,
          front: 'What are the main principles of cavity preparation?',
          back: 'Outline form, resistance form, retention form, convenience form, removal of caries, finishing of enamel walls, and toilet of cavity',
          difficulty: 'medium',
          category: 'Clinical'
        }
      );
    }
    await Flashcard.insertMany(flashcards);
    console.log(`✅ Inserted ${flashcards.length} flashcards`);

    // Create sample OSCE stations
    const osceStations = [];
    if (operativeDentSubject) {
      osceStations.push({
        title: 'Cavity Preparation Assessment',
        subject: operativeDentSubject._id,
        category: 'Clinical Procedure',
        description: 'Demonstrate proper cavity preparation technique',
        scenario: 'A patient presents with a Class II carious lesion on tooth 36. Prepare the cavity for amalgam restoration.',
        duration: 10,
        objectives: [
          'Demonstrate proper isolation technique',
          'Prepare cavity following correct principles',
          'Show understanding of retention and resistance form'
        ],
        checklist: [
          { item: 'Proper patient positioning', points: 2, category: 'Preparation' },
          { item: 'Adequate isolation', points: 3, category: 'Preparation' },
          { item: 'Correct outline form', points: 5, category: 'Technique' },
          { item: 'Appropriate depth', points: 5, category: 'Technique' },
          { item: 'Smooth cavity walls', points: 3, category: 'Finishing' },
          { item: 'Cavity toilet', points: 2, category: 'Finishing' }
        ],
        equipment: ['High-speed handpiece', 'Burs', 'Mirror', 'Probe', 'Rubber dam'],
        tips: [
          'Always check occlusion before starting',
          'Use water coolant to prevent pulp damage',
          'Follow anatomical contours'
        ],
        commonMistakes: [
          'Over-extension of cavity',
          'Inadequate caries removal',
          'Sharp internal line angles'
        ],
        difficulty: 'medium'
      });
    }
    await OSCE.insertMany(osceStations);
    console.log(`✅ Inserted ${osceStations.length} OSCE stations`);

    // Create sample labs
    const labs = [];
    const materialsSubject = insertedSubjects.find(s => s.code === 'DENT201');
    if (materialsSubject) {
      labs.push({
        title: 'Amalgam Manipulation and Trituration',
        subject: materialsSubject._id,
        category: 'Restorative Materials',
        description: 'Learn proper amalgam mixing and handling techniques',
        objectives: [
          'Understand amalgam composition',
          'Master trituration technique',
          'Practice proper condensation'
        ],
        materials: ['Amalgam capsule', 'Mercury', 'Alloy powder'],
        equipment: ['Amalgamator', 'Condensers', 'Carvers', 'Matrix band'],
        steps: [
          {
            stepNumber: 1,
            title: 'Prepare the amalgamator',
            description: 'Set the amalgamator to the manufacturer recommended time (usually 8-10 seconds)',
            duration: 2
          },
          {
            stepNumber: 2,
            title: 'Activate the capsule',
            description: 'Twist or press the capsule to break the membrane separating mercury and alloy',
            duration: 1
          },
          {
            stepNumber: 3,
            title: 'Triturate',
            description: 'Place capsule in amalgamator and activate. Mix for prescribed time',
            duration: 1
          },
          {
            stepNumber: 4,
            title: 'Check consistency',
            description: 'Amalgam should be smooth, homogeneous, and slightly glossy',
            tips: ['Under-mixed amalgam appears grainy', 'Over-mixed amalgam is soupy'],
            duration: 1
          }
        ],
        safetyPrecautions: [
          'Handle mercury carefully',
          'Use proper ventilation',
          'Dispose of amalgam waste properly',
          'Avoid skin contact with mercury'
        ],
        duration: 30,
        difficulty: 'easy'
      });
    }
    await Lab.insertMany(labs);
    console.log(`✅ Inserted ${labs.length} lab manuals`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();


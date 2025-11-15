import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';

dotenv.config();

const sampleSubjects = [
  {
    name: 'Operative Dentistry',
    description: 'Learn the principles and techniques of restorative dentistry, including cavity preparation, filling materials, and aesthetic restorations.',
    resources: [
      {
        title: 'Cavity Preparation Techniques',
        type: 'pdf',
        url: 'https://example.com/resources/cavity-prep.pdf'
      },
      {
        title: 'Composite Restoration Tutorial',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example1'
      },
      {
        title: 'Dental Materials Guide',
        type: 'pdf',
        url: 'https://example.com/resources/materials-guide.pdf'
      }
    ]
  },
  {
    name: 'Orthodontics',
    description: 'Study the diagnosis, prevention, and correction of malpositioned teeth and jaws. Covers braces, aligners, and growth modification.',
    resources: [
      {
        title: 'Cephalometric Analysis',
        type: 'pdf',
        url: 'https://example.com/resources/cephalometric.pdf'
      },
      {
        title: 'Bracket Placement Demonstration',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example2'
      }
    ]
  },
  {
    name: 'Periodontics',
    description: 'Comprehensive study of the supporting structures of teeth, including gums, bone, and periodontal ligament. Learn to diagnose and treat gum diseases.',
    resources: [
      {
        title: 'Periodontal Disease Classification',
        type: 'pdf',
        url: 'https://example.com/resources/perio-classification.pdf'
      },
      {
        title: 'Scaling and Root Planing',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=example3'
      },
      {
        title: 'Surgical Periodontics Atlas',
        type: 'pdf',
        url: 'https://example.com/resources/surgical-perio.pdf'
      }
    ]
  }
];

const seedSubjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('📦 Connected to MongoDB');

    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('🗑️  Cleared existing subjects');

    // Insert sample subjects
    const subjects = await Subject.insertMany(sampleSubjects);
    console.log(`✅ Created ${subjects.length} subjects`);

    subjects.forEach(subject => {
      console.log(`   📚 ${subject.name} (${subject.resources.length} resources)`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedSubjects();


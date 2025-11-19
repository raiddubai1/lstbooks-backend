import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Year from '../models/Year.js';

dotenv.config();

const years = [
  {
    name: 'Foundation Year',
    displayName: 'Foundation Year',
    order: 0,
    description: 'Introduction to dental sciences, basic medical sciences, and foundational knowledge for dental students.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 1',
    displayName: 'Year 1',
    order: 1,
    description: 'First year of dental program focusing on basic dental sciences, anatomy, and introduction to clinical procedures.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 2',
    displayName: 'Year 2',
    order: 2,
    description: 'Second year covering advanced dental sciences, pathology, and beginning of clinical training.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 3',
    displayName: 'Year 3',
    order: 3,
    description: 'Third year with focus on clinical dentistry, patient care, and specialized dental procedures.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 4',
    displayName: 'Year 4',
    order: 4,
    description: 'Fourth year emphasizing advanced clinical practice, complex cases, and specialty rotations.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 5',
    displayName: 'Year 5',
    order: 5,
    description: 'Final year with comprehensive clinical experience, preparation for professional practice, and board examinations.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  }
];

const seedYears = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing years
    await Year.deleteMany({});
    console.log('🗑️  Cleared existing years');

    // Insert years
    const createdYears = await Year.insertMany(years);
    console.log(`✅ Created ${createdYears.length} years:`);
    createdYears.forEach(year => {
      console.log(`   - ${year.name} (Order: ${year.order})`);
    });

    console.log('\n🎉 Year seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding years:', error);
    process.exit(1);
  }
};

seedYears();


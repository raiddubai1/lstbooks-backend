import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lab from '../models/Lab.js';
import Subject from '../models/Subject.js';

dotenv.config();

const seedLabs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('📦 Connected to MongoDB');

    // Get existing subjects
    const subjects = await Subject.find({});
    
    if (subjects.length < 3) {
      console.log('⚠️  Warning: Less than 3 subjects found. Please seed subjects first.');
      console.log('   Run: node scripts/seedSubjects.js');
      process.exit(1);
    }

    // Clear existing labs
    await Lab.deleteMany({});
    console.log('🗑️  Cleared existing labs');

    // Create sample labs
    const sampleLabs = [
      {
        title: 'Cavity Preparation and Restoration',
        subjectId: subjects[0]._id, // Operative Dentistry
        description: 'Learn the fundamental techniques of cavity preparation and composite restoration placement for Class I and Class II cavities.',
        steps: [
          'Administer local anesthesia and ensure patient comfort',
          'Isolate the tooth using rubber dam or cotton rolls',
          'Remove carious tissue using high-speed handpiece with water coolant',
          'Prepare cavity walls with proper angulation and retention form',
          'Apply etchant (37% phosphoric acid) for 15-20 seconds',
          'Rinse thoroughly and dry, leaving dentin slightly moist',
          'Apply bonding agent and light cure for 20 seconds',
          'Place composite in incremental layers (2mm maximum)',
          'Light cure each layer for 40 seconds',
          'Check occlusion and adjust as needed',
          'Polish restoration using finishing burs and polishing discs'
        ]
      },
      {
        title: 'Orthodontic Bracket Bonding',
        subjectId: subjects[1]._id, // Orthodontics
        description: 'Master the technique of direct bonding orthodontic brackets to tooth surfaces with proper positioning and adhesion.',
        steps: [
          'Clean tooth surfaces with pumice and prophylaxis cup',
          'Rinse and dry teeth thoroughly',
          'Apply etchant to enamel surface for 30 seconds',
          'Rinse for 15 seconds and dry until chalky white appearance',
          'Apply primer to etched enamel surface',
          'Apply adhesive paste to bracket base',
          'Position bracket on tooth at correct height and angulation',
          'Remove excess adhesive with explorer',
          'Light cure from mesial and distal directions (10 seconds each)',
          'Verify bracket position and bond strength'
        ]
      },
      {
        title: 'Scaling and Root Planing Procedure',
        subjectId: subjects[2]._id, // Periodontics
        description: 'Perform thorough scaling and root planing to remove calculus and bacterial deposits from tooth surfaces and root surfaces.',
        steps: [
          'Review patient medical history and obtain informed consent',
          'Administer local anesthesia to treatment quadrant',
          'Use periodontal probe to assess pocket depths',
          'Select appropriate scalers (sickle, curette) for tooth surfaces',
          'Position patient and operator for optimal access',
          'Use overlapping vertical and oblique strokes to remove calculus',
          'Plane root surfaces until smooth and glassy',
          'Irrigate pocket with antimicrobial solution',
          'Check for remaining calculus with explorer',
          'Provide post-operative instructions and schedule follow-up'
        ]
      }
    ];

    const createdLabs = await Lab.insertMany(sampleLabs);
    
    console.log('✅ Created labs:');
    createdLabs.forEach(lab => {
      console.log(`   📋 ${lab.title} (${lab.steps.length} steps)`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log(`   Total labs: ${createdLabs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedLabs();


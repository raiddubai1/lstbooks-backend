import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Skill from '../models/Skill.js';
import Subject from '../models/Subject.js';

dotenv.config();

const seedSkills = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('📦 Connected to MongoDB');

    // Check if subjects exist
    const subjects = await Subject.find().limit(3);
    if (subjects.length < 3) {
      console.log('⚠️  Less than 3 subjects found. Please seed subjects first.');
      console.log('   Run: node scripts/seedSubjects.js');
      process.exit(1);
    }

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('🗑️  Cleared existing skills');

    // Sample skills data
    const sampleSkills = [
      {
        title: 'Proper Handwashing and Infection Control',
        subjectId: subjects[0]._id,
        description: 'Master the essential technique of proper handwashing and infection control protocols in dental practice. This fundamental skill is critical for preventing cross-contamination and ensuring patient safety in all clinical procedures.',
        media: [
          {
            type: 'video',
            url: 'https://www.youtube.com/embed/IisgnbMfKvI'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800'
          }
        ]
      },
      {
        title: 'Local Anesthesia Administration Technique',
        subjectId: subjects[1]._id,
        description: 'Learn the proper technique for administering local anesthesia in dental procedures. This includes patient positioning, needle insertion angles, aspiration technique, and managing patient anxiety during injection.',
        media: [
          {
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800'
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/embed/example2'
          }
        ]
      },
      {
        title: 'Dental Impression Taking',
        subjectId: subjects[2]._id,
        description: 'Develop proficiency in taking accurate dental impressions for various prosthetic and orthodontic applications. Learn tray selection, material mixing, proper seating technique, and troubleshooting common issues.',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800'
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/embed/example3'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1609840114035-3c981960afdd?w=800'
          }
        ]
      }
    ];

    // Insert skills
    const createdSkills = await Skill.insertMany(sampleSkills);
    
    console.log('✅ Created skills:');
    createdSkills.forEach(skill => {
      console.log(`   📋 ${skill.title} (${skill.media.length} media items)`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log(`   Total skills: ${createdSkills.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedSkills();


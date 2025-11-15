import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OSCEStation from '../models/OSCE.js';
import Subject from '../models/Subject.js';
import Skill from '../models/Skill.js';

dotenv.config();

const seedOSCEStations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks');
    console.log('📦 Connected to MongoDB');

    // Get existing subjects and skills
    const subjects = await Subject.find().limit(3);
    const skills = await Skill.find().limit(6);

    if (subjects.length < 3) {
      console.log('⚠️  Less than 3 subjects found. Please seed subjects first.');
      process.exit(1);
    }

    if (skills.length < 3) {
      console.log('⚠️  Less than 3 skills found. Please seed skills first.');
      process.exit(1);
    }

    // Clear existing OSCE stations
    await OSCEStation.deleteMany({});
    console.log('🗑️  Cleared existing OSCE stations');

    // Sample OSCE stations
    const osceStations = [
      {
        title: 'Patient History Taking - Dental Pain Assessment',
        subjectId: subjects[0]._id,
        skills: [skills[0]._id, skills[1]._id],
        description: 'Conduct a comprehensive patient history interview focusing on dental pain, including onset, duration, character, and associated symptoms. Demonstrate effective communication and empathy.',
        steps: [
          'Introduce yourself and explain the purpose of the interview',
          'Ask about the chief complaint and onset of dental pain',
          'Inquire about pain characteristics (sharp, dull, throbbing, constant, intermittent)',
          'Assess pain severity using a pain scale (0-10)',
          'Ask about aggravating and relieving factors',
          'Review medical history and current medications',
          'Document findings clearly and accurately'
        ]
      },
      {
        title: 'Oral Examination - Periodontal Assessment',
        subjectId: subjects[1]._id,
        skills: skills.length >= 4 ? [skills[2]._id, skills[3]._id] : [skills[0]._id, skills[1]._id],
        description: 'Perform a systematic periodontal examination including probing depths, bleeding on probing, and assessment of gingival health. Demonstrate proper technique and patient communication.',
        steps: [
          'Explain the procedure to the patient and obtain consent',
          'Position the patient appropriately in the dental chair',
          'Use proper lighting and retraction for visibility',
          'Systematically probe all teeth using a periodontal probe',
          'Record probing depths at six sites per tooth',
          'Note bleeding on probing and gingival inflammation',
          'Assess tooth mobility and furcation involvement',
          'Explain findings to the patient in understandable terms'
        ]
      },
      {
        title: 'Emergency Management - Syncope Response',
        subjectId: subjects[2]._id,
        skills: skills.length >= 6 ? [skills[4]._id, skills[5]._id] : [skills[0]._id, skills[1]._id],
        description: 'Demonstrate appropriate emergency response to a patient experiencing syncope (fainting) in the dental clinic. Show competence in assessment, management, and communication.',
        steps: [
          'Recognize signs of impending syncope (pallor, sweating, dizziness)',
          'Stop dental procedure immediately',
          'Position patient supine with legs elevated',
          'Assess airway, breathing, and circulation (ABC)',
          'Loosen tight clothing and ensure adequate ventilation',
          'Monitor vital signs (pulse, blood pressure, respiratory rate)',
          'Provide reassurance to the patient as they recover',
          'Document the incident thoroughly',
          'Determine if further medical evaluation is needed'
        ]
      }
    ];

    // Insert OSCE stations
    const createdStations = await OSCEStation.insertMany(osceStations);
    
    console.log('✅ Created OSCE stations:');
    createdStations.forEach(station => {
      console.log(`   📋 ${station.title} (${station.steps.length} steps, ${station.skills.length} skills)`);
    });

    console.log('\n✨ Database seeded successfully!');
    console.log(`   Total OSCE stations: ${createdStations.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedOSCEStations();


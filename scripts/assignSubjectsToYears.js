import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Year from '../models/Year.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import Lab from '../models/Lab.js';
import OSCEStation from '../models/OSCE.js';
import Skill from '../models/Skill.js';

dotenv.config();

/**
 * Script to assign existing subjects to appropriate years
 * Based on typical dental curriculum structure
 */

const subjectYearMapping = {
  // Foundation Year - Basic sciences
  'Foundation Year': [
    'Anatomy',
    'Physiology',
    'Biochemistry'
  ],
  
  // Year 1 - Dental basics
  'Year 1': [
    'Dental Anatomy',
    'Oral Histology',
    'Dental Materials'
  ],
  
  // Year 2 - Clinical sciences
  'Year 2': [
    'Oral Pathology',
    'Pharmacology'
  ],
  
  // Year 3 - Clinical practice
  'Year 3': [
    'Operative Dentistry',
    'Endodontics',
    'Periodontics'
  ],
  
  // Year 4 - Advanced clinical
  'Year 4': [
    'Prosthodontics',
    'Oral Surgery',
    'Orthodontics'
  ],
  
  // Year 5 - Specialization
  'Year 5': [
    'Pediatric Dentistry',
    'Community Dentistry',
    'Oral Medicine'
  ]
};

const assignSubjectsToYears = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Get all years
    const years = await Year.find().sort({ order: 1 });
    console.log(`\n📚 Found ${years.length} years`);

    // Get all subjects
    const subjects = await Subject.find();
    console.log(`📖 Found ${subjects.length} subjects\n`);

    let assignedCount = 0;
    let notFoundCount = 0;

    // Assign subjects to years
    for (const [yearName, subjectNames] of Object.entries(subjectYearMapping)) {
      const year = years.find(y => y.name === yearName);
      
      if (!year) {
        console.log(`⚠️  Year not found: ${yearName}`);
        continue;
      }

      console.log(`\n🎓 Processing ${yearName}:`);

      for (const subjectName of subjectNames) {
        const subject = subjects.find(s => s.name === subjectName);
        
        if (subject) {
          subject.yearId = year._id;
          await subject.save();
          console.log(`   ✅ Assigned "${subjectName}" to ${yearName}`);
          assignedCount++;
        } else {
          console.log(`   ⚠️  Subject not found: "${subjectName}"`);
          notFoundCount++;
        }
      }
    }

    // Update stats for all years
    console.log('\n📊 Updating year statistics...');
    for (const year of years) {
      await year.updateStats();
      console.log(`   ✅ Updated stats for ${year.name}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Assignment complete!`);
    console.log(`   - Subjects assigned: ${assignedCount}`);
    console.log(`   - Subjects not found: ${notFoundCount}`);
    console.log(`   - Total subjects: ${subjects.length}`);
    console.log('='.repeat(50) + '\n');

    // Show final year stats
    console.log('📊 Final Year Statistics:');
    const updatedYears = await Year.find().sort({ order: 1 });
    for (const year of updatedYears) {
      console.log(`\n${year.name}:`);
      console.log(`   - Subjects: ${year.stats.totalSubjects}`);
      console.log(`   - Quizzes: ${year.stats.totalQuizzes}`);
      console.log(`   - Flashcards: ${year.stats.totalFlashcards}`);
      console.log(`   - Labs: ${year.stats.totalLabs}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error assigning subjects:', error);
    process.exit(1);
  }
};

assignSubjectsToYears();


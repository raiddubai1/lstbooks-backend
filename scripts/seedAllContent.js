import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const scripts = [
  { name: 'Revision Notes', file: 'scripts/seedRevisionNotes.js' },
  { name: 'Study Plans', file: 'scripts/seedStudyPlans.js' },
  { name: 'Videos', file: 'scripts/seedVideos.js' },
  { name: 'Books', file: 'scripts/seedBooks.js' },
  { name: 'Past Papers', file: 'scripts/seedPastPapers.js' },
  { name: 'Clinical Photos', file: 'scripts/seedPhotos.js' },
  { name: 'Treatment Protocols', file: 'scripts/seedTreatmentProtocols.js' },
  { name: 'Quizzes', file: 'scripts/seedQuizzes.js' },
  { name: 'Flashcards', file: 'scripts/seedFlashcards.js' },
  { name: 'OSCE Stations', file: 'scripts/seedOSCEStations.js' },
  { name: 'Lab Procedures', file: 'scripts/seedLabs.js' }
];

async function runScript(scriptFile) {
  try {
    console.log(`\n🚀 Running ${scriptFile}...`);
    const { stdout, stderr } = await execPromise(`node ${scriptFile}`);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`❌ Error running ${scriptFile}:`, error.message);
    throw error;
  }
}

async function seedAll() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🌱 SEEDING ALL REAL CONTENT FOR LSTBOOKS');
  console.log('═══════════════════════════════════════════════════\n');

  for (const script of scripts) {
    try {
      await runScript(script.file);
      console.log(`✅ ${script.name} seeded successfully!`);
    } catch (error) {
      console.error(`❌ Failed to seed ${script.name}`);
      process.exit(1);
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('🎉 ALL CONTENT SEEDED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════════════════');
  console.log('\n📊 Summary:');
  console.log('   ✅ Revision Notes - 4 comprehensive notes');
  console.log('   ✅ Study Plans - 2 structured 21-30 day plans');
  console.log('   ✅ Videos - 4 professional procedure videos');
  console.log('   ✅ Books - 10 essential dental textbooks');
  console.log('   ✅ Past Papers - 8 exam papers with solutions');
  console.log('   ✅ Clinical Photos - 10 clinical case images');
  console.log('   ✅ Treatment Protocols - 3 detailed step-by-step guides');
  console.log('   ✅ Quizzes - Multiple practice quizzes');
  console.log('   ✅ Flashcards - Comprehensive flashcard sets');
  console.log('   ✅ OSCE Stations - Clinical examination scenarios');
  console.log('   ✅ Lab Procedures - Laboratory technique guides');
  console.log('\n🚀 Your lstBooks platform now has COMPLETE, REAL CONTENT!');
  console.log('   Students can start learning immediately with professional-grade materials.\n');
}

seedAll();


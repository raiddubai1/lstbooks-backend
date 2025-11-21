import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const scripts = [
  { name: 'Revision Notes', file: 'scripts/seedRevisionNotes.js' },
  { name: 'Study Plans', file: 'scripts/seedStudyPlans.js' },
  { name: 'Videos', file: 'scripts/seedVideos.js' }
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
  console.log('   ✅ Revision Notes - Real dental education content');
  console.log('   ✅ Study Plans - 30-day structured learning paths');
  console.log('   ✅ Videos - Professional dental procedure videos');
  console.log('\n🚀 Your lstBooks platform now has REAL, VALUABLE content!');
  console.log('   Students can start learning immediately.\n');
}

seedAll();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flashcard from '../models/Flashcard.js';
import Subject from '../models/Subject.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

const seedFlashcards = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing flashcards
    await Flashcard.deleteMany({});
    console.log('🗑️  Cleared existing flashcards');

    // Get existing subjects
    const subjects = await Subject.find().limit(3);
    if (subjects.length < 3) {
      console.log('❌ Error: Less than 3 subjects found. Please seed subjects first.');
      process.exit(1);
    }

    // Flashcard Set 1: Dental Anatomy (5 cards)
    const anatomyFlashcards = [
      {
        question: 'What are the four types of teeth in the human mouth?',
        answer: 'Incisors, Canines, Premolars, and Molars. Each type has a specific function in biting, tearing, and grinding food.',
        subjectId: subjects[0]._id
      },
      {
        question: 'What is the hardest substance in the human body?',
        answer: 'Tooth enamel. It is composed of 96% hydroxyapatite mineral, making it harder than bone.',
        subjectId: subjects[0]._id
      },
      {
        question: 'What are the three layers of a tooth?',
        answer: 'Enamel (outer protective layer), Dentin (middle layer), and Pulp (innermost layer containing nerves and blood vessels).',
        subjectId: subjects[0]._id
      },
      {
        question: 'What is the periodontium?',
        answer: 'The periodontium is the supporting structure of the tooth, including the gingiva (gums), periodontal ligament, cementum, and alveolar bone.',
        subjectId: subjects[0]._id
      },
      {
        question: 'How many roots does a maxillary first molar typically have?',
        answer: 'Three roots: two buccal roots (mesiobuccal and distobuccal) and one palatal root.',
        subjectId: subjects[0]._id
      },
      {
        question: 'What is the function of the pulp chamber?',
        answer: 'The pulp chamber houses the dental pulp, which contains nerves, blood vessels, and connective tissue. It provides sensation and nourishment to the tooth.',
        subjectId: subjects[0]._id
      }
    ];

    // Flashcard Set 2: Oral Hygiene & Prevention (6 cards)
    const hygieneFlashcards = [
      {
        question: 'What is the recommended fluoride concentration in toothpaste for adults?',
        answer: '1350-1500 ppm (parts per million) fluoride is recommended for adults to effectively prevent tooth decay.',
        subjectId: subjects[1]._id
      },
      {
        question: 'What is dental plaque?',
        answer: 'Dental plaque is a sticky biofilm of bacteria that forms on teeth. If not removed, it can lead to cavities and gum disease.',
        subjectId: subjects[1]._id
      },
      {
        question: 'What is the modified Bass technique?',
        answer: 'A toothbrushing technique where the brush is placed at a 45-degree angle to the gum line, with short back-and-forth motions to clean the gingival sulcus.',
        subjectId: subjects[1]._id
      },
      {
        question: 'What causes dental caries?',
        answer: 'Dental caries (cavities) are caused by acid-producing bacteria (mainly Streptococcus mutans) that metabolize sugars and produce acid, which demineralizes tooth enamel.',
        subjectId: subjects[1]._id
      },
      {
        question: 'What is the purpose of dental sealants?',
        answer: 'Dental sealants are thin protective coatings applied to the chewing surfaces of molars to prevent bacteria and food from getting trapped in the grooves, reducing cavity risk.',
        subjectId: subjects[1]._id
      },
      {
        question: 'How often should dental floss be used?',
        answer: 'Daily flossing is recommended to remove plaque and food particles from between teeth where a toothbrush cannot reach.',
        subjectId: subjects[1]._id
      }
    ];

    // Flashcard Set 3: Dental Procedures (5 cards)
    const proceduresFlashcards = [
      {
        question: 'What is the difference between a direct and indirect restoration?',
        answer: 'Direct restorations (like composite fillings) are placed directly in the tooth in one visit. Indirect restorations (like crowns, inlays) are fabricated outside the mouth and cemented in place.',
        subjectId: subjects[2]._id
      },
      {
        question: 'What are the indications for root canal therapy?',
        answer: 'Root canal therapy is indicated for irreversible pulpitis, pulp necrosis, periapical abscess, or when the pulp is exposed due to trauma or deep decay.',
        subjectId: subjects[2]._id
      },
      {
        question: 'What is the purpose of rubber dam isolation?',
        answer: 'Rubber dam isolation provides a dry, clean working field, prevents contamination, protects soft tissues, and improves visibility during dental procedures.',
        subjectId: subjects[2]._id
      },
      {
        question: 'What is the difference between scaling and root planing?',
        answer: 'Scaling removes calculus and plaque from above and below the gum line. Root planing smooths the root surface to remove bacterial toxins and promote healing.',
        subjectId: subjects[2]._id
      },
      {
        question: 'What materials are commonly used for dental crowns?',
        answer: 'Common crown materials include porcelain-fused-to-metal (PFM), all-ceramic (zirconia, lithium disilicate), gold alloys, and metal alloys.',
        subjectId: subjects[2]._id
      }
    ];

    // Combine all flashcards
    const allFlashcards = [
      ...anatomyFlashcards,
      ...hygieneFlashcards,
      ...proceduresFlashcards
    ];

    // Insert flashcards
    const createdFlashcards = await Flashcard.insertMany(allFlashcards);

    console.log('✅ Created flashcards:');
    console.log(`   📇 Set 1: Dental Anatomy (${anatomyFlashcards.length} cards)`);
    console.log(`   📇 Set 2: Oral Hygiene & Prevention (${hygieneFlashcards.length} cards)`);
    console.log(`   📇 Set 3: Dental Procedures (${proceduresFlashcards.length} cards)`);
    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log(`   Total flashcards: ${createdFlashcards.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedFlashcards();


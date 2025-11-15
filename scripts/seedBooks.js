import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

dotenv.config();

const books = [
  {
    title: 'Dental Anatomy and Physiology',
    author: 'Dr. John Smith',
    isbn: '978-0-123456-78-9',
    publisher: 'Medical Publishers Inc.',
    publishedYear: 2023,
    edition: '5th Edition',
    category: 'Dental Anatomy',
    description: 'Comprehensive guide to dental anatomy and physiology for dental students. Covers tooth morphology, oral structures, and functional anatomy.',
    pages: 450,
    language: 'English',
    available: true,
    tags: ['anatomy', 'physiology', 'dental', 'morphology']
  },
  {
    title: 'Clinical Periodontology',
    author: 'Dr. Sarah Johnson',
    isbn: '978-0-987654-32-1',
    publisher: 'Dental Education Press',
    publishedYear: 2022,
    edition: '3rd Edition',
    category: 'Periodontology',
    description: 'Essential textbook covering all aspects of periodontal disease and treatment. Includes latest research and clinical techniques.',
    pages: 520,
    language: 'English',
    available: true,
    tags: ['periodontology', 'clinical', 'treatment', 'gum disease']
  },
  {
    title: 'Endodontics: Principles and Practice',
    author: 'Dr. Michael Brown',
    isbn: '978-0-456789-01-2',
    publisher: 'Advanced Dental Books',
    publishedYear: 2024,
    edition: '6th Edition',
    category: 'Endodontics',
    description: 'Modern approach to endodontic diagnosis and treatment techniques. Features step-by-step procedures and case studies.',
    pages: 380,
    language: 'English',
    available: true,
    tags: ['endodontics', 'root canal', 'treatment', 'diagnosis']
  },
  {
    title: 'Oral Pathology: Clinical Pathologic Correlations',
    author: 'Dr. Emily Davis',
    isbn: '978-0-234567-89-0',
    publisher: 'Pathology Press',
    publishedYear: 2023,
    edition: '7th Edition',
    category: 'Oral Pathology',
    description: 'Comprehensive coverage of oral and maxillofacial pathology with clinical correlations and diagnostic approaches.',
    pages: 680,
    language: 'English',
    available: true,
    tags: ['pathology', 'diagnosis', 'oral diseases', 'clinical']
  },
  {
    title: 'Prosthodontics: Treatment Planning and Clinical Procedures',
    author: 'Dr. Robert Wilson',
    isbn: '978-0-345678-90-1',
    publisher: 'Prosthetic Dental Publishing',
    publishedYear: 2023,
    edition: '4th Edition',
    category: 'Prosthodontics',
    description: 'Complete guide to fixed and removable prosthodontics, including implant-supported restorations.',
    pages: 590,
    language: 'English',
    available: true,
    tags: ['prosthodontics', 'dentures', 'implants', 'restorations']
  },
  {
    title: 'Oral and Maxillofacial Surgery',
    author: 'Dr. James Anderson',
    isbn: '978-0-567890-12-3',
    publisher: 'Surgical Dental Books',
    publishedYear: 2024,
    edition: '8th Edition',
    category: 'Oral Surgery',
    description: 'Authoritative text on oral and maxillofacial surgery covering extractions, trauma, pathology, and reconstructive procedures.',
    pages: 750,
    language: 'English',
    available: true,
    tags: ['surgery', 'extractions', 'trauma', 'reconstruction']
  },
  {
    title: 'Contemporary Orthodontics',
    author: 'Dr. Lisa Martinez',
    isbn: '978-0-678901-23-4',
    publisher: 'Orthodontic Education Ltd.',
    publishedYear: 2023,
    edition: '6th Edition',
    category: 'Orthodontics',
    description: 'Modern orthodontic principles and techniques, including clear aligners and digital treatment planning.',
    pages: 620,
    language: 'English',
    available: true,
    tags: ['orthodontics', 'braces', 'aligners', 'malocclusion']
  },
  {
    title: 'Pediatric Dentistry: A Clinical Approach',
    author: 'Dr. Amanda Taylor',
    isbn: '978-0-789012-34-5',
    publisher: 'Pediatric Dental Press',
    publishedYear: 2022,
    edition: '5th Edition',
    category: 'Pediatric Dentistry',
    description: 'Comprehensive guide to treating pediatric patients, from infancy through adolescence.',
    pages: 480,
    language: 'English',
    available: true,
    tags: ['pediatric', 'children', 'behavior management', 'prevention']
  },
  {
    title: 'Dental Materials: Properties and Manipulation',
    author: 'Dr. Christopher Lee',
    isbn: '978-0-890123-45-6',
    publisher: 'Materials Science Publishers',
    publishedYear: 2024,
    edition: '11th Edition',
    category: 'General',
    description: 'Essential reference on dental materials science, covering properties, selection, and clinical applications.',
    pages: 420,
    language: 'English',
    available: true,
    tags: ['materials', 'science', 'properties', 'clinical applications']
  },
  {
    title: 'Dental Radiology: Principles and Techniques',
    author: 'Dr. Patricia Garcia',
    isbn: '978-0-901234-56-7',
    publisher: 'Radiology Education Books',
    publishedYear: 2023,
    edition: '4th Edition',
    category: 'General',
    description: 'Complete guide to dental radiography, including digital imaging and radiation safety.',
    pages: 390,
    language: 'English',
    available: false,
    tags: ['radiology', 'x-ray', 'imaging', 'digital', 'safety']
  }
];

async function seedBooks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing books');

    // Insert new books
    const insertedBooks = await Book.insertMany(books);
    console.log(`✅ Inserted ${insertedBooks.length} books`);

    console.log('\n📚 Sample Books:');
    insertedBooks.slice(0, 3).forEach(book => {
      console.log(`   - ${book.title} by ${book.author}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
}

seedBooks();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

dotenv.config();

const books = [
  {
    title: "Wheeler's Dental Anatomy, Physiology and Occlusion",
    author: "Stanley J. Nelson and Major M. Ash",
    isbn: "978-0-323-26334-0",
    publisher: "Elsevier",
    publishedYear: 2020,
    edition: "11th Edition",
    category: "Dental Anatomy",
    description: "The gold standard reference for understanding tooth form and function. Comprehensive coverage of dental anatomy with detailed illustrations and clinical correlations.",
    coverImage: "https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Wheeler%27s+Dental+Anatomy",
    pages: 384,
    language: "English",
    available: true,
    tags: ["dental anatomy", "occlusion", "tooth morphology", "clinical dentistry", "reference"]
  },
  {
    title: "Carranza's Clinical Periodontology",
    author: "Michael G. Newman, Henry Takei, and Perry R. Klokkevold",
    isbn: "978-0-323-52324-5",
    publisher: "Elsevier",
    publishedYear: 2019,
    edition: "13th Edition",
    category: "Periodontology",
    description: "The most comprehensive and widely used periodontics textbook. Covers etiology, diagnosis, and treatment of periodontal diseases with evidence-based approaches.",
    coverImage: "https://via.placeholder.com/300x400/E74C3C/FFFFFF?text=Carranza%27s+Periodontology",
    pages: 912,
    language: "English",
    available: true,
    tags: ["periodontology", "gum disease", "periodontal therapy", "implants", "evidence-based"]
  },
  {
    title: "Cohen's Pathways of the Pulp",
    author: "Kenneth M. Hargreaves and Louis H. Berman",
    isbn: "978-0-323-67423-4",
    publisher: "Elsevier",
    publishedYear: 2021,
    edition: "12th Edition",
    category: "Endodontics",
    description: "The definitive endodontics textbook covering diagnosis, treatment planning, and clinical techniques. Features the latest advances in root canal therapy and regenerative endodontics.",
    coverImage: "https://via.placeholder.com/300x400/27AE60/FFFFFF?text=Cohen%27s+Pathways",
    pages: 1024,
    language: "English",
    available: true,
    tags: ["endodontics", "root canal", "pulp therapy", "regenerative", "clinical techniques"]
  },
  {
    title: "Neville's Oral and Maxillofacial Pathology",
    author: "Brad W. Neville, Douglas D. Damm, and Carl M. Allen",
    isbn: "978-1-4557-7166-9",
    publisher: "Elsevier",
    publishedYear: 2016,
    edition: "4th Edition",
    category: "Oral Pathology",
    description: "Comprehensive reference on oral pathology with over 1,400 clinical photographs. Essential for understanding disease processes affecting the oral and maxillofacial regions.",
    coverImage: "https://via.placeholder.com/300x400/8E44AD/FFFFFF?text=Neville%27s+Pathology",
    pages: 928,
    language: "English",
    available: true,
    tags: ["oral pathology", "diagnosis", "maxillofacial", "disease", "clinical photos"]
  },
  {
    title: "Rosenstiel's Contemporary Fixed Prosthodontics",
    author: "Stephen F. Rosenstiel, Martin F. Land, and Junhei Fujimoto",
    isbn: "978-0-323-59955-3",
    publisher: "Elsevier",
    publishedYear: 2022,
    edition: "6th Edition",
    category: "Prosthodontics",
    description: "Authoritative guide to fixed prosthodontics including crowns, bridges, and implant-supported restorations. Features digital dentistry and CAD/CAM technology.",
    coverImage: "https://via.placeholder.com/300x400/F39C12/FFFFFF?text=Contemporary+Fixed+Prostho",
    pages: 896,
    language: "English",
    available: false,
    tags: ["prosthodontics", "crowns", "bridges", "implants", "CAD/CAM"]
  },
  {
    title: "Peterson's Principles of Oral and Maxillofacial Surgery",
    author: "Michael Miloro, G.E. Ghali, and Peter E. Larsen",
    isbn: "978-1-60795-111-7",
    publisher: "People's Medical Publishing House",
    publishedYear: 2019,
    edition: "3rd Edition",
    category: "Oral Surgery",
    description: "Comprehensive two-volume reference covering all aspects of oral and maxillofacial surgery. Includes dentoalveolar surgery, trauma, pathology, and reconstructive procedures.",
    coverImage: "https://via.placeholder.com/300x400/E67E22/FFFFFF?text=Peterson%27s+OMS",
    pages: 1568,
    language: "English",
    available: true,
    tags: ["oral surgery", "maxillofacial", "trauma", "reconstruction", "extractions"]
  },
  {
    title: "Proffit's Contemporary Orthodontics",
    author: "William R. Proffit, Henry W. Fields, and David M. Sarver",
    isbn: "978-0-323-54383-9",
    publisher: "Elsevier",
    publishedYear: 2019,
    edition: "6th Edition",
    category: "Orthodontics",
    description: "Leading orthodontics textbook covering diagnosis, treatment planning, and biomechanics. Includes clear aligner therapy and contemporary treatment approaches.",
    coverImage: "https://via.placeholder.com/300x400/3498DB/FFFFFF?text=Proffit%27s+Orthodontics",
    pages: 736,
    language: "English",
    available: true,
    tags: ["orthodontics", "malocclusion", "braces", "aligners", "treatment planning"]
  },
  {
    title: "McDonald and Avery's Dentistry for the Child and Adolescent",
    author: "Jeffrey A. Dean, David R. Avery, and Ralph E. McDonald",
    isbn: "978-0-323-28745-6",
    publisher: "Elsevier",
    publishedYear: 2016,
    edition: "10th Edition",
    category: "Pediatric Dentistry",
    description: "Comprehensive pediatric dentistry textbook covering child development, behavior management, and treatment of dental problems in children. Essential for treating young patients.",
    coverImage: "https://via.placeholder.com/300x400/1ABC9C/FFFFFF?text=McDonald+Pediatric+Dent",
    pages: 704,
    language: "English",
    available: true,
    tags: ["pediatric dentistry", "children", "behavior management", "prevention", "development"]
  },
  {
    title: "Phillips' Science of Dental Materials",
    author: "Kenneth J. Anusavice, Chiayi Shen, and H. Ralph Rawls",
    isbn: "978-0-323-69755-4",
    publisher: "Elsevier",
    publishedYear: 2022,
    edition: "13th Edition",
    category: "General",
    description: "Authoritative resource on dental materials science covering physical properties, biocompatibility, and clinical applications. Essential for understanding material selection and manipulation.",
    coverImage: "https://via.placeholder.com/300x400/95A5A6/FFFFFF?text=Phillips+Dental+Materials",
    pages: 592,
    language: "English",
    available: true,
    tags: ["dental materials", "biomaterials", "properties", "science", "clinical applications"]
  },
  {
    title: "White and Pharoah's Oral Radiology: Principles and Interpretation",
    author: "Stuart C. White and Michael J. Pharoah",
    isbn: "978-0-323-48255-6",
    publisher: "Elsevier",
    publishedYear: 2019,
    edition: "8th Edition",
    category: "General",
    description: "Comprehensive guide to dental radiography and interpretation covering conventional and digital imaging. Includes CBCT, radiation safety, and diagnostic imaging principles.",
    coverImage: "https://via.placeholder.com/300x400/34495E/FFFFFF?text=Oral+Radiology",
    pages: 752,
    language: "English",
    available: true,
    tags: ["radiology", "x-ray", "CBCT", "imaging", "diagnosis"]
  }
];

async function seedBooks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if books already exist
    const existingBooksCount = await Book.countDocuments();

    if (existingBooksCount > 0) {
      console.log(`ℹ️  Database already has ${existingBooksCount} books. Skipping seed.`);
      console.log('💡 To re-seed, first delete all books or use the --force flag.');
      process.exit(0);
    }

    console.log('📚 Database is empty. Seeding books...');

    // Insert new books
    const insertedBooks = await Book.insertMany(books);
    console.log(`✅ Successfully inserted ${insertedBooks.length} books`);

    console.log('\n📖 Sample Books Added:');
    insertedBooks.slice(0, 5).forEach(book => {
      console.log(`   - ${book.title} by ${book.author}`);
    });
    console.log(`   ... and ${insertedBooks.length - 5} more books`);

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    process.exit(1);
  }
}

seedBooks();


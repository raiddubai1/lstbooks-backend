import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PastPaper from '../models/PastPaper.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

const pastPapersData = [
  {
    title: "Operative Dentistry Final Exam 2023",
    subject: "Operative Dentistry",
    year: 2023,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 3",
    fileUrl: "/past-papers/operative-dentistry-final-2023.pdf",
    solutionUrl: "/past-papers/operative-dentistry-final-2023-solutions.pdf",
    description: "Comprehensive final exam covering cavity preparation, restorative materials, composite restorations, and amalgam procedures. Includes MCQs, short answer questions, and case-based scenarios.",
    totalMarks: 100,
    duration: 180, // 3 hours
    difficulty: "Hard",
    topics: ["Cavity Preparation", "Composite Restorations", "Amalgam", "Bonding Agents", "Dental Materials", "Clinical Cases"],
    tags: ["operative", "restorative", "final-exam", "year-3", "2023"],
    downloads: 0,
    verified: true
  },
  {
    title: "Oral Pathology Midterm Exam 2023",
    subject: "Oral Pathology",
    year: 2023,
    semester: "Midterm",
    examType: "Midterm",
    academicYear: "Year 2",
    fileUrl: "/past-papers/oral-pathology-midterm-2023.pdf",
    solutionUrl: "/past-papers/oral-pathology-midterm-2023-solutions.pdf",
    description: "Midterm examination covering developmental anomalies, inflammatory lesions, and benign tumors of the oral cavity. Includes histopathology images and clinical photographs.",
    totalMarks: 50,
    duration: 90,
    difficulty: "Medium",
    topics: ["Developmental Anomalies", "Inflammatory Lesions", "Benign Tumors", "Histopathology", "Clinical Diagnosis"],
    tags: ["pathology", "midterm", "year-2", "2023", "histology"],
    downloads: 0,
    verified: true
  },
  {
    title: "Periodontology Final Exam 2022",
    subject: "Periodontology",
    year: 2022,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 3",
    fileUrl: "/past-papers/periodontology-final-2022.pdf",
    solutionUrl: "/past-papers/periodontology-final-2022-solutions.pdf",
    description: "Comprehensive exam on periodontal disease classification, diagnosis, and treatment planning. Includes the 2017 AAP/EFP classification system, scaling and root planing techniques, and surgical procedures.",
    totalMarks: 100,
    duration: 180,
    difficulty: "Hard",
    topics: ["Periodontal Disease Classification", "Diagnosis", "Treatment Planning", "Scaling & Root Planing", "Periodontal Surgery", "Implants"],
    tags: ["periodontology", "final-exam", "year-3", "2022", "AAP-classification"],
    downloads: 0,
    verified: true
  },
  {
    title: "Endodontics Final Exam 2023",
    subject: "Endodontics",
    year: 2023,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 4",
    fileUrl: "/past-papers/endodontics-final-2023.pdf",
    solutionUrl: "/past-papers/endodontics-final-2023-solutions.pdf",
    description: "Final exam covering pulp biology, diagnosis of pulpal and periapical diseases, root canal treatment procedures, and endodontic emergencies. Includes radiographic interpretation and case studies.",
    totalMarks: 100,
    duration: 180,
    difficulty: "Hard",
    topics: ["Pulp Biology", "Diagnosis", "Root Canal Treatment", "Obturation", "Endodontic Emergencies", "Radiographic Interpretation"],
    tags: ["endodontics", "root-canal", "final-exam", "year-4", "2023"],
    downloads: 0,
    verified: true
  },
  {
    title: "Oral Surgery Midterm Exam 2023",
    subject: "Oral Surgery",
    year: 2023,
    semester: "Midterm",
    examType: "Midterm",
    academicYear: "Year 4",
    fileUrl: "/past-papers/oral-surgery-midterm-2023.pdf",
    solutionUrl: "/past-papers/oral-surgery-midterm-2023-solutions.pdf",
    description: "Midterm covering basic exodontia, surgical anatomy, local anesthesia techniques, and management of impacted teeth. Includes surgical instruments identification and procedural steps.",
    totalMarks: 50,
    duration: 90,
    difficulty: "Medium",
    topics: ["Exodontia", "Surgical Anatomy", "Local Anesthesia", "Impacted Teeth", "Surgical Instruments", "Complications"],
    tags: ["oral-surgery", "extractions", "midterm", "year-4", "2023"],
    downloads: 0,
    verified: true
  },
  {
    title: "Prosthodontics Final Exam 2022",
    subject: "Prosthodontics",
    year: 2022,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 4",
    fileUrl: "/past-papers/prosthodontics-final-2022.pdf",
    solutionUrl: "/past-papers/prosthodontics-final-2022-solutions.pdf",
    description: "Comprehensive exam on fixed and removable prosthodontics including crown and bridge, complete dentures, and partial dentures. Covers treatment planning, tooth preparation, and laboratory procedures.",
    totalMarks: 100,
    duration: 180,
    difficulty: "Hard",
    topics: ["Crown & Bridge", "Complete Dentures", "Partial Dentures", "Tooth Preparation", "Impressions", "Occlusion"],
    tags: ["prosthodontics", "crowns", "dentures", "final-exam", "year-4", "2022"],
    downloads: 0,
    verified: true
  },
  {
    title: "Orthodontics Final Exam 2023",
    subject: "Orthodontics",
    year: 2023,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 5",
    fileUrl: "/past-papers/orthodontics-final-2023.pdf",
    solutionUrl: "/past-papers/orthodontics-final-2023-solutions.pdf",
    description: "Final exam covering malocclusion classification, cephalometric analysis, treatment planning, and orthodontic biomechanics. Includes case analysis and appliance design.",
    totalMarks: 100,
    duration: 180,
    difficulty: "Hard",
    topics: ["Malocclusion Classification", "Cephalometrics", "Treatment Planning", "Biomechanics", "Appliances", "Growth & Development"],
    tags: ["orthodontics", "malocclusion", "final-exam", "year-5", "2023"],
    downloads: 0,
    verified: true
  },
  {
    title: "Pediatric Dentistry Final Exam 2022",
    subject: "Pediatric Dentistry",
    year: 2022,
    semester: "Final",
    examType: "Final Exam",
    academicYear: "Year 5",
    fileUrl: "/past-papers/pediatric-dentistry-final-2022.pdf",
    solutionUrl: "/past-papers/pediatric-dentistry-final-2022-solutions.pdf",
    description: "Comprehensive exam on child development, behavior management, preventive dentistry, and treatment of dental problems in children. Includes pulp therapy and space management.",
    totalMarks: 100,
    duration: 180,
    difficulty: "Hard",
    topics: ["Child Development", "Behavior Management", "Preventive Dentistry", "Pulp Therapy", "Space Management", "Trauma"],
    tags: ["pediatric", "children", "final-exam", "year-5", "2022"],
    downloads: 0,
    verified: true
  }
];

async function seedPastPapers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create user
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
      console.log('⚠️  No admin user found. Looking for any user...');
      user = await User.findOne({});
    }
    if (!user) {
      console.log('⚠️  No users found. Creating system user...');
      user = await User.create({
        name: 'System',
        email: 'system@lstbooks.com',
        password: 'system123',
        role: 'admin'
      });
    }

    // Clear existing past papers
    await PastPaper.deleteMany({});
    console.log('🗑️  Cleared existing past papers');

    // Add uploadedBy to each past paper
    const pastPapersWithUser = pastPapersData.map(paper => ({
      ...paper,
      uploadedBy: user._id
    }));

    // Create past papers
    const createdPapers = await PastPaper.insertMany(pastPapersWithUser);
    console.log(`✅ Created ${createdPapers.length} past papers`);

    console.log('\n📄 Past Papers Created:');
    createdPapers.forEach(paper => {
      console.log(`   - ${paper.title} (${paper.academicYear}, ${paper.year})`);
    });

    console.log('\n✅ Past Papers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding past papers:', error);
    process.exit(1);
  }
}

seedPastPapers();


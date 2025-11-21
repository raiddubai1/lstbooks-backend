import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudyPlan from '../models/StudyPlan.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

// Real, professional study plans for dental students
const studyPlansData = [
  {
    name: "Complete Operative Dentistry Mastery - 30 Days",
    subject: "Operative Dentistry",
    year: "Year 2",
    category: "comprehensive",
    difficulty: "intermediate",
    description: "Master all aspects of operative dentistry in 30 days. Covers caries, cavity preparation, restorative materials, and clinical techniques. Perfect for exam preparation or clinical rotation.",
    duration: 30,
    learningGoals: [
      "Understand the complete caries process and prevention strategies",
      "Master Black's classification and cavity preparation principles",
      "Learn properties and applications of all restorative materials",
      "Develop clinical skills in composite and amalgam restorations",
      "Understand adhesive dentistry and bonding techniques"
    ],
    dailyTasks: [
      // Week 1: Cariology and Diagnosis
      {
        day: 1,
        title: "Introduction to Dental Caries",
        tasks: [
          { type: "read", title: "Read: Caries Etiology and Pathogenesis", duration: 45, resourceId: null },
          { type: "video", title: "Watch: The Caries Balance Concept", duration: 20, resourceId: null },
          { type: "quiz", title: "Quiz: Caries Basics (20 questions)", duration: 15, resourceId: null },
          { type: "flashcard", title: "Review: Cariogenic Bacteria Flashcards", duration: 10, resourceId: null }
        ]
      },
      {
        day: 2,
        title: "Caries Detection and Diagnosis",
        tasks: [
          { type: "read", title: "Read: ICDAS Classification System", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Clinical Caries Detection Methods", duration: 25, resourceId: null },
          { type: "read", title: "Read: Radiographic Interpretation of Caries", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Caries Diagnosis (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 3,
        title: "Caries Prevention Strategies",
        tasks: [
          { type: "read", title: "Read: Fluoride Mechanisms and Applications", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Pit and Fissure Sealants Technique", duration: 15, resourceId: null },
          { type: "read", title: "Read: Dietary Counseling for Caries Prevention", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Prevention Strategies (20 questions)", duration: 15, resourceId: null },
          { type: "flashcard", title: "Review: Fluoride Concentrations", duration: 10, resourceId: null }
        ]
      },
      {
        day: 4,
        title: "Minimal Intervention Dentistry",
        tasks: [
          { type: "read", title: "Read: Remineralization Therapies", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Silver Diamine Fluoride Application", duration: 20, resourceId: null },
          { type: "read", title: "Read: Resin Infiltration Technique (Icon)", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Non-Invasive Treatments (15 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 5,
        title: "Black's Classification of Cavities",
        tasks: [
          { type: "read", title: "Read: G.V. Black's Classification System", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Identifying Cavity Classes Clinically", duration: 25, resourceId: null },
          { type: "flashcard", title: "Review: Class I-VI Cavities", duration: 15, resourceId: null },
          { type: "quiz", title: "Quiz: Cavity Classification (30 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 6,
        title: "Cavity Preparation Principles",
        tasks: [
          { type: "read", title: "Read: Principles of Cavity Preparation", duration: 45, resourceId: null },
          { type: "video", title: "Watch: Cavity Preparation Demonstration", duration: 30, resourceId: null },
          { type: "read", title: "Read: Retention and Resistance Form", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Cavity Prep Principles (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 7,
        title: "Week 1 Review and Practice",
        tasks: [
          { type: "flashcard", title: "Review: All Week 1 Flashcards", duration: 30, resourceId: null },
          { type: "quiz", title: "Comprehensive Quiz: Cariology (50 questions)", duration: 40, resourceId: null },
          { type: "read", title: "Review: Week 1 Revision Notes", duration: 30, resourceId: null },
          { type: "practice", title: "Practice: Identify Cavity Classes on Photos", duration: 20, resourceId: null }
        ]
      },
      
      // Week 2: Restorative Materials
      {
        day: 8,
        title: "Dental Amalgam - Properties",
        tasks: [
          { type: "read", title: "Read: Amalgam Composition and Setting Reaction", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Amalgam Manipulation Techniques", duration: 25, resourceId: null },
          { type: "read", title: "Read: Properties of Dental Amalgam", duration: 35, resourceId: null },
          { type: "quiz", title: "Quiz: Amalgam Properties (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 9,
        title: "Amalgam Restorations - Clinical Technique",
        tasks: [
          { type: "video", title: "Watch: Class I Amalgam Restoration", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Class II Amalgam with Matrix Band", duration: 35, resourceId: null },
          { type: "read", title: "Read: Amalgam Finishing and Polishing", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Amalgam Technique (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 10,
        title: "Composite Resins - Chemistry and Properties",
        tasks: [
          { type: "read", title: "Read: Composite Resin Composition", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Polymerization Process", duration: 20, resourceId: null },
          { type: "read", title: "Read: Classification of Composites", duration: 30, resourceId: null },
          { type: "flashcard", title: "Review: Composite Types and Uses", duration: 15, resourceId: null },
          { type: "quiz", title: "Quiz: Composite Properties (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 11,
        title: "Adhesive Dentistry - Bonding Mechanisms",
        tasks: [
          { type: "read", title: "Read: Enamel and Dentin Bonding", duration: 45, resourceId: null },
          { type: "video", title: "Watch: Acid Etching Technique", duration: 20, resourceId: null },
          { type: "read", title: "Read: Bonding Agents Classification", duration: 35, resourceId: null },
          { type: "quiz", title: "Quiz: Adhesive Systems (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 12,
        title: "Composite Restorations - Clinical Technique",
        tasks: [
          { type: "video", title: "Watch: Class III Composite Restoration", duration: 25, resourceId: null },
          { type: "video", title: "Watch: Class IV Composite with Mylar Strip", duration: 30, resourceId: null },
          { type: "read", title: "Read: Layering Technique and Shade Selection", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Composite Technique (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 13,
        title: "Glass Ionomer Cements",
        tasks: [
          { type: "read", title: "Read: GIC Composition and Setting", duration: 35, resourceId: null },
          { type: "video", title: "Watch: GIC Applications in Dentistry", duration: 20, resourceId: null },
          { type: "read", title: "Read: Resin-Modified GIC", duration: 25, resourceId: null },
          { type: "flashcard", title: "Review: GIC vs RMGIC vs Composite", duration: 15, resourceId: null },
          { type: "quiz", title: "Quiz: Glass Ionomers (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 14,
        title: "Week 2 Review - Restorative Materials",
        tasks: [
          { type: "flashcard", title: "Review: All Materials Flashcards", duration: 30, resourceId: null },
          { type: "quiz", title: "Comprehensive Quiz: Restorative Materials (50 questions)", duration: 40, resourceId: null },
          { type: "read", title: "Review: Material Selection Guidelines", duration: 30, resourceId: null },
          { type: "practice", title: "Practice: Material Selection Cases", duration: 20, resourceId: null }
        ]
      },

      // Week 3: Posterior Restorations
      {
        day: 15,
        title: "Class I Cavity Preparation and Restoration",
        tasks: [
          { type: "read", title: "Read: Class I Cavity Design Principles", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Class I Amalgam Preparation", duration: 25, resourceId: null },
          { type: "video", title: "Watch: Class I Composite Restoration", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Class I Restorations (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 16,
        title: "Class II Cavity Preparation",
        tasks: [
          { type: "read", title: "Read: Class II Cavity Design - MOD Preparations", duration: 45, resourceId: null },
          { type: "video", title: "Watch: Class II Preparation Technique", duration: 30, resourceId: null },
          { type: "read", title: "Read: Matrix Band Systems", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Class II Preparations (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 17,
        title: "Class II Amalgam Restorations",
        tasks: [
          { type: "video", title: "Watch: Class II Amalgam - Complete Procedure", duration: 35, resourceId: null },
          { type: "read", title: "Read: Tofflemire Matrix Band Technique", duration: 25, resourceId: null },
          { type: "video", title: "Watch: Amalgam Condensation and Carving", duration: 20, resourceId: null },
          { type: "quiz", title: "Quiz: Amalgam Technique (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 18,
        title: "Class II Composite Restorations",
        tasks: [
          { type: "video", title: "Watch: Class II Composite - Sectional Matrix", duration: 35, resourceId: null },
          { type: "read", title: "Read: Incremental Layering Technique", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Composite Finishing and Polishing", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Class II Composite (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 19,
        title: "Complex Posterior Restorations",
        tasks: [
          { type: "read", title: "Read: Cusp Coverage and Onlays", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Large MOD Restorations", duration: 30, resourceId: null },
          { type: "read", title: "Read: Core Build-ups", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Complex Restorations (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 20,
        title: "Anterior Restorations - Class III and IV",
        tasks: [
          { type: "read", title: "Read: Anterior Esthetics Principles", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Class III Composite Restoration", duration: 25, resourceId: null },
          { type: "video", title: "Watch: Class IV Restoration with Mylar Strip", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Anterior Restorations (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 21,
        title: "Week 3 Review - Clinical Techniques",
        tasks: [
          { type: "flashcard", title: "Review: All Restoration Types", duration: 30, resourceId: null },
          { type: "quiz", title: "Comprehensive Quiz: Restorative Techniques (50 questions)", duration: 40, resourceId: null },
          { type: "practice", title: "Practice: Cavity Preparation Diagrams", duration: 30, resourceId: null }
        ]
      },

      // Week 4: Advanced Topics and Integration
      {
        day: 22,
        title: "Pulp Protection and Liners",
        tasks: [
          { type: "read", title: "Read: Pulp Protection Strategies", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Calcium Hydroxide and GIC Liners", duration: 20, resourceId: null },
          { type: "read", title: "Read: Direct and Indirect Pulp Capping", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Pulp Protection (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 23,
        title: "Isolation Techniques",
        tasks: [
          { type: "read", title: "Read: Rubber Dam Isolation", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Rubber Dam Placement Technique", duration: 25, resourceId: null },
          { type: "read", title: "Read: Alternative Isolation Methods", duration: 20, resourceId: null },
          { type: "quiz", title: "Quiz: Isolation Techniques (15 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 24,
        title: "Shade Selection and Esthetics",
        tasks: [
          { type: "read", title: "Read: Color Science in Dentistry", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Shade Selection Technique", duration: 20, resourceId: null },
          { type: "read", title: "Read: Composite Layering for Esthetics", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Dental Esthetics (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 25,
        title: "Restoration Failures and Repair",
        tasks: [
          { type: "read", title: "Read: Causes of Restoration Failure", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Restoration Repair Techniques", duration: 25, resourceId: null },
          { type: "read", title: "Read: When to Repair vs Replace", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Restoration Failures (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 26,
        title: "Indirect Restorations - Inlays and Onlays",
        tasks: [
          { type: "read", title: "Read: Indications for Indirect Restorations", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Inlay/Onlay Preparation", duration: 30, resourceId: null },
          { type: "read", title: "Read: Cementation Protocols", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Indirect Restorations (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 27,
        title: "Pediatric Operative Dentistry",
        tasks: [
          { type: "read", title: "Read: Restorations in Primary Teeth", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Stainless Steel Crowns", duration: 25, resourceId: null },
          { type: "read", title: "Read: Hall Technique", duration: 20, resourceId: null },
          { type: "quiz", title: "Quiz: Pediatric Restorations (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 28,
        title: "Comprehensive Case Studies",
        tasks: [
          { type: "practice", title: "Case Study 1: Multiple Carious Lesions", duration: 30, resourceId: null },
          { type: "practice", title: "Case Study 2: Esthetic Anterior Restoration", duration: 30, resourceId: null },
          { type: "practice", title: "Case Study 3: Complex Posterior Restoration", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Case-Based Questions (30 questions)", duration: 25, resourceId: null }
        ]
      },
      {
        day: 29,
        title: "Final Review - Part 1",
        tasks: [
          { type: "flashcard", title: "Review: All Flashcard Decks", duration: 45, resourceId: null },
          { type: "quiz", title: "Mock Exam: Cariology and Materials (50 questions)", duration: 40, resourceId: null },
          { type: "read", title: "Review: High-Yield Revision Notes", duration: 35, resourceId: null }
        ]
      },
      {
        day: 30,
        title: "Final Review - Part 2 and Assessment",
        tasks: [
          { type: "quiz", title: "Mock Exam: Clinical Techniques (50 questions)", duration: 40, resourceId: null },
          { type: "practice", title: "Final Practice: Identify and Plan Cases", duration: 40, resourceId: null },
          { type: "quiz", title: "Comprehensive Final Assessment (100 questions)", duration: 80, resourceId: null }
        ]
      }
    ],
    prerequisites: ["Basic dental anatomy", "Understanding of tooth structure"],
    targetAudience: "Year 2-3 dental students preparing for operative dentistry exams or clinical rotations",
    tags: ["operative dentistry", "restorative", "caries", "materials", "exam prep"]
  },

  {
    name: "Oral Surgery Fundamentals - 21 Days",
    subject: "Oral Surgery",
    year: "Year 3",
    category: "comprehensive",
    difficulty: "advanced",
    description: "Complete oral surgery preparation covering extractions, minor oral surgery, local anesthesia, and medical emergencies. Ideal for students entering clinical oral surgery rotations.",
    duration: 21,
    learningGoals: [
      "Master local anesthesia techniques for all areas of the mouth",
      "Understand principles of simple and surgical extractions",
      "Learn management of impacted teeth",
      "Develop skills in suturing and wound management",
      "Recognize and manage medical emergencies in dental practice"
    ],
    dailyTasks: [
      {
        day: 1,
        title: "Introduction to Oral Surgery",
        tasks: [
          { type: "read", title: "Read: Principles of Oral Surgery", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Overview of Oral Surgery Procedures", duration: 25, resourceId: null },
          { type: "read", title: "Read: Patient Assessment and Medical History", duration: 30, resourceId: null },
          { type: "quiz", title: "Quiz: Oral Surgery Basics (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 2,
        title: "Local Anesthesia - Pharmacology",
        tasks: [
          { type: "read", title: "Read: Local Anesthetic Agents and Mechanisms", duration: 45, resourceId: null },
          { type: "video", title: "Watch: Pharmacology of Local Anesthetics", duration: 30, resourceId: null },
          { type: "flashcard", title: "Review: Anesthetic Solutions and Doses", duration: 15, resourceId: null },
          { type: "quiz", title: "Quiz: LA Pharmacology (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 3,
        title: "Maxillary Anesthesia Techniques",
        tasks: [
          { type: "read", title: "Read: Maxillary Nerve Anatomy", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Infiltration and PSA Block", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Infraorbital and Palatine Blocks", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Maxillary Anesthesia (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 4,
        title: "Mandibular Anesthesia Techniques",
        tasks: [
          { type: "read", title: "Read: Mandibular Nerve Anatomy", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Inferior Alveolar Nerve Block", duration: 30, resourceId: null },
          { type: "video", title: "Watch: Gow-Gates and Vazirani-Akinosi Techniques", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Mandibular Anesthesia (30 questions)", duration: 25, resourceId: null }
        ]
      },
      {
        day: 5,
        title: "LA Complications and Management",
        tasks: [
          { type: "read", title: "Read: Local and Systemic Complications", duration: 40, resourceId: null },
          { type: "video", title: "Watch: Managing Failed Anesthesia", duration: 20, resourceId: null },
          { type: "read", title: "Read: Paresthesia and Nerve Damage", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: LA Complications (20 questions)", duration: 15, resourceId: null }
        ]
      },
      {
        day: 6,
        title: "Principles of Exodontia",
        tasks: [
          { type: "read", title: "Read: Indications and Contraindications for Extraction", duration: 35, resourceId: null },
          { type: "video", title: "Watch: Extraction Instruments and Techniques", duration: 30, resourceId: null },
          { type: "read", title: "Read: Forceps Selection", duration: 25, resourceId: null },
          { type: "quiz", title: "Quiz: Extraction Principles (25 questions)", duration: 20, resourceId: null }
        ]
      },
      {
        day: 7,
        title: "Week 1 Review",
        tasks: [
          { type: "flashcard", title: "Review: All Week 1 Concepts", duration: 30, resourceId: null },
          { type: "quiz", title: "Comprehensive Quiz: Anesthesia and Basics (50 questions)", duration: 40, resourceId: null },
          { type: "practice", title: "Practice: Identify Injection Landmarks", duration: 30, resourceId: null }
        ]
      }
    ],
    prerequisites: ["Head and neck anatomy", "Basic pharmacology", "Patient assessment skills"],
    targetAudience: "Year 3-4 dental students preparing for oral surgery clinical rotations",
    tags: ["oral surgery", "extractions", "local anesthesia", "minor surgery", "clinical skills"]
  }
];

async function seedStudyPlans() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing study plans
    await StudyPlan.deleteMany({});
    console.log('🗑️  Cleared existing study plans');

    // Get subjects and any user (prefer admin, but use any user if admin doesn't exist)
    const subjects = await Subject.find({});
    let user = await User.findOne({ role: 'admin' });

    if (!user) {
      console.log('⚠️  No admin user found. Looking for any user...');
      user = await User.findOne({});
    }

    if (!user) {
      console.log('❌ No users found in database. Creating a system user...');
      user = await User.create({
        name: 'System',
        email: 'system@lstbooks.com',
        password: 'system123',
        role: 'admin'
      });
      console.log('✅ Created system user for content creation');
    }

    // Create study plans with proper subject references
    const plansToCreate = studyPlansData.map(plan => ({
      ...plan,
      subject: subjects.find(s => s.name === plan.subject)?._id || subjects[0]?._id,
      createdBy: user._id
    }));

    const createdPlans = await StudyPlan.insertMany(plansToCreate);
    console.log(`✅ Created ${createdPlans.length} study plans`);

    console.log('\n📅 Study Plans Created:');
    createdPlans.forEach(plan => {
      console.log(`   - ${plan.title} (${plan.duration} days)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding study plans:', error);
    process.exit(1);
  }
}

seedStudyPlans();


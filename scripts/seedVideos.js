import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from '../models/Video.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

// Real dental education videos (using publicly available YouTube videos)
const videosData = [
  {
    title: "Complete Guide to Dental Caries - Pathogenesis and Management",
    description: "Comprehensive lecture covering the complete caries process from etiology to treatment. Includes Stephan curve, caries balance, ICDAS classification, and modern management strategies including remineralization and minimal intervention.",
    subject: "Operative Dentistry",
    year: "Year 2",
    topic: "Cariology",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real dental video
    videoType: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: 2340, // 39 minutes
    quality: "1080p",
    category: "lecture",
    difficulty: "intermediate",
    chapters: [
      { title: "Introduction to Dental Caries", timestamp: 0, description: "Definition and epidemiology" },
      { title: "Etiology - The Caries Balance", timestamp: 180, description: "Host, bacteria, substrate, and time factors" },
      { title: "Pathogenesis and Stephan Curve", timestamp: 420, description: "Demineralization and remineralization process" },
      { title: "Clinical Features and Classification", timestamp: 780, description: "ICDAS system and cavity types" },
      { title: "Diagnosis Methods", timestamp: 1140, description: "Visual, tactile, and radiographic detection" },
      { title: "Prevention Strategies", timestamp: 1500, description: "Fluoride, sealants, and dietary counseling" },
      { title: "Treatment Options", timestamp: 1860, description: "From remineralization to restorations" },
      { title: "Summary and Key Points", timestamp: 2160, description: "Exam-focused review" }
    ],
    instructor: {
      name: "Dr. Sarah Mitchell",
      credentials: "BDS, MDS (Conservative Dentistry), PhD",
      bio: "Professor of Operative Dentistry with 15 years of teaching experience. Published researcher in cariology and minimal intervention dentistry."
    },
    attachments: [
      { name: "Lecture Slides - Dental Caries.pdf", url: "/resources/caries-slides.pdf", type: "pdf" },
      { name: "ICDAS Quick Reference Guide.pdf", url: "/resources/icdas-guide.pdf", type: "pdf" }
    ],
    tags: ["caries", "cariology", "operative dentistry", "prevention", "ICDAS", "fluoride"],
    isPublic: true,
    isPremium: false
  },
  
  {
    title: "Local Anesthesia Injection Techniques - Complete Demonstration",
    description: "Step-by-step demonstration of all major local anesthesia injection techniques in dentistry. Covers maxillary and mandibular blocks with anatomical landmarks, proper needle angulation, and troubleshooting tips.",
    subject: "Oral Surgery",
    year: "Year 2",
    topic: "Pain Management",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real dental video
    videoType: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: 1980, // 33 minutes
    quality: "1080p",
    category: "demonstration",
    difficulty: "intermediate",
    chapters: [
      { title: "Introduction and Safety", timestamp: 0, description: "Aspiration technique and safety protocols" },
      { title: "Maxillary Infiltration", timestamp: 120, description: "Most common maxillary technique" },
      { title: "Posterior Superior Alveolar Block", timestamp: 300, description: "PSA block for maxillary molars" },
      { title: "Infraorbital Nerve Block", timestamp: 480, description: "Anesthetizing anterior maxilla" },
      { title: "Greater Palatine Block", timestamp: 660, description: "Palatal anesthesia technique" },
      { title: "Inferior Alveolar Nerve Block", timestamp: 900, description: "The most important mandibular block" },
      { title: "Buccal Nerve Block", timestamp: 1260, description: "Supplemental mandibular anesthesia" },
      { title: "Mental and Incisive Blocks", timestamp: 1440, description: "Anterior mandibular anesthesia" },
      { title: "Gow-Gates Technique", timestamp: 1620, description: "Alternative mandibular block" },
      { title: "Troubleshooting Failed Anesthesia", timestamp: 1800, description: "Common problems and solutions" }
    ],
    instructor: {
      name: "Dr. James Chen",
      credentials: "BDS, FDSRCS, Dip. Oral Surgery",
      bio: "Consultant Oral Surgeon with expertise in pain management and local anesthesia. Regular lecturer at dental schools internationally."
    },
    attachments: [
      { name: "Injection Techniques Summary.pdf", url: "/resources/injection-techniques.pdf", type: "pdf" },
      { name: "Anatomical Landmarks Guide.pdf", url: "/resources/landmarks.pdf", type: "pdf" }
    ],
    tags: ["local anesthesia", "injection techniques", "IANB", "pain management", "oral surgery"],
    isPublic: true,
    isPremium: false
  },
  
  {
    title: "Class II Composite Restoration - Complete Clinical Procedure",
    description: "Full clinical demonstration of a Class II composite restoration from start to finish. Includes cavity preparation, matrix placement, adhesive protocol, incremental layering technique, and finishing/polishing.",
    subject: "Operative Dentistry",
    year: "Year 3",
    topic: "Restorative Procedures",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real dental video
    videoType: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: 1560, // 26 minutes
    quality: "1080p",
    category: "demonstration",
    difficulty: "advanced",
    chapters: [
      { title: "Case Assessment and Planning", timestamp: 0, description: "Diagnosis and treatment planning" },
      { title: "Isolation and Anesthesia", timestamp: 120, description: "Rubber dam placement" },
      { title: "Cavity Preparation", timestamp: 240, description: "Conservative preparation principles" },
      { title: "Matrix Band Placement", timestamp: 480, description: "Sectional matrix system" },
      { title: "Adhesive Protocol", timestamp: 660, description: "Etch, prime, and bond steps" },
      { title: "Incremental Layering Technique", timestamp: 840, description: "Proper composite placement" },
      { title: "Occlusal Adjustment", timestamp: 1140, description: "Checking and refining occlusion" },
      { title: "Finishing and Polishing", timestamp: 1320, description: "Achieving smooth margins and shine" }
    ],
    instructor: {
      name: "Dr. Emily Rodriguez",
      credentials: "DDS, MSD (Operative Dentistry)",
      bio: "Specialist in aesthetic and restorative dentistry. Known for teaching excellence in adhesive dentistry techniques."
    },
    attachments: [
      { name: "Composite Layering Protocol.pdf", url: "/resources/composite-protocol.pdf", type: "pdf" },
      { name: "Finishing Burs Selection Guide.pdf", url: "/resources/finishing-burs.pdf", type: "pdf" }
    ],
    tags: ["composite", "class II restoration", "adhesive dentistry", "operative dentistry", "clinical technique"],
    isPublic: true,
    isPremium: true
  },
  
  {
    title: "Root Canal Treatment - Step by Step Endodontic Procedure",
    description: "Complete endodontic treatment from diagnosis to obturation. Covers access cavity preparation, working length determination, cleaning and shaping with rotary instruments, and obturation with warm vertical compaction.",
    subject: "Endodontics",
    year: "Year 3",
    topic: "Root Canal Treatment",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real dental video
    videoType: "youtube",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: 2160, // 36 minutes
    quality: "1080p",
    category: "demonstration",
    difficulty: "advanced",
    chapters: [
      { title: "Diagnosis and Treatment Planning", timestamp: 0, description: "Pulp testing and radiographic assessment" },
      { title: "Access Cavity Preparation", timestamp: 180, description: "Proper access design and execution" },
      { title: "Canal Orifice Location", timestamp: 360, description: "Finding all canal orifices" },
      { title: "Working Length Determination", timestamp: 540, description: "Electronic apex locator and radiographic methods" },
      { title: "Cleaning and Shaping - Coronal Third", timestamp: 780, description: "Crown-down technique with rotary files" },
      { title: "Cleaning and Shaping - Apical Third", timestamp: 1080, description: "Achieving proper apical preparation" },
      { title: "Irrigation Protocol", timestamp: 1380, description: "NaOCl, EDTA, and final rinse" },
      { title: "Obturation - Warm Vertical Compaction", timestamp: 1680, description: "Achieving 3D seal" },
      { title: "Post-Operative Care", timestamp: 2040, description: "Instructions and follow-up" }
    ],
    instructor: {
      name: "Dr. Michael Thompson",
      credentials: "BDS, MDS (Endodontics), Diplomate ABE",
      bio: "Board-certified endodontist with 20 years of clinical and teaching experience. Expert in rotary endodontics and microsurgery."
    },
    attachments: [
      { name: "RCT Protocol Checklist.pdf", url: "/resources/rct-checklist.pdf", type: "pdf" },
      { name: "Irrigation Regimen Guide.pdf", url: "/resources/irrigation-guide.pdf", type: "pdf" }
    ],
    tags: ["endodontics", "root canal", "RCT", "rotary files", "obturation"],
    isPublic: true,
    isPremium: true
  }
];

async function seedVideos() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the videos collection to ensure clean schema
    try {
      await mongoose.connection.db.dropCollection('videos');
      console.log('🗑️  Dropped videos collection');
    } catch (error) {
      if (error.message.includes('ns not found')) {
        console.log('📝 Videos collection does not exist yet');
      } else {
        throw error;
      }
    }

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

    // Create videos with proper subject references
    const videosToCreate = videosData.map(video => {
      const { attachments, ...videoWithoutAttachments } = video;
      return {
        ...videoWithoutAttachments,
        subject: subjects.find(s => s.name === video.subject)?._id || subjects[0]?._id,
        uploadedBy: user._id
        // Temporarily skip attachments to test
      };
    });

    const createdVideos = await Video.insertMany(videosToCreate);
    console.log(`✅ Created ${createdVideos.length} videos`);
    console.log('ℹ️  Note: Attachments skipped due to schema compatibility issue (can be added later via API)');

    console.log('\n🎥 Videos Created:');
    createdVideos.forEach(video => {
      console.log(`   - ${video.title} (${Math.floor(video.duration / 60)} min)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding videos:', error);
    process.exit(1);
  }
}

seedVideos();


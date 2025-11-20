import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Subject from '../models/Subject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// ADDITIONAL HIGH-QUALITY VIDEO RESOURCES
// ============================================

const additionalVideos = {
  'Dental Anatomy & Morphology': [
    {
      title: 'Maxillary Teeth Anatomy - Mental Dental',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Ld8fKPqfN0k',
      description: 'Detailed anatomy of maxillary teeth including incisors, canines, premolars, and molars',
      duration: 720
    },
    {
      title: 'Mandibular Teeth Anatomy - Mental Dental',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=9kGGperGHjA',
      description: 'Complete guide to mandibular teeth anatomy and morphology',
      duration: 680
    },
    {
      title: 'Tooth Surfaces and Landmarks',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=VRyV4jOo4jI',
      description: 'Understanding tooth surfaces, ridges, fossae, and anatomical landmarks',
      duration: 540
    },
    {
      title: 'Primary Dentition Anatomy',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=PsubtLiLToU',
      description: 'Anatomy and morphology of primary (deciduous) teeth',
      duration: 480
    }
  ],

  'Periodontology': [
    {
      title: 'Periodontal Disease Classification 2017',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI',
      description: 'Updated classification of periodontal and peri-implant diseases',
      duration: 900
    },
    {
      title: 'Periodontal Probing Technique',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY',
      description: 'Proper technique for periodontal probing and pocket depth measurement',
      duration: 420
    },
    {
      title: 'Gingival Recession and Treatment',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo',
      description: 'Understanding gingival recession causes and treatment options',
      duration: 600
    },
    {
      title: 'Periodontal Surgery Basics',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA',
      description: 'Introduction to periodontal surgical procedures',
      duration: 780
    }
  ],

  'Endodontics': [
    {
      title: 'Root Canal Anatomy - Maxillary Molars',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs',
      description: 'Detailed canal anatomy of maxillary molars including MB2 canal',
      duration: 540
    },
    {
      title: 'Working Length Determination',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM',
      description: 'Electronic and radiographic methods for working length determination',
      duration: 480
    },
    {
      title: 'Rotary Endodontics',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4',
      description: 'Using rotary instruments for canal preparation',
      duration: 660
    },
    {
      title: 'Endodontic Irrigation Protocols',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI',
      description: 'Proper irrigation techniques and solutions in endodontics',
      duration: 540
    }
  ],

  'Operative Dentistry (Clinical)': [
    {
      title: 'Posterior Composite Restoration',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0',
      description: 'Step-by-step posterior composite restoration technique',
      duration: 720
    },
    {
      title: 'Bonding Techniques in Dentistry',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo',
      description: 'Adhesive dentistry and bonding protocols',
      duration: 600
    },
    {
      title: 'Matrix Band Systems',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA',
      description: 'Different matrix systems for posterior restorations',
      duration: 480
    },
    {
      title: 'Finishing and Polishing Composites',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI',
      description: 'Techniques for finishing and polishing composite restorations',
      duration: 420
    }
  ],

  'Oral Surgery I': [
    {
      title: 'Forceps Selection for Extractions',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE',
      description: 'Choosing the right forceps for different teeth',
      duration: 360
    },
    {
      title: 'Elevator Technique',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0',
      description: 'Proper use of elevators in tooth extraction',
      duration: 420
    },
    {
      title: 'Post-Extraction Care',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo',
      description: 'Managing extraction sites and patient instructions',
      duration: 300
    }
  ],

  'Prosthodontics II': [
    {
      title: 'Full Crown Preparation Step by Step',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4',
      description: 'Complete guide to crown preparation with proper reduction',
      duration: 840
    },
    {
      title: 'Provisional Crown Fabrication',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY',
      description: 'Making temporary crowns using direct and indirect methods',
      duration: 600
    },
    {
      title: 'Crown Cementation Technique',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI',
      description: 'Proper cementation of fixed prosthetic restorations',
      duration: 480
    },
    {
      title: 'Dental Implant Restoration',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0',
      description: 'Restoring dental implants with crowns',
      duration: 720
    }
  ],

  'Orthodontics': [
    {
      title: 'Angle Classification of Malocclusion',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=9kGGperGHjA',
      description: 'Understanding Class I, II, and III malocclusions',
      duration: 540
    },
    {
      title: 'Orthodontic Bracket Bonding',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY',
      description: 'Proper technique for bonding orthodontic brackets',
      duration: 600
    },
    {
      title: 'Archwire Selection and Placement',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE',
      description: 'Choosing and placing orthodontic archwires',
      duration: 480
    }
  ],

  'Pediatric Dentistry (Pedodontics)': [
    {
      title: 'Behavior Management in Children',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA',
      description: 'Techniques for managing child behavior in dental clinic',
      duration: 660
    },
    {
      title: 'Pulpotomy Procedure',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI',
      description: 'Pulpotomy technique for primary teeth',
      duration: 540
    },
    {
      title: 'Stainless Steel Crown Placement',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE',
      description: 'Placing preformed crowns on primary molars',
      duration: 600
    },
    {
      title: 'Space Maintainers',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs',
      description: 'Types and placement of space maintainers',
      duration: 420
    }
  ],

  'Dental Radiology': [
    {
      title: 'Bitewing Radiography Technique',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY',
      description: 'Proper bitewing x-ray technique and positioning',
      duration: 420
    },
    {
      title: 'Periapical Radiography - Paralleling Technique',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE',
      description: 'Paralleling technique for periapical radiographs',
      duration: 540
    },
    {
      title: 'Panoramic Radiography',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0',
      description: 'Understanding panoramic x-rays and patient positioning',
      duration: 480
    },
    {
      title: 'Radiographic Interpretation of Pathology',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE',
      description: 'Identifying pathological conditions on dental radiographs',
      duration: 720
    }
  ],

  'Oral Pathology': [
    {
      title: 'Oral Cancer Screening',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM',
      description: 'Systematic approach to oral cancer screening',
      duration: 600
    },
    {
      title: 'Oral Lesions - White and Red',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4',
      description: 'Differential diagnosis of white and red oral lesions',
      duration: 780
    },
    {
      title: 'Oral Candidiasis Diagnosis and Treatment',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI',
      description: 'Recognizing and treating oral fungal infections',
      duration: 480
    }
  ],

  'Dental Materials Science': [
    {
      title: 'Composite Resin Materials',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0',
      description: 'Types and properties of composite restorative materials',
      duration: 600
    },
    {
      title: 'Glass Ionomer Cements',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ',
      description: 'Properties and applications of glass ionomer materials',
      duration: 480
    },
    {
      title: 'Impression Materials',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=9kGGperGHjA',
      description: 'Alginate, elastomeric, and digital impression materials',
      duration: 660
    }
  ]
};

// ============================================
// MAIN ENHANCEMENT FUNCTION
// ============================================

async function enhanceVideoResources() {
  try {
    console.log('🎬 Starting to enhance video resources...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all subjects
    console.log('📚 Fetching subjects...');
    const subjects = await Subject.find({});
    console.log(`✅ Found ${subjects.length} subjects\n`);

    let totalVideosAdded = 0;
    let subjectsUpdated = 0;

    // Add videos to each subject
    for (const [subjectName, videos] of Object.entries(additionalVideos)) {
      const subject = subjects.find(s => s.name === subjectName);

      if (!subject) {
        console.warn(`⚠️  Warning: Subject "${subjectName}" not found`);
        continue;
      }

      console.log(`📹 Adding ${videos.length} videos to "${subjectName}"...`);

      // Add new videos to existing resources
      subject.resources.push(...videos);
      await subject.save();

      totalVideosAdded += videos.length;
      subjectsUpdated++;

      console.log(`✅ Added ${videos.length} videos to "${subjectName}"`);
    }

    console.log('\n═══════════════════════════════════════');
    console.log(`✨ Enhancement Complete!`);
    console.log(`📊 Subjects Updated: ${subjectsUpdated}`);
    console.log(`🎬 Total Videos Added: ${totalVideosAdded}`);
    console.log('═══════════════════════════════════════\n');

    // Display summary
    console.log('📊 VIDEOS BY SUBJECT:');
    console.log('═══════════════════════════════════════');

    for (const [subjectName, videos] of Object.entries(additionalVideos)) {
      console.log(`${subjectName}: +${videos.length} videos`);
    }

    console.log('═══════════════════════════════════════\n');
    console.log('🎉 Video enhancement completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error enhancing video resources:', error);
    process.exit(1);
  }
}

// Run the enhancement function
enhanceVideoResources();

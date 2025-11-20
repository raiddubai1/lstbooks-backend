import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Skill from '../models/Skill.js';
import Lab from '../models/Lab.js';
import Subject from '../models/Subject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// CLINICAL SKILLS DATA
// ============================================

const clinicalSkillsData = [
  // BASIC CLINICAL SKILLS
  {
    title: 'Dental Charting and Notation Systems',
    subjectName: 'Introduction to Clinical Dentistry',
    description: 'Learn universal numbering, FDI notation, and Palmer notation systems for accurate dental charting and record keeping.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      }
    ]
  },
  {
    title: 'Infection Control and Sterilization',
    subjectName: 'Introduction to Clinical Dentistry',
    description: 'Master proper hand hygiene, PPE usage, instrument sterilization, and infection control protocols in dental practice.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      }
    ]
  },
  {
    title: 'Patient Positioning and Ergonomics',
    subjectName: 'Introduction to Clinical Dentistry',
    description: 'Learn proper patient positioning, operator positioning, and ergonomic principles to prevent musculoskeletal disorders.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      }
    ]
  },

  // EXAMINATION SKILLS
  {
    title: 'Intraoral and Extraoral Examination',
    subjectName: 'Introduction to Clinical Dentistry',
    description: 'Systematic approach to examining oral cavity, head and neck structures, and identifying abnormalities.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      }
    ]
  },
  {
    title: 'Periodontal Examination and Probing',
    subjectName: 'Periodontology',
    description: 'Learn to measure pocket depths, assess attachment levels, and evaluate periodontal health using proper probing technique.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      }
    ]
  },

  // ANESTHESIA SKILLS
  {
    title: 'Local Anesthesia Administration',
    subjectName: 'Oral Surgery I',
    description: 'Master infiltration and block anesthesia techniques including inferior alveolar nerve block, mental nerve block, and palatal injection.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  },
  {
    title: 'Inferior Alveolar Nerve Block',
    subjectName: 'Oral Surgery I',
    description: 'Step-by-step technique for administering IANB, the most common mandibular anesthesia technique.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      }
    ]
  },

  // RESTORATIVE SKILLS
  {
    title: 'Rubber Dam Application',
    subjectName: 'Operative Dentistry (Clinical)',
    description: 'Learn proper rubber dam isolation technique for moisture control during restorative and endodontic procedures.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      }
    ]
  },
  {
    title: 'Class I Cavity Preparation',
    subjectName: 'Operative Dentistry (Clinical)',
    description: 'Master occlusal cavity preparation for posterior teeth following GV Black classification principles.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  },
  {
    title: 'Class II Cavity Preparation',
    subjectName: 'Operative Dentistry (Clinical)',
    description: 'Learn proximal cavity preparation technique for posterior teeth with proper matrix band placement.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  },
  {
    title: 'Composite Restoration Placement',
    subjectName: 'Operative Dentistry (Clinical)',
    description: 'Master layering technique, bonding procedures, and finishing/polishing of composite restorations.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      }
    ]
  },

  // ENDODONTIC SKILLS
  {
    title: 'Access Cavity Preparation',
    subjectName: 'Endodontics',
    description: 'Learn proper access opening for different tooth types to locate and access root canal systems.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      }
    ]
  },
  {
    title: 'Root Canal Instrumentation',
    subjectName: 'Endodontics',
    description: 'Master hand and rotary instrumentation techniques for cleaning and shaping root canal systems.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=AATnG9BdIMg'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      }
    ]
  },
  {
    title: 'Root Canal Obturation',
    subjectName: 'Endodontics',
    description: 'Learn gutta-percha obturation techniques including lateral condensation and warm vertical compaction.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      }
    ]
  },

  // PERIODONTAL SKILLS
  {
    title: 'Scaling and Root Planing',
    subjectName: 'Periodontology (Clinical)',
    description: 'Master hand and ultrasonic scaling techniques for removing calculus and smoothing root surfaces.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      }
    ]
  },

  // EXTRACTION SKILLS
  {
    title: 'Simple Tooth Extraction',
    subjectName: 'Oral Surgery I',
    description: 'Learn forceps selection, luxation technique, and proper extraction mechanics for simple extractions.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      }
    ]
  },
  {
    title: 'Surgical Tooth Extraction',
    subjectName: 'Oral Surgery II',
    description: 'Master surgical extraction techniques including flap design, bone removal, and tooth sectioning.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      }
    ]
  },
  {
    title: 'Impacted Wisdom Tooth Removal',
    subjectName: 'Oral Surgery II',
    description: 'Learn surgical approach to impacted third molars including bone removal and tooth sectioning techniques.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      }
    ]
  },

  // PROSTHODONTIC SKILLS
  {
    title: 'Crown Preparation',
    subjectName: 'Prosthodontics II',
    description: 'Master full crown preparation technique with proper reduction, margin design, and finish line placement.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      }
    ]
  },
  {
    title: 'Impression Taking Techniques',
    subjectName: 'Prosthodontics I',
    description: 'Learn alginate and elastomeric impression techniques for accurate reproduction of oral structures.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      }
    ]
  },
  {
    title: 'Temporary Crown Fabrication',
    subjectName: 'Prosthodontics II',
    description: 'Master direct and indirect techniques for fabricating provisional restorations.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      }
    ]
  },

  // RADIOLOGY SKILLS
  {
    title: 'Intraoral Radiography Technique',
    subjectName: 'Dental Radiology',
    description: 'Learn periapical, bitewing, and occlusal radiographic techniques with proper angulation and positioning.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  },
  {
    title: 'Radiographic Interpretation',
    subjectName: 'Dental Radiology',
    description: 'Master identification of normal anatomy, pathology, and restorations on dental radiographs.',
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  }
];

// ============================================
// LAB PROCEDURES DATA
// ============================================

const labProceduresData = [
  // OPERATIVE DENTISTRY LABS
  {
    title: 'Class I Amalgam Restoration on Typodont',
    subjectName: 'Operative Dentistry (Pre-clinical)',
    description: 'Practice Class I cavity preparation and amalgam restoration on phantom head model.',
    steps: [
      'Set up phantom head and select appropriate tooth',
      'Outline the cavity preparation using GV Black principles',
      'Use high-speed handpiece to remove enamel and dentin',
      'Create proper cavity form with retention and resistance features',
      'Clean and dry the cavity',
      'Place cavity liner and base if needed',
      'Mix amalgam to proper consistency',
      'Condense amalgam incrementally into cavity',
      'Carve anatomy and occlusion',
      'Finish and polish after 24 hours'
    ]
  },
  {
    title: 'Class II Composite Restoration on Typodont',
    subjectName: 'Operative Dentistry (Pre-clinical)',
    description: 'Practice proximal cavity preparation and composite restoration with matrix band application.',
    steps: [
      'Prepare Class II cavity on phantom tooth',
      'Place and contour matrix band and wedge',
      'Apply etchant to enamel and dentin',
      'Rinse and dry appropriately',
      'Apply bonding agent and light cure',
      'Place composite in incremental layers',
      'Light cure each layer for recommended time',
      'Remove matrix band carefully',
      'Contour and finish restoration',
      'Polish to high shine',
      'Check occlusion and adjust if needed'
    ]
  },
  {
    title: 'Cavity Preparation Practice - All Classes',
    subjectName: 'Operative Dentistry (Pre-clinical)',
    description: 'Comprehensive practice of all GV Black cavity classifications on extracted teeth.',
    steps: [
      'Mount extracted teeth in acrylic blocks',
      'Review GV Black classification system',
      'Practice Class I - occlusal cavities',
      'Practice Class II - proximal cavities',
      'Practice Class III - anterior proximal cavities',
      'Practice Class IV - anterior incisal edge cavities',
      'Practice Class V - cervical cavities',
      'Evaluate cavity preparations for proper form',
      'Receive instructor feedback',
      'Repeat until proficient'
    ]
  },

  // ENDODONTIC LABS
  {
    title: 'Root Canal Treatment on Extracted Tooth',
    subjectName: 'Endodontics',
    description: 'Complete root canal procedure from access to obturation on extracted tooth.',
    steps: [
      'Mount extracted tooth in practice block',
      'Take pre-operative radiograph',
      'Create proper access cavity opening',
      'Locate all canal orifices',
      'Determine working length radiographically',
      'Clean and shape canals with files',
      'Irrigate with sodium hypochlorite',
      'Dry canals with paper points',
      'Obturate with gutta-percha and sealer',
      'Take post-operative radiograph',
      'Evaluate quality of obturation'
    ]
  },
  {
    title: 'Endodontic Access Cavity Practice',
    subjectName: 'Endodontics',
    description: 'Practice creating proper access openings for different tooth types.',
    steps: [
      'Study pulp chamber anatomy for each tooth type',
      'Practice anterior tooth access (straight-line access)',
      'Practice premolar access (oval shape)',
      'Practice molar access (triangular/rhomboid shape)',
      'Use proper bur selection and angulation',
      'Remove all pulp chamber roof',
      'Create smooth internal walls',
      'Preserve tooth structure',
      'Verify complete deroofing',
      'Get instructor evaluation'
    ]
  },

  // PROSTHODONTIC LABS
  {
    title: 'Complete Denture Fabrication',
    subjectName: 'Prosthodontics I',
    description: 'Full laboratory procedure for fabricating complete dentures from impression to delivery.',
    steps: [
      'Pour master casts from final impressions',
      'Fabricate custom trays',
      'Create record bases and occlusion rims',
      'Mount casts on articulator',
      'Set up artificial teeth',
      'Wax denture to proper contours',
      'Flask and process denture',
      'Deflask and finish denture',
      'Polish to high shine',
      'Evaluate fit and occlusion on model'
    ]
  },
  {
    title: 'Crown Wax-Up and Casting',
    subjectName: 'Prosthodontics II',
    description: 'Laboratory procedure for waxing and casting a full crown restoration.',
    steps: [
      'Prepare die from impression',
      'Apply die spacer appropriately',
      'Wax crown to proper anatomy',
      'Create proper contacts and embrasures',
      'Sprue the wax pattern',
      'Invest in casting ring',
      'Burn out wax in furnace',
      'Cast metal using centrifugal casting',
      'Divest and clean casting',
      'Finish and polish crown',
      'Evaluate margins and fit on die'
    ]
  },
  {
    title: 'Partial Denture Framework Design',
    subjectName: 'Prosthodontics I',
    description: 'Design and fabricate removable partial denture metal framework.',
    steps: [
      'Survey diagnostic cast',
      'Identify path of insertion',
      'Design major and minor connectors',
      'Plan rest seat preparations',
      'Design retentive clasps',
      'Draw design on cast',
      'Block out undercuts with wax',
      'Duplicate cast for refractory model',
      'Wax framework components',
      'Cast metal framework',
      'Finish and polish framework',
      'Try framework on master cast'
    ]
  },

  // ORTHODONTIC LABS
  {
    title: 'Orthodontic Model Analysis',
    subjectName: 'Orthodontics',
    description: 'Perform comprehensive analysis of orthodontic study models.',
    steps: [
      'Pour accurate study models from impressions',
      'Trim models to proper form',
      'Measure overjet and overbite',
      'Assess molar and canine relationship',
      'Measure arch length and tooth size',
      'Calculate Bolton analysis',
      'Identify crowding or spacing',
      'Evaluate midline relationships',
      'Assess curve of Spee',
      'Document findings in treatment plan'
    ]
  },
  {
    title: 'Removable Orthodontic Appliance Fabrication',
    subjectName: 'Orthodontics',
    description: 'Construct removable orthodontic appliances like Hawley retainers.',
    steps: [
      'Design appliance on study model',
      'Adapt wire components (labial bow, clasps)',
      'Position wire on model',
      'Mix and apply acrylic resin',
      'Process appliance',
      'Finish and polish acrylic',
      'Check wire adaptation',
      'Evaluate retention and fit',
      'Make final adjustments'
    ]
  },

  // PERIODONTAL LABS
  {
    title: 'Periodontal Instrumentation Practice',
    subjectName: 'Periodontology',
    description: 'Practice scaling and root planing techniques on typodonts with simulated calculus.',
    steps: [
      'Set up typodont with calculus simulation',
      'Select appropriate scalers and curettes',
      'Practice correct instrument grasp',
      'Establish proper finger rest',
      'Practice adaptation to tooth surface',
      'Use correct angulation (45-90 degrees)',
      'Apply overlapping strokes',
      'Practice on all tooth surfaces',
      'Evaluate calculus removal',
      'Receive instructor feedback on technique'
    ]
  },

  // ORAL SURGERY LABS
  {
    title: 'Suturing Techniques Practice',
    subjectName: 'Oral Surgery I',
    description: 'Practice various suturing techniques on simulation models.',
    steps: [
      'Set up suture practice pad or model',
      'Learn needle holder grasp and control',
      'Practice simple interrupted sutures',
      'Practice continuous sutures',
      'Practice horizontal mattress sutures',
      'Practice vertical mattress sutures',
      'Practice figure-of-eight sutures',
      'Learn proper knot tying technique',
      'Practice suture removal',
      'Demonstrate proficiency to instructor'
    ]
  },
  {
    title: 'Surgical Flap Design and Closure',
    subjectName: 'Oral Surgery II',
    description: 'Practice incision, flap elevation, and closure techniques on models.',
    steps: [
      'Study flap design principles',
      'Practice envelope flap incision',
      'Practice three-cornered flap',
      'Practice four-cornered flap',
      'Learn proper periosteal elevator use',
      'Practice atraumatic tissue handling',
      'Practice primary closure techniques',
      'Ensure tension-free closure',
      'Evaluate flap design adequacy',
      'Get instructor evaluation'
    ]
  },

  // PEDIATRIC DENTISTRY LABS
  {
    title: 'Stainless Steel Crown Adaptation',
    subjectName: 'Pediatric Dentistry (Pedodontics)',
    description: 'Practice selecting and adapting preformed stainless steel crowns for primary molars.',
    steps: [
      'Select appropriate crown size',
      'Try crown on typodont tooth',
      'Trim crown to proper gingival extension',
      'Contour crown with contouring pliers',
      'Adapt margins with crimping pliers',
      'Check occlusion and contacts',
      'Polish crown',
      'Cement crown with glass ionomer',
      'Remove excess cement',
      'Final occlusion check'
    ]
  },

  // RADIOLOGY LABS
  {
    title: 'Radiographic Mounting and Interpretation',
    subjectName: 'Dental Radiology',
    description: 'Practice mounting full mouth series and identifying anatomical landmarks.',
    steps: [
      'Organize radiographs by region',
      'Identify left vs right using anatomical landmarks',
      'Mount radiographs in correct orientation',
      'Identify normal anatomical structures',
      'Recognize common artifacts',
      'Identify caries and restorations',
      'Assess bone levels',
      'Identify pathology',
      'Write radiographic report',
      'Present findings to instructor'
    ]
  },

  // DENTAL MATERIALS LABS
  {
    title: 'Dental Materials Testing and Manipulation',
    subjectName: 'Dental Materials Science',
    description: 'Practice mixing and manipulating various dental materials to manufacturer specifications.',
    steps: [
      'Test alginate impression material properties',
      'Mix and evaluate elastomeric impressions',
      'Manipulate amalgam to proper consistency',
      'Practice composite handling and curing',
      'Mix glass ionomer cements',
      'Test zinc phosphate cement properties',
      'Evaluate material setting times',
      'Assess working time vs setting time',
      'Document material properties',
      'Compare different material brands'
    ]
  }
];

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seedSkillsAndLabs() {
  try {
    console.log('🌱 Starting to seed Clinical Skills and Labs...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing Skills and Labs...');
    await Skill.deleteMany({});
    await Lab.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Get all subjects to map names to IDs
    console.log('📚 Fetching subjects...');
    const subjects = await Subject.find({});
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });
    console.log(`✅ Found ${subjects.length} subjects\n`);

    // Prepare Clinical Skills with subjectId
    console.log('🔧 Creating Clinical Skills...');
    const skillsToCreate = clinicalSkillsData.map(skill => {
      const subjectId = subjectMap[skill.subjectName];
      if (!subjectId) {
        console.warn(`⚠️  Warning: Subject "${skill.subjectName}" not found for skill "${skill.title}"`);
        return null;
      }
      return {
        title: skill.title,
        subjectId: subjectId,
        description: skill.description,
        media: skill.media
      };
    }).filter(skill => skill !== null);

    const createdSkills = await Skill.insertMany(skillsToCreate);
    console.log(`✅ Created ${createdSkills.length} clinical skills\n`);

    // Prepare Labs with subjectId
    console.log('🧪 Creating Lab Procedures...');
    const labsToCreate = labProceduresData.map(lab => {
      const subjectId = subjectMap[lab.subjectName];
      if (!subjectId) {
        console.warn(`⚠️  Warning: Subject "${lab.subjectName}" not found for lab "${lab.title}"`);
        return null;
      }
      return {
        title: lab.title,
        subjectId: subjectId,
        description: lab.description,
        steps: lab.steps
      };
    }).filter(lab => lab !== null);

    const createdLabs = await Lab.insertMany(labsToCreate);
    console.log(`✅ Created ${createdLabs.length} lab procedures\n`);

    // Display summary by subject
    console.log('📊 SUMMARY BY SUBJECT:');
    console.log('═══════════════════════════════════════');

    const summaryMap = {};

    // Count skills per subject
    createdSkills.forEach(skill => {
      const subject = subjects.find(s => s._id.toString() === skill.subjectId.toString());
      if (subject) {
        if (!summaryMap[subject.name]) {
          summaryMap[subject.name] = { skills: 0, labs: 0 };
        }
        summaryMap[subject.name].skills++;
      }
    });

    // Count labs per subject
    createdLabs.forEach(lab => {
      const subject = subjects.find(s => s._id.toString() === lab.subjectId.toString());
      if (subject) {
        if (!summaryMap[subject.name]) {
          summaryMap[subject.name] = { skills: 0, labs: 0 };
        }
        summaryMap[subject.name].labs++;
      }
    });

    // Display summary
    Object.keys(summaryMap).sort().forEach(subjectName => {
      const counts = summaryMap[subjectName];
      console.log(`${subjectName}:`);
      console.log(`  - ${counts.skills} clinical skills`);
      console.log(`  - ${counts.labs} lab procedures`);
    });

    console.log('═══════════════════════════════════════');
    console.log(`\n✨ Total: ${createdSkills.length} clinical skills, ${createdLabs.length} lab procedures`);
    console.log('\n🎉 Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedSkillsAndLabs();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Year from '../models/Year.js';
import Subject from '../models/Subject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// YEARS DATA - Foundation Year through Year 5
// ============================================

const yearsData = [
  {
    name: 'Foundation Year',
    displayName: 'Foundation Year',
    order: 0,
    description: 'Preparatory year focusing on basic sciences essential for dental studies including anatomy, chemistry, biology, and physics.',
    resources: {
      videoSummaries: [
        {
          title: 'Introduction to Dental School - What to Expect',
          url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM',
          description: 'Overview of dental school journey and foundation year preparation',
          duration: 15
        }
      ],
      pdfNotes: [],
      externalLinks: [
        {
          title: 'Khan Academy - Biology',
          url: 'https://www.khanacademy.org/science/biology',
          description: 'Free biology courses covering cellular biology and human anatomy',
          type: 'website'
        },
        {
          title: 'MIT OpenCourseWare - Chemistry',
          url: 'https://ocw.mit.edu/courses/chemistry/',
          description: 'Free chemistry courses from MIT',
          type: 'website'
        }
      ]
    },
    isActive: true
  },
  {
    name: 'Year 1',
    displayName: 'Year 1 - Basic Dental Sciences',
    order: 1,
    description: 'Introduction to dental sciences including dental anatomy, oral biology, head and neck anatomy, and basic clinical skills.',
    resources: {
      videoSummaries: [
        {
          title: 'Year 1 Dental School Overview',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          description: 'What to expect in your first year of dental school',
          duration: 12
        }
      ],
      pdfNotes: [],
      externalLinks: [
        {
          title: 'Dental Anatomy Resources',
          url: 'https://www.ada.org/resources',
          description: 'American Dental Association educational resources',
          type: 'website'
        }
      ]
    },
    isActive: true
  },
  {
    name: 'Year 2',
    displayName: 'Year 2 - Pre-Clinical Studies',
    order: 2,
    description: 'Pre-clinical training in dental materials, operative techniques, periodontology, oral pathology, and radiology.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 3',
    displayName: 'Year 3 - Clinical Introduction',
    order: 3,
    description: 'Beginning of clinical practice with patient care in operative dentistry, endodontics, prosthodontics, and oral surgery.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 4',
    displayName: 'Year 4 - Advanced Clinical Practice',
    order: 4,
    description: 'Advanced clinical procedures including complex prosthodontics, orthodontics, pediatric dentistry, and oral medicine.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  },
  {
    name: 'Year 5',
    displayName: 'Year 5 - Clinical Mastery',
    order: 5,
    description: 'Final year focusing on comprehensive patient care, advanced procedures, practice management, and clinical rotations.',
    resources: {
      videoSummaries: [],
      pdfNotes: [],
      externalLinks: []
    },
    isActive: true
  }
];

// ============================================
// FOUNDATION YEAR SUBJECTS
// ============================================

const foundationYearSubjects = [
  {
    name: 'Human Anatomy & Physiology',
    description: 'Comprehensive study of human body systems, organs, and physiological processes with emphasis on head and neck region.',
    resources: [
      {
        title: 'Complete Anatomy and Physiology Course - Khan Academy',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=uBGl2BujkPQ'
      },
      {
        title: 'Human Anatomy - Crash Course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=S9WtBRNydso'
      },
      {
        title: 'Introduction to Human Anatomy',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=KZo7JRzfNFg'
      }
    ]
  },
  {
    name: 'Chemistry for Dentistry',
    description: 'Organic and inorganic chemistry fundamentals including biochemistry basics essential for understanding dental materials.',
    resources: [
      {
        title: 'Organic Chemistry Full Course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7JhdBGGbZFg'
      },
      {
        title: 'Biochemistry Basics for Dental Students',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=H8WJ2KENlK0'
      },
      {
        title: 'Chemistry Fundamentals',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=FSyAehMdpyI'
      }
    ]
  },
  {
    name: 'Biology & Cell Biology',
    description: 'Study of cell structure, function, genetics, and molecular biology relevant to dental sciences.',
    resources: [
      {
        title: 'Cell Biology Complete Course',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=URUJD5NEXC8'
      },
      {
        title: 'Introduction to Cell Biology',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8IlzKri08kk'
      },
      {
        title: 'Genetics and DNA',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=zwibgNGe4aY'
      }
    ]
  },
  {
    name: 'Physics for Dentistry',
    description: 'Fundamental physics principles including biomechanics, radiation physics, and material properties.',
    resources: [
      {
        title: 'Physics Fundamentals',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=b1t41Q3xRM8'
      },
      {
        title: 'Radiation Physics Basics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=2Z9gNYA5KqA'
      }
    ]
  },
  {
    name: 'Study Skills & Academic Writing',
    description: 'Essential academic skills including research methods, scientific writing, and effective study techniques.',
    resources: [
      {
        title: 'How to Study Effectively',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ukLnPbIffxE'
      },
      {
        title: 'Scientific Writing Basics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Pbb0H114PYM'
      },
      {
        title: 'Research Methods Introduction',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=zYLTXJGJdBQ'
      }
    ]
  }
];

// ============================================
// YEAR 1 SUBJECTS - Basic Dental Sciences
// ============================================

const year1Subjects = [
  {
    name: 'Dental Anatomy & Morphology',
    description: 'Comprehensive study of tooth structure, development, morphology, dental nomenclature, and tooth identification systems.',
    resources: [
      {
        title: 'Dental Anatomy Terminology - Mental Dental (INBDE)',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=84tY_Y3rm0o'
      },
      {
        title: 'Tooth Anatomy and Morphology Complete Guide',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VRyV4jOo4jI'
      },
      {
        title: 'Dental Anatomy - Permanent Teeth',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qXfKmGQFkww'
      },
      {
        title: 'Tooth Numbering Systems Explained',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=vKhZ8M0mPkE'
      }
    ]
  },
  {
    name: 'Head & Neck Anatomy',
    description: 'Detailed study of skull osteology, muscles of mastication, neurovascular supply, salivary glands, and lymphatic drainage.',
    resources: [
      {
        title: 'Head and Neck Anatomy Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=WkNvD3BY5Gg'
      },
      {
        title: 'Muscles of Mastication',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kZLHdvn0YHI'
      },
      {
        title: 'Skull Anatomy for Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7xKNpGSYLPQ'
      },
      {
        title: 'Trigeminal Nerve Anatomy',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Oo5l7JJZMhE'
      }
    ]
  },
  {
    name: 'Oral Biology',
    description: 'Study of oral tissues, tooth structure (enamel, dentin, pulp), periodontium, and oral environment.',
    resources: [
      {
        title: 'Oral Biology Introduction',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        title: 'Tooth Structure and Tissues',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        title: 'Enamel, Dentin, and Pulp',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      }
    ]
  },
  {
    name: 'Oral Histology & Embryology',
    description: 'Study of tissue development, tooth formation, craniofacial development, and microscopic structure of oral tissues.',
    resources: [
      {
        title: 'Oral Histology Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      },
      {
        title: 'Tooth Development and Formation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      },
      {
        title: 'Embryology of the Face',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      }
    ]
  },
  {
    name: 'Introduction to Clinical Dentistry',
    description: 'Basic clinical skills including dental instruments, infection control, patient communication, and clinical procedures.',
    resources: [
      {
        title: 'Dental Instruments Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        title: 'Infection Control in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      },
      {
        title: 'Patient Communication Skills',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      }
    ]
  }
];

// ============================================
// YEAR 2 SUBJECTS - Pre-Clinical Studies
// ============================================

const year2Subjects = [
  {
    name: 'Dental Materials Science',
    description: 'Study of restorative materials, impression materials, cements, adhesives, and their properties and applications.',
    resources: [
      {
        title: 'Dental Materials Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      },
      {
        title: 'Restorative Materials in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        title: 'Dental Cements and Adhesives',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      },
      {
        title: 'Impression Materials',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      }
    ]
  },
  {
    name: 'Operative Dentistry (Pre-clinical)',
    description: 'Cavity preparation principles, restoration techniques, and phantom head exercises for restorative procedures.',
    resources: [
      {
        title: 'Class I Cavity Preparation Tutorial',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        title: 'Class II Cavity Preparation Step by Step',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        title: 'Composite Restoration Technique',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        title: 'GV Black Classification of Cavities',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      }
    ]
  },
  {
    name: 'Periodontology',
    description: 'Study of periodontal diseases, gingival anatomy, plaque and calculus formation, and periodontal therapy.',
    resources: [
      {
        title: 'Introduction to Periodontology',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      },
      {
        title: 'Periodontal Disease Classification',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      },
      {
        title: 'Scaling and Root Planing',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      },
      {
        title: 'Gingival Anatomy and Histology',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      }
    ]
  },
  {
    name: 'Oral Pathology',
    description: 'Study of dental caries, pulpal diseases, oral lesions, and pathological conditions affecting oral tissues.',
    resources: [
      {
        title: 'Oral Pathology Introduction',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      },
      {
        title: 'Dental Caries Pathogenesis',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        title: 'Oral Lesions and Diseases',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      }
    ]
  },
  {
    name: 'Oral Microbiology & Immunology',
    description: 'Study of oral microbiome, infection and immunity, sterilization, and microbial aspects of oral diseases.',
    resources: [
      {
        title: 'Oral Microbiology Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        title: 'Oral Biofilm and Plaque Formation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      },
      {
        title: 'Immunology in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      }
    ]
  },
  {
    name: 'Dental Radiology',
    description: 'X-ray physics, radiographic techniques, image interpretation, and radiation safety in dentistry.',
    resources: [
      {
        title: 'Dental Radiology Basics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        title: 'Radiographic Interpretation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        title: 'Radiation Safety in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        title: 'Panoramic Radiography',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      }
    ]
  }
];

// ============================================
// YEAR 3 SUBJECTS - Clinical Introduction
// ============================================

const year3Subjects = [
  {
    name: 'Operative Dentistry (Clinical)',
    description: 'Clinical application of restorative procedures including direct restorations, composite fillings, and amalgam restorations.',
    resources: [
      {
        title: 'Clinical Composite Restoration',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      },
      {
        title: 'Posterior Composite Technique',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      },
      {
        title: 'Direct Restoration Clinical Tips',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      }
    ]
  },
  {
    name: 'Endodontics',
    description: 'Root canal anatomy, pulp therapy, and root canal treatment procedures for saving infected teeth.',
    resources: [
      {
        title: 'Root Canal Treatment Step by Step',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=AATnG9BdIMg'
      },
      {
        title: 'Endodontic Access Cavity Preparation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        title: 'Root Canal Anatomy',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      },
      {
        title: 'Pulp Therapy Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      }
    ]
  },
  {
    name: 'Prosthodontics I',
    description: 'Complete and partial denture fabrication, impressions, and removable prosthodontic procedures.',
    resources: [
      {
        title: 'Complete Denture Fabrication',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      },
      {
        title: 'Partial Denture Design',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        title: 'Impression Techniques for Dentures',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      }
    ]
  },
  {
    name: 'Oral Surgery I',
    description: 'Simple extractions, local anesthesia techniques, and minor oral surgical procedures.',
    resources: [
      {
        title: 'Dental Extraction Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        title: 'Local Anesthesia in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        title: 'Simple Tooth Extraction Step by Step',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        title: 'Surgical Instruments in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      }
    ]
  },
  {
    name: 'Periodontology (Clinical)',
    description: 'Clinical periodontal therapy including scaling, root planing, and periodontal maintenance procedures.',
    resources: [
      {
        title: 'Clinical Scaling and Root Planing',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        title: 'Periodontal Therapy Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      },
      {
        title: 'Periodontal Maintenance',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      }
    ]
  },
  {
    name: 'Dental Public Health',
    description: 'Epidemiology, prevention strategies, community dentistry, and public health approaches to oral health.',
    resources: [
      {
        title: 'Dental Public Health Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      },
      {
        title: 'Community Dentistry Programs',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        title: 'Preventive Dentistry Strategies',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      }
    ]
  }
];

// ============================================
// YEAR 4 SUBJECTS - Advanced Clinical Practice
// ============================================

const year4Subjects = [
  {
    name: 'Prosthodontics II',
    description: 'Fixed prosthodontics including crown and bridge work, implant basics, and advanced prosthetic procedures.',
    resources: [
      {
        title: 'Crown Preparation Technique',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        title: 'Fixed Partial Denture (Bridge) Procedure',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      },
      {
        title: 'Dental Implant Basics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        title: 'All-Ceramic Crowns',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      }
    ]
  },
  {
    name: 'Orthodontics',
    description: 'Diagnosis and treatment of malocclusion, orthodontic appliances, and treatment planning.',
    resources: [
      {
        title: 'Introduction to Orthodontics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        title: 'Malocclusion Classification',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        title: 'Orthodontic Treatment Planning',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        title: 'Fixed Orthodontic Appliances',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      }
    ]
  },
  {
    name: 'Pediatric Dentistry (Pedodontics)',
    description: 'Child behavior management, pediatric dental procedures, and preventive care for children.',
    resources: [
      {
        title: 'Pediatric Dentistry Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        title: 'Primary Tooth Anatomy - Mental Dental',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=PsubtLiLToU'
      },
      {
        title: 'Behavior Management in Pediatric Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      },
      {
        title: 'Pulp Therapy in Primary Teeth',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      }
    ]
  },
  {
    name: 'Oral Medicine',
    description: 'Oral manifestations of systemic diseases, oral mucosal diseases, and diagnostic procedures.',
    resources: [
      {
        title: 'Oral Medicine Introduction',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      },
      {
        title: 'Oral Mucosal Diseases',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      },
      {
        title: 'Systemic Disease and Oral Health',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      }
    ]
  },
  {
    name: 'Oral Surgery II',
    description: 'Complex extractions, impacted teeth removal, and advanced surgical procedures.',
    resources: [
      {
        title: 'Impacted Wisdom Tooth Extraction',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        title: 'Surgical Tooth Extraction Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      },
      {
        title: 'Management of Impacted Teeth',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      },
      {
        title: 'Oral Surgery Complications',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      }
    ]
  },
  {
    name: 'Special Care Dentistry',
    description: 'Dental care for medically compromised patients, geriatric dentistry, and disability care.',
    resources: [
      {
        title: 'Special Care Dentistry Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        title: 'Geriatric Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      },
      {
        title: 'Treating Medically Compromised Patients',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      }
    ]
  }
];

// ============================================
// YEAR 5 SUBJECTS - Clinical Mastery
// ============================================

const year5Subjects = [
  {
    name: 'Comprehensive Patient Care',
    description: 'Full mouth rehabilitation, comprehensive treatment planning, and multidisciplinary case management.',
    resources: [
      {
        title: 'Comprehensive Treatment Planning',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        title: 'Full Mouth Rehabilitation',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        title: 'Case Presentation Skills',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      }
    ]
  },
  {
    name: 'Advanced Procedures',
    description: 'Complex restorations, advanced surgical procedures, and multidisciplinary treatment approaches.',
    resources: [
      {
        title: 'Advanced Restorative Techniques',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=5vXqKPJzqkI'
      },
      {
        title: 'Complex Surgical Procedures',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=qCrbJhHPPpE'
      },
      {
        title: 'Multidisciplinary Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=VqKq8gP8eNs'
      }
    ]
  },
  {
    name: 'Practice Management',
    description: 'Dental practice administration, ethics and law, business aspects, and professional development.',
    resources: [
      {
        title: 'Dental Practice Management',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=8ZGbJIqVNnM'
      },
      {
        title: 'Ethics in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=gX8SWfjPGX4'
      },
      {
        title: 'Starting Your Dental Practice',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Kq8FNHZqBnI'
      },
      {
        title: 'Dental Law and Regulations',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=7vN_PEmeKb0'
      }
    ]
  },
  {
    name: 'Clinical Rotations',
    description: 'Hospital dentistry, community clinics, specialty rotations, and diverse clinical experiences.',
    resources: [
      {
        title: 'Hospital Dentistry Overview',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xQzN8XQXQXQ'
      },
      {
        title: 'Community Dental Clinics',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=9kGGperGHjA'
      },
      {
        title: 'Specialty Dentistry Rotations',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=ft5Rd4jbFlY'
      }
    ]
  },
  {
    name: 'Research Project & Evidence-Based Dentistry',
    description: 'Dissertation, research methodology, evidence-based practice, and critical appraisal skills.',
    resources: [
      {
        title: 'Evidence-Based Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=kgeiLzL7NhE'
      },
      {
        title: 'Research Methods in Dentistry',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Hhy7JUinOy0'
      },
      {
        title: 'Critical Appraisal of Dental Literature',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=xN8Pq8qJLqo'
      },
      {
        title: 'Writing a Dental Research Paper',
        type: 'video',
        url: 'https://www.youtube.com/watch?v=Zr8p8akuPpA'
      }
    ]
  }
];

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seedYearsAndSubjects() {
  try {
    console.log('🌱 Starting to seed Years and Subjects...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing Years and Subjects...');
    await Year.deleteMany({});
    await Subject.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create Years
    console.log('📚 Creating Years...');
    const createdYears = await Year.insertMany(yearsData);
    console.log(`✅ Created ${createdYears.length} years\n`);

    // Map year names to IDs
    const yearMap = {};
    createdYears.forEach(year => {
      yearMap[year.name] = year._id;
    });

    // Prepare all subjects with yearId
    const allSubjects = [
      ...foundationYearSubjects.map(s => ({ ...s, yearId: yearMap['Foundation Year'] })),
      ...year1Subjects.map(s => ({ ...s, yearId: yearMap['Year 1'] })),
      ...year2Subjects.map(s => ({ ...s, yearId: yearMap['Year 2'] })),
      ...year3Subjects.map(s => ({ ...s, yearId: yearMap['Year 3'] })),
      ...year4Subjects.map(s => ({ ...s, yearId: yearMap['Year 4'] })),
      ...year5Subjects.map(s => ({ ...s, yearId: yearMap['Year 5'] }))
    ];

    // Create Subjects
    console.log('📖 Creating Subjects...');
    const createdSubjects = await Subject.insertMany(allSubjects);
    console.log(`✅ Created ${createdSubjects.length} subjects\n`);

    // Display summary
    console.log('📊 SUMMARY:');
    console.log('═══════════════════════════════════════');
    for (const year of createdYears) {
      const subjectCount = createdSubjects.filter(s => s.yearId.toString() === year._id.toString()).length;
      console.log(`${year.displayName}: ${subjectCount} subjects`);
    }
    console.log('═══════════════════════════════════════');
    console.log(`\n✨ Total: ${createdYears.length} years, ${createdSubjects.length} subjects`);
    console.log('\n🎉 Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedYearsAndSubjects();


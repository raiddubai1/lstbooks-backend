import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import Subject from '../models/Subject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// QUIZZES DATA
// ============================================

const quizzesData = [
  // ============================================
  // DENTAL ANATOMY & MORPHOLOGY QUIZZES
  // ============================================
  {
    title: 'Tooth Numbering Systems',
    subjectName: 'Dental Anatomy & Morphology',
    timeLimit: 600, // 10 minutes
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'In the Universal Numbering System, which number represents the maxillary right central incisor?',
        type: 'MCQ',
        options: ['6', '7', '8', '9'],
        answer: '8',
        points: 1
      },
      {
        questionText: 'In the FDI notation system, what is the designation for the mandibular left first molar?',
        type: 'MCQ',
        options: ['36', '46', '26', '16'],
        answer: '36',
        points: 1
      },
      {
        questionText: 'In the Palmer notation system, which quadrant number represents the maxillary left?',
        type: 'MCQ',
        options: ['1', '2', '3', '4'],
        answer: '2',
        points: 1
      },
      {
        questionText: 'In the Universal system, tooth #19 is which tooth?',
        type: 'MCQ',
        options: ['Mandibular left first molar', 'Mandibular right first molar', 'Maxillary left first molar', 'Maxillary right first molar'],
        answer: 'Mandibular left first molar',
        points: 1
      },
      {
        questionText: 'What is the FDI notation for the maxillary right second premolar?',
        type: 'MCQ',
        options: ['14', '15', '24', '25'],
        answer: '15',
        points: 1
      }
    ]
  },
  {
    title: 'Tooth Anatomy and Morphology',
    subjectName: 'Dental Anatomy & Morphology',
    timeLimit: 900, // 15 minutes
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'Which tooth typically has the longest root in the human dentition?',
        type: 'MCQ',
        options: ['Maxillary central incisor', 'Maxillary canine', 'Mandibular canine', 'Maxillary first molar'],
        answer: 'Maxillary canine',
        points: 1
      },
      {
        questionText: 'How many cusps does a maxillary first premolar typically have?',
        type: 'MCQ',
        options: ['1', '2', '3', '4'],
        answer: '2',
        points: 1
      },
      {
        questionText: 'Which cusp is the largest on a maxillary first molar?',
        type: 'MCQ',
        options: ['Mesiobuccal', 'Distobuccal', 'Mesiolingual', 'Distolingual'],
        answer: 'Mesiolingual',
        points: 1
      },
      {
        questionText: 'The cusp of Carabelli is most commonly found on which tooth?',
        type: 'MCQ',
        options: ['Maxillary first molar', 'Maxillary second molar', 'Mandibular first molar', 'Mandibular second molar'],
        answer: 'Maxillary first molar',
        points: 1
      },
      {
        questionText: 'How many roots does a mandibular first molar typically have?',
        type: 'MCQ',
        options: ['1', '2', '3', '4'],
        answer: '2',
        points: 1
      },
      {
        questionText: 'Which permanent tooth is the first to erupt?',
        type: 'MCQ',
        options: ['Mandibular central incisor', 'Maxillary central incisor', 'Mandibular first molar', 'Maxillary first molar'],
        answer: 'Mandibular first molar',
        points: 1
      },
      {
        questionText: 'The cingulum is found on which surface of anterior teeth?',
        type: 'MCQ',
        options: ['Labial', 'Lingual', 'Mesial', 'Distal'],
        answer: 'Lingual',
        points: 1
      },
      {
        questionText: 'Which tooth has a bifurcated root?',
        type: 'MCQ',
        options: ['Maxillary central incisor', 'Maxillary canine', 'Maxillary first premolar', 'Mandibular canine'],
        answer: 'Maxillary first premolar',
        points: 1
      }
    ]
  },

  // ============================================
  // ORAL HISTOLOGY QUIZZES
  // ============================================
  {
    title: 'Enamel Structure and Formation',
    subjectName: 'Oral Histology',
    timeLimit: 600,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What percentage of enamel is composed of inorganic material?',
        type: 'MCQ',
        options: ['70%', '85%', '96%', '99%'],
        answer: '96%',
        points: 1
      },
      {
        questionText: 'Which cells are responsible for enamel formation?',
        type: 'MCQ',
        options: ['Odontoblasts', 'Ameloblasts', 'Cementoblasts', 'Osteoblasts'],
        answer: 'Ameloblasts',
        points: 1
      },
      {
        questionText: 'What is the basic structural unit of enamel?',
        type: 'MCQ',
        options: ['Enamel lamellae', 'Enamel tufts', 'Enamel rod (prism)', 'Enamel spindle'],
        answer: 'Enamel rod (prism)',
        points: 1
      },
      {
        questionText: 'Which incremental line in enamel represents the birth process?',
        type: 'MCQ',
        options: ['Striae of Retzius', 'Neonatal line', 'Perikymata', 'Enamel lamellae'],
        answer: 'Neonatal line',
        points: 1
      },
      {
        questionText: 'Can enamel regenerate after it is damaged?',
        type: 'MCQ',
        options: ['Yes, throughout life', 'Yes, but only in children', 'No, it cannot regenerate', 'Only with fluoride treatment'],
        answer: 'No, it cannot regenerate',
        points: 1
      }
    ]
  },
  {
    title: 'Dentin and Pulp Histology',
    subjectName: 'Oral Histology',
    timeLimit: 600,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'Which cells produce dentin?',
        type: 'MCQ',
        options: ['Ameloblasts', 'Odontoblasts', 'Cementoblasts', 'Fibroblasts'],
        answer: 'Odontoblasts',
        points: 1
      },
      {
        questionText: 'What percentage of dentin is inorganic material?',
        type: 'MCQ',
        options: ['45%', '55%', '70%', '96%'],
        answer: '70%',
        points: 1
      },
      {
        questionText: 'What are the tubular structures in dentin called?',
        type: 'MCQ',
        options: ['Enamel rods', 'Dentinal tubules', 'Haversian canals', 'Canaliculi'],
        answer: 'Dentinal tubules',
        points: 1
      },
      {
        questionText: 'Which type of dentin forms throughout life in response to normal stimuli?',
        type: 'MCQ',
        options: ['Primary dentin', 'Secondary dentin', 'Tertiary dentin', 'Sclerotic dentin'],
        answer: 'Secondary dentin',
        points: 1
      },
      {
        questionText: 'What is the main cell type found in dental pulp?',
        type: 'MCQ',
        options: ['Odontoblasts', 'Fibroblasts', 'Macrophages', 'Lymphocytes'],
        answer: 'Fibroblasts',
        points: 1
      }
    ]
  },

  // ============================================
  // PERIODONTOLOGY QUIZZES
  // ============================================
  {
    title: 'Periodontal Anatomy and Disease',
    subjectName: 'Periodontology',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the normal depth of a healthy gingival sulcus?',
        type: 'MCQ',
        options: ['0-1 mm', '1-3 mm', '3-5 mm', '5-7 mm'],
        answer: '1-3 mm',
        points: 1
      },
      {
        questionText: 'Which bacteria is most strongly associated with chronic periodontitis?',
        type: 'MCQ',
        options: ['Streptococcus mutans', 'Porphyromonas gingivalis', 'Lactobacillus', 'Actinomyces'],
        answer: 'Porphyromonas gingivalis',
        points: 1
      },
      {
        questionText: 'What is the primary difference between gingivitis and periodontitis?',
        type: 'MCQ',
        options: ['Bleeding on probing', 'Bone loss', 'Plaque accumulation', 'Gingival inflammation'],
        answer: 'Bone loss',
        points: 1
      },
      {
        questionText: 'At what probing depth is a periodontal pocket generally considered to exist?',
        type: 'MCQ',
        options: ['2 mm', '3 mm', '4 mm or greater', '6 mm or greater'],
        answer: '4 mm or greater',
        points: 1
      },
      {
        questionText: 'Which fiber group of the periodontal ligament resists rotational forces?',
        type: 'MCQ',
        options: ['Alveolar crest fibers', 'Horizontal fibers', 'Oblique fibers', 'Apical fibers'],
        answer: 'Horizontal fibers',
        points: 1
      },
      {
        questionText: 'What is the width of the periodontal ligament space?',
        type: 'MCQ',
        options: ['0.05-0.1 mm', '0.15-0.38 mm', '0.5-1.0 mm', '1.0-2.0 mm'],
        answer: '0.15-0.38 mm',
        points: 1
      }
    ]
  },

  // ============================================
  // OPERATIVE DENTISTRY QUIZZES
  // ============================================
  {
    title: 'Dental Caries and Cavity Preparation',
    subjectName: 'Operative Dentistry (Pre-clinical)',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'According to GV Black classification, a cavity on the occlusal surface of a molar is classified as:',
        type: 'MCQ',
        options: ['Class I', 'Class II', 'Class III', 'Class IV'],
        answer: 'Class I',
        points: 1
      },
      {
        questionText: 'A Class II cavity involves which surfaces?',
        type: 'MCQ',
        options: ['Occlusal only', 'Proximal surfaces of posterior teeth', 'Proximal surfaces of anterior teeth', 'Incisal edges'],
        answer: 'Proximal surfaces of posterior teeth',
        points: 1
      },
      {
        questionText: 'What is the critical pH at which enamel begins to demineralize?',
        type: 'MCQ',
        options: ['7.0', '6.5', '5.5', '4.5'],
        answer: '5.5',
        points: 1
      },
      {
        questionText: 'Which bacteria is primarily responsible for dental caries?',
        type: 'MCQ',
        options: ['Streptococcus mutans', 'Porphyromonas gingivalis', 'Lactobacillus acidophilus', 'Actinomyces'],
        answer: 'Streptococcus mutans',
        points: 1
      },
      {
        questionText: 'What is the recommended cavity wall angle for amalgam restorations?',
        type: 'MCQ',
        options: ['45 degrees', '90 degrees', '120 degrees', '180 degrees'],
        answer: '90 degrees',
        points: 1
      },
      {
        questionText: 'Which material is used as a cavity liner to protect the pulp?',
        type: 'MCQ',
        options: ['Zinc phosphate cement', 'Calcium hydroxide', 'Glass ionomer', 'Composite resin'],
        answer: 'Calcium hydroxide',
        points: 1
      }
    ]
  },

  // ============================================
  // ENDODONTICS QUIZZES
  // ============================================
  {
    title: 'Root Canal Anatomy and Treatment',
    subjectName: 'Endodontics',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'How many canals does a maxillary first molar typically have?',
        type: 'MCQ',
        options: ['2', '3', '4', '5'],
        answer: '4',
        points: 1
      },
      {
        questionText: 'Which canal in a maxillary first molar is most difficult to locate?',
        type: 'MCQ',
        options: ['Mesiobuccal 1 (MB1)', 'Mesiobuccal 2 (MB2)', 'Distobuccal (DB)', 'Palatal'],
        answer: 'Mesiobuccal 2 (MB2)',
        points: 1
      },
      {
        questionText: 'What is the working length in endodontics measured from?',
        type: 'MCQ',
        options: ['Cusp tip to apex', 'Reference point to radiographic apex', 'Reference point to 1mm short of apex', 'CEJ to apex'],
        answer: 'Reference point to 1mm short of apex',
        points: 1
      },
      {
        questionText: 'Which irrigant is most commonly used in root canal treatment?',
        type: 'MCQ',
        options: ['Hydrogen peroxide', 'Chlorhexidine', 'Sodium hypochlorite', 'Saline'],
        answer: 'Sodium hypochlorite',
        points: 1
      },
      {
        questionText: 'What is the most common cause of endodontic failure?',
        type: 'MCQ',
        options: ['Missed canals', 'Inadequate obturation', 'Vertical root fracture', 'Persistent infection'],
        answer: 'Inadequate obturation',
        points: 1
      }
    ]
  },

  // ============================================
  // ORAL PATHOLOGY QUIZZES
  // ============================================
  {
    title: 'Oral Lesions and Pathology',
    subjectName: 'Oral Pathology',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'Which is the most common malignant oral tumor?',
        type: 'MCQ',
        options: ['Melanoma', 'Squamous cell carcinoma', 'Adenocarcinoma', 'Lymphoma'],
        answer: 'Squamous cell carcinoma',
        points: 1
      },
      {
        questionText: 'Leukoplakia is defined as:',
        type: 'MCQ',
        options: ['A white patch that can be scraped off', 'A white patch that cannot be scraped off or diagnosed as another condition', 'A red patch on mucosa', 'A pigmented lesion'],
        answer: 'A white patch that cannot be scraped off or diagnosed as another condition',
        points: 1
      },
      {
        questionText: 'Which virus is associated with oral hairy leukoplakia?',
        type: 'MCQ',
        options: ['HSV-1', 'HPV', 'EBV (Epstein-Barr virus)', 'CMV'],
        answer: 'EBV (Epstein-Barr virus)',
        points: 1
      },
      {
        questionText: 'Aphthous ulcers (canker sores) are:',
        type: 'MCQ',
        options: ['Viral in origin', 'Bacterial in origin', 'Fungal in origin', 'Of unknown etiology'],
        answer: 'Of unknown etiology',
        points: 1
      },
      {
        questionText: 'Which condition presents as white patches that can be wiped off, revealing red mucosa?',
        type: 'MCQ',
        options: ['Leukoplakia', 'Lichen planus', 'Candidiasis', 'Erythroplakia'],
        answer: 'Candidiasis',
        points: 1
      }
    ]
  },

  // ============================================
  // ORAL RADIOLOGY QUIZZES
  // ============================================
  {
    title: 'Dental Radiography Principles',
    subjectName: 'Dental Radiology',
    timeLimit: 600,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the ideal vertical angulation for maxillary periapical radiographs using bisecting angle technique?',
        type: 'MCQ',
        options: ['+10 to +15 degrees', '+20 to +30 degrees', '+40 to +50 degrees', '+60 to +70 degrees'],
        answer: '+40 to +50 degrees',
        points: 1
      },
      {
        questionText: 'Which radiographic technique produces the least distortion?',
        type: 'MCQ',
        options: ['Bisecting angle', 'Paralleling', 'Occlusal', 'Panoramic'],
        answer: 'Paralleling',
        points: 1
      },
      {
        questionText: 'A radiolucent area at the apex of a tooth most likely indicates:',
        type: 'MCQ',
        options: ['Condensing osteitis', 'Periapical abscess or granuloma', 'Hypercementosis', 'Normal anatomy'],
        answer: 'Periapical abscess or granuloma',
        points: 1
      },
      {
        questionText: 'What does ALARA stand for in radiation safety?',
        type: 'MCQ',
        options: ['Always Lower All Radiation Amounts', 'As Low As Reasonably Achievable', 'Avoid Long And Repeated Exposures', 'All Limits Are Radiation Approved'],
        answer: 'As Low As Reasonably Achievable',
        points: 1
      },
      {
        questionText: 'Which structure appears as a radiopaque line in the maxillary anterior region?',
        type: 'MCQ',
        options: ['Mental foramen', 'Incisive foramen', 'Nasal septum', 'Mandibular canal'],
        answer: 'Nasal septum',
        points: 1
      }
    ]
  },

  // ============================================
  // PHARMACOLOGY QUIZZES
  // ============================================
  {
    title: 'Local Anesthetics in Dentistry',
    subjectName: 'Oral Pharmacology',
    timeLimit: 600,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'Which is the most commonly used local anesthetic in dentistry?',
        type: 'MCQ',
        options: ['Procaine', 'Lidocaine', 'Mepivacaine', 'Bupivacaine'],
        answer: 'Lidocaine',
        points: 1
      },
      {
        questionText: 'What is the maximum recommended dose of lidocaine with epinephrine for a healthy adult?',
        type: 'MCQ',
        options: ['2 mg/kg', '4.4 mg/kg', '7 mg/kg', '10 mg/kg'],
        answer: '7 mg/kg',
        points: 1
      },
      {
        questionText: 'Which vasoconstrictor is most commonly added to local anesthetics?',
        type: 'MCQ',
        options: ['Norepinephrine', 'Epinephrine', 'Phenylephrine', 'Levonordefrin'],
        answer: 'Epinephrine',
        points: 1
      },
      {
        questionText: 'What is the primary purpose of adding a vasoconstrictor to local anesthetic?',
        type: 'MCQ',
        options: ['Increase pH', 'Prolong duration of action', 'Reduce toxicity', 'Improve taste'],
        answer: 'Prolong duration of action',
        points: 1
      },
      {
        questionText: 'Which local anesthetic has the longest duration of action?',
        type: 'MCQ',
        options: ['Lidocaine', 'Mepivacaine', 'Articaine', 'Bupivacaine'],
        answer: 'Bupivacaine',
        points: 1
      }
    ]
  }
];

// ============================================
// FLASHCARDS DATA
// ============================================

const flashcardsData = [
  // ============================================
  // DENTAL ANATOMY FLASHCARDS
  // ============================================
  { subjectName: 'Dental Anatomy & Morphology', question: 'How many teeth are in the primary dentition?', answer: '20 teeth (10 maxillary, 10 mandibular)' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'How many teeth are in the permanent dentition?', answer: '32 teeth (16 maxillary, 16 mandibular)' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the crown of a tooth?', answer: 'The portion of the tooth covered by enamel, visible above the gingiva' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the root of a tooth?', answer: 'The portion of the tooth covered by cementum, embedded in the alveolar bone' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the CEJ?', answer: 'Cementoenamel Junction - the line where enamel meets cementum at the neck of the tooth' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What are the four types of teeth?', answer: 'Incisors, Canines, Premolars, and Molars' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the function of incisors?', answer: 'Cutting and shearing food' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the function of canines?', answer: 'Tearing and grasping food' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the function of premolars?', answer: 'Crushing and grinding food' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the function of molars?', answer: 'Grinding and crushing food' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'Which tooth has the longest root?', answer: 'Maxillary canine' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is a cusp?', answer: 'An elevation or mound on the crown portion of a tooth' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is a fossa?', answer: 'A rounded or angular depression on the surface of a tooth' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is a ridge?', answer: 'A linear elevation on the surface of a tooth' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the cingulum?', answer: 'A convex prominence on the lingual surface of anterior teeth' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What are mamelons?', answer: 'Three rounded protuberances on the incisal edge of newly erupted incisors' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is the cusp of Carabelli?', answer: 'A fifth cusp found on the mesiolingual cusp of maxillary first molars' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'How many roots does a maxillary first molar have?', answer: '3 roots (mesiobuccal, distobuccal, and palatal)' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'How many roots does a mandibular first molar have?', answer: '2 roots (mesial and distal)' },
  { subjectName: 'Dental Anatomy & Morphology', question: 'What is a bifurcation?', answer: 'The area where the root divides into two separate roots' },

  // ============================================
  // ORAL HISTOLOGY FLASHCARDS
  // ============================================
  { subjectName: 'Oral Histology', question: 'What are the four main tissues of the tooth?', answer: 'Enamel, Dentin, Cementum, and Pulp' },
  { subjectName: 'Oral Histology', question: 'What is enamel?', answer: 'The hardest substance in the human body, covering the crown of the tooth' },
  { subjectName: 'Oral Histology', question: 'What percentage of enamel is inorganic?', answer: '96% (mainly hydroxyapatite crystals)' },
  { subjectName: 'Oral Histology', question: 'Can enamel regenerate?', answer: 'No, enamel cannot regenerate once lost' },
  { subjectName: 'Oral Histology', question: 'What cells produce enamel?', answer: 'Ameloblasts' },
  { subjectName: 'Oral Histology', question: 'What is dentin?', answer: 'The hard tissue forming the bulk of the tooth, beneath the enamel and cementum' },
  { subjectName: 'Oral Histology', question: 'What percentage of dentin is inorganic?', answer: '70% inorganic, 20% organic, 10% water' },
  { subjectName: 'Oral Histology', question: 'What cells produce dentin?', answer: 'Odontoblasts' },
  { subjectName: 'Oral Histology', question: 'What are dentinal tubules?', answer: 'Microscopic canals in dentin that contain odontoblastic processes' },
  { subjectName: 'Oral Histology', question: 'What is the pulp?', answer: 'The soft connective tissue in the center of the tooth containing nerves and blood vessels' },
  { subjectName: 'Oral Histology', question: 'What is cementum?', answer: 'The hard tissue covering the root surface of the tooth' },
  { subjectName: 'Oral Histology', question: 'What cells produce cementum?', answer: 'Cementoblasts' },
  { subjectName: 'Oral Histology', question: 'What is the periodontal ligament?', answer: 'Connective tissue fibers that attach the tooth to the alveolar bone' },
  { subjectName: 'Oral Histology', question: 'What is the alveolar bone?', answer: 'The bone that surrounds and supports the teeth' },
  { subjectName: 'Oral Histology', question: 'What is the lamina dura?', answer: 'The radiographic appearance of the alveolar bone proper (appears as white line on x-ray)' },
  { subjectName: 'Oral Histology', question: 'What are Sharpey\'s fibers?', answer: 'Periodontal ligament fibers embedded in cementum and alveolar bone' },
  { subjectName: 'Oral Histology', question: 'What is primary dentin?', answer: 'Dentin formed during tooth development before eruption' },
  { subjectName: 'Oral Histology', question: 'What is secondary dentin?', answer: 'Dentin formed throughout life after tooth eruption' },
  { subjectName: 'Oral Histology', question: 'What is tertiary dentin?', answer: 'Dentin formed in response to injury or irritation (also called reparative dentin)' },
  { subjectName: 'Oral Histology', question: 'What is the neonatal line?', answer: 'An incremental line in enamel and dentin marking the birth process' },

  // ============================================
  // PERIODONTOLOGY FLASHCARDS
  // ============================================
  { subjectName: 'Periodontology', question: 'What is the periodontium?', answer: 'The supporting structures of the tooth: gingiva, periodontal ligament, cementum, and alveolar bone' },
  { subjectName: 'Periodontology', question: 'What is the gingiva?', answer: 'The soft tissue surrounding the teeth and covering the alveolar bone' },
  { subjectName: 'Periodontology', question: 'What is the gingival sulcus?', answer: 'The shallow space between the tooth and the free gingiva' },
  { subjectName: 'Periodontology', question: 'What is the normal depth of a healthy sulcus?', answer: '1-3 mm' },
  { subjectName: 'Periodontology', question: 'What is a periodontal pocket?', answer: 'A pathologically deepened gingival sulcus (≥4mm) with loss of attachment' },
  { subjectName: 'Periodontology', question: 'What is gingivitis?', answer: 'Inflammation of the gingiva without loss of attachment or bone' },
  { subjectName: 'Periodontology', question: 'What is periodontitis?', answer: 'Inflammation of the periodontium with loss of attachment and bone' },
  { subjectName: 'Periodontology', question: 'What is the primary cause of periodontal disease?', answer: 'Bacterial plaque (biofilm)' },
  { subjectName: 'Periodontology', question: 'What bacteria is most associated with periodontitis?', answer: 'Porphyromonas gingivalis' },
  { subjectName: 'Periodontology', question: 'What is dental calculus?', answer: 'Mineralized bacterial plaque (tartar)' },
  { subjectName: 'Periodontology', question: 'What is probing depth?', answer: 'The distance from the gingival margin to the base of the sulcus/pocket' },
  { subjectName: 'Periodontology', question: 'What is clinical attachment level?', answer: 'The distance from the CEJ to the base of the sulcus/pocket' },
  { subjectName: 'Periodontology', question: 'What is bleeding on probing (BOP)?', answer: 'Bleeding that occurs when probing the sulcus, indicating inflammation' },
  { subjectName: 'Periodontology', question: 'What is tooth mobility?', answer: 'Abnormal movement of a tooth, classified as Miller Class I, II, or III' },
  { subjectName: 'Periodontology', question: 'What is furcation involvement?', answer: 'Bone loss in the area where roots divide in multi-rooted teeth' },
  { subjectName: 'Periodontology', question: 'What is scaling?', answer: 'Removal of plaque and calculus from tooth surfaces' },
  { subjectName: 'Periodontology', question: 'What is root planing?', answer: 'Smoothing of the root surface to remove contaminated cementum' },
  { subjectName: 'Periodontology', question: 'What are the risk factors for periodontal disease?', answer: 'Smoking, diabetes, genetics, stress, poor oral hygiene, medications' },
  { subjectName: 'Periodontology', question: 'What is gingival recession?', answer: 'Apical migration of the gingival margin exposing the root surface' },
  { subjectName: 'Periodontology', question: 'What is the width of attached gingiva?', answer: 'The distance from the mucogingival junction to the gingival margin (normally 1-9mm)' },

  // ============================================
  // OPERATIVE DENTISTRY FLASHCARDS
  // ============================================
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is dental caries?', answer: 'A bacterial disease causing demineralization and destruction of tooth structure' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is the primary bacteria causing caries?', answer: 'Streptococcus mutans' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is the critical pH for enamel demineralization?', answer: 'pH 5.5' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class I cavity?', answer: 'Cavity in pits and fissures of occlusal surfaces of molars and premolars' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class II cavity?', answer: 'Cavity on proximal surfaces of posterior teeth' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class III cavity?', answer: 'Cavity on proximal surfaces of anterior teeth not involving incisal edge' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class IV cavity?', answer: 'Cavity on proximal surfaces of anterior teeth involving incisal edge' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class V cavity?', answer: 'Cavity on cervical third of facial or lingual surfaces' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a Class VI cavity?', answer: 'Cavity on incisal edges of anterior teeth or cusp tips of posterior teeth' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is amalgam?', answer: 'A dental restorative material made of mercury and metal alloy' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is composite resin?', answer: 'A tooth-colored restorative material made of resin matrix and filler particles' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is the purpose of acid etching?', answer: 'To create micro-porosities in enamel for bonding' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What acid is used for etching?', answer: '37% phosphoric acid' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a bonding agent?', answer: 'A resin that bonds composite to tooth structure' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is the purpose of a cavity liner?', answer: 'To protect the pulp from thermal, chemical, or mechanical irritation' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What material is commonly used as a liner?', answer: 'Calcium hydroxide' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is a cavity base?', answer: 'A thick layer placed to protect the pulp and provide thermal insulation' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is glass ionomer cement?', answer: 'A restorative material that releases fluoride and bonds chemically to tooth structure' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is the smear layer?', answer: 'A layer of debris on dentin surface created during cavity preparation' },
  { subjectName: 'Operative Dentistry (Pre-clinical)', question: 'What is microleakage?', answer: 'Passage of bacteria, fluids, and ions between restoration and tooth' },

  // ============================================
  // ENDODONTICS FLASHCARDS
  // ============================================
  { subjectName: 'Endodontics', question: 'What is endodontics?', answer: 'The branch of dentistry dealing with the dental pulp and periapical tissues' },
  { subjectName: 'Endodontics', question: 'What is pulpitis?', answer: 'Inflammation of the dental pulp' },
  { subjectName: 'Endodontics', question: 'What is reversible pulpitis?', answer: 'Mild pulp inflammation that can heal if irritant is removed' },
  { subjectName: 'Endodontics', question: 'What is irreversible pulpitis?', answer: 'Severe pulp inflammation that cannot heal and requires root canal treatment' },
  { subjectName: 'Endodontics', question: 'What is pulp necrosis?', answer: 'Death of the dental pulp' },
  { subjectName: 'Endodontics', question: 'What is a periapical abscess?', answer: 'Accumulation of pus at the apex of a tooth root' },
  { subjectName: 'Endodontics', question: 'What is a periapical granuloma?', answer: 'Chronic inflammatory tissue at the apex of a non-vital tooth' },
  { subjectName: 'Endodontics', question: 'What is a periapical cyst?', answer: 'A fluid-filled sac at the apex of a non-vital tooth' },
  { subjectName: 'Endodontics', question: 'What is root canal treatment?', answer: 'Removal of infected pulp tissue and filling of the root canal system' },
  { subjectName: 'Endodontics', question: 'What is the working length?', answer: 'The distance from a reference point to the apical constriction (usually 1mm short of apex)' },
  { subjectName: 'Endodontics', question: 'What is the apical constriction?', answer: 'The narrowest point of the root canal, ideal termination point for obturation' },
  { subjectName: 'Endodontics', question: 'What is sodium hypochlorite used for?', answer: 'Root canal irrigation to dissolve organic tissue and kill bacteria' },
  { subjectName: 'Endodontics', question: 'What is EDTA?', answer: 'Ethylenediaminetetraacetic acid - used to remove smear layer in root canals' },
  { subjectName: 'Endodontics', question: 'What is gutta-percha?', answer: 'A rubber-like material used to fill root canals' },
  { subjectName: 'Endodontics', question: 'What is obturation?', answer: 'The process of filling and sealing the root canal system' },
  { subjectName: 'Endodontics', question: 'How many canals does a maxillary first molar typically have?', answer: '3-4 canals (MB1, MB2, DB, Palatal)' },
  { subjectName: 'Endodontics', question: 'How many canals does a mandibular first molar typically have?', answer: '3-4 canals (2 mesial, 1-2 distal)' },
  { subjectName: 'Endodontics', question: 'What is an apex locator?', answer: 'An electronic device used to determine working length' },
  { subjectName: 'Endodontics', question: 'What is a pulpotomy?', answer: 'Removal of coronal pulp tissue only, leaving radicular pulp intact' },
  { subjectName: 'Endodontics', question: 'What is a pulpectomy?', answer: 'Complete removal of all pulp tissue from the crown and root' },

  // ============================================
  // ORAL RADIOLOGY FLASHCARDS
  // ============================================
  { subjectName: 'Dental Radiology', question: 'What is a radiograph?', answer: 'An image produced by x-rays passing through an object onto film or sensor' },
  { subjectName: 'Dental Radiology', question: 'What is radiolucent?', answer: 'Appears dark on radiograph (allows x-rays to pass through easily)' },
  { subjectName: 'Dental Radiology', question: 'What is radiopaque?', answer: 'Appears white/light on radiograph (blocks x-rays)' },
  { subjectName: 'Dental Radiology', question: 'What does ALARA stand for?', answer: 'As Low As Reasonably Achievable (radiation safety principle)' },
  { subjectName: 'Dental Radiology', question: 'What is a periapical radiograph?', answer: 'Shows entire tooth from crown to apex and surrounding bone' },
  { subjectName: 'Dental Radiology', question: 'What is a bitewing radiograph?', answer: 'Shows crowns of upper and lower teeth and alveolar crest bone' },
  { subjectName: 'Dental Radiology', question: 'What is a panoramic radiograph?', answer: 'Shows entire maxilla and mandible on one film' },
  { subjectName: 'Dental Radiology', question: 'What is the paralleling technique?', answer: 'Film placed parallel to long axis of tooth with perpendicular x-ray beam' },
  { subjectName: 'Dental Radiology', question: 'What is the bisecting angle technique?', answer: 'X-ray beam directed perpendicular to imaginary line bisecting angle between tooth and film' },
  { subjectName: 'Dental Radiology', question: 'What causes a foreshortened image?', answer: 'Excessive vertical angulation' },
  { subjectName: 'Dental Radiology', question: 'What causes an elongated image?', answer: 'Insufficient vertical angulation' },
  { subjectName: 'Dental Radiology', question: 'What is the lamina dura?', answer: 'Radiopaque line representing alveolar bone proper around tooth root' },
  { subjectName: 'Dental Radiology', question: 'What is the periodontal ligament space?', answer: 'Radiolucent line between tooth root and lamina dura' },
  { subjectName: 'Dental Radiology', question: 'What does a periapical radiolucency indicate?', answer: 'Bone loss at apex, suggesting abscess, granuloma, or cyst' },
  { subjectName: 'Dental Radiology', question: 'What is the mental foramen?', answer: 'Radiolucent circle in mandibular premolar region (normal anatomy)' },
  { subjectName: 'Dental Radiology', question: 'What is the incisive foramen?', answer: 'Radiolucent area between maxillary central incisors (normal anatomy)' },
  { subjectName: 'Dental Radiology', question: 'What is the maxillary sinus?', answer: 'Large radiolucent area above maxillary posterior teeth (normal anatomy)' },
  { subjectName: 'Dental Radiology', question: 'What is the mandibular canal?', answer: 'Radiolucent line in mandible containing inferior alveolar nerve and vessels' },
  { subjectName: 'Dental Radiology', question: 'What is condensing osteitis?', answer: 'Radiopaque area at apex representing increased bone density in response to infection' },
  { subjectName: 'Dental Radiology', question: 'What is a lead apron used for?', answer: 'To protect patient from scatter radiation during x-ray exposure' },

  // ============================================
  // ORAL PHARMACOLOGY FLASHCARDS
  // ============================================
  { subjectName: 'Oral Pharmacology', question: 'What is the most common local anesthetic in dentistry?', answer: 'Lidocaine (Xylocaine)' },
  { subjectName: 'Oral Pharmacology', question: 'What is the maximum dose of lidocaine with epinephrine?', answer: '7 mg/kg (up to 500mg total)' },
  { subjectName: 'Oral Pharmacology', question: 'What is the maximum dose of lidocaine without epinephrine?', answer: '4.4 mg/kg (up to 300mg total)' },
  { subjectName: 'Oral Pharmacology', question: 'Why is epinephrine added to local anesthetics?', answer: 'To cause vasoconstriction, prolonging duration and reducing bleeding' },
  { subjectName: 'Oral Pharmacology', question: 'What is the onset time of lidocaine?', answer: '2-3 minutes' },
  { subjectName: 'Oral Pharmacology', question: 'What is the duration of lidocaine with epinephrine?', answer: '60-90 minutes for pulpal anesthesia' },
  { subjectName: 'Oral Pharmacology', question: 'Which local anesthetic has the longest duration?', answer: 'Bupivacaine (Marcaine) - up to 7 hours' },
  { subjectName: 'Oral Pharmacology', question: 'What is articaine?', answer: 'An amide local anesthetic with high tissue penetration' },
  { subjectName: 'Oral Pharmacology', question: 'What is mepivacaine?', answer: 'An amide local anesthetic that can be used without vasoconstrictor' },
  { subjectName: 'Oral Pharmacology', question: 'What are signs of local anesthetic toxicity?', answer: 'CNS excitation, seizures, cardiovascular depression, loss of consciousness' },
  { subjectName: 'Oral Pharmacology', question: 'What is the first-line antibiotic for dental infections?', answer: 'Amoxicillin' },
  { subjectName: 'Oral Pharmacology', question: 'What antibiotic is used for penicillin-allergic patients?', answer: 'Clindamycin or Azithromycin' },
  { subjectName: 'Oral Pharmacology', question: 'What is the dose of amoxicillin for dental infection?', answer: '500mg three times daily for 7 days' },
  { subjectName: 'Oral Pharmacology', question: 'What is the antibiotic prophylaxis dose for cardiac patients?', answer: '2g amoxicillin 1 hour before procedure' },
  { subjectName: 'Oral Pharmacology', question: 'What analgesic is most commonly prescribed for dental pain?', answer: 'Ibuprofen (NSAID)' },
  { subjectName: 'Oral Pharmacology', question: 'What is the dose of ibuprofen for dental pain?', answer: '400-600mg every 6 hours' },
  { subjectName: 'Oral Pharmacology', question: 'What is the maximum daily dose of acetaminophen?', answer: '4000mg (4g) per day' },
  { subjectName: 'Oral Pharmacology', question: 'What is chlorhexidine?', answer: 'An antimicrobial mouthwash used for plaque control' },
  { subjectName: 'Oral Pharmacology', question: 'What is the concentration of chlorhexidine mouthwash?', answer: '0.12% or 0.2%' },
  { subjectName: 'Oral Pharmacology', question: 'What is fluoride varnish used for?', answer: 'Topical fluoride application for caries prevention' },

  // ============================================
  // ORAL PATHOLOGY FLASHCARDS
  // ============================================
  { subjectName: 'Oral Pathology', question: 'What is the most common oral cancer?', answer: 'Squamous cell carcinoma (90% of oral cancers)' },
  { subjectName: 'Oral Pathology', question: 'What is leukoplakia?', answer: 'A white patch that cannot be scraped off or diagnosed as another condition' },
  { subjectName: 'Oral Pathology', question: 'What is erythroplakia?', answer: 'A red patch on oral mucosa with high malignant potential' },
  { subjectName: 'Oral Pathology', question: 'What is oral candidiasis?', answer: 'Fungal infection (thrush) appearing as white patches that can be wiped off' },
  { subjectName: 'Oral Pathology', question: 'What causes oral candidiasis?', answer: 'Candida albicans (yeast)' },
  { subjectName: 'Oral Pathology', question: 'What is an aphthous ulcer?', answer: 'Painful recurrent ulcer of unknown cause (canker sore)' },
  { subjectName: 'Oral Pathology', question: 'What is herpes simplex virus (HSV-1)?', answer: 'Virus causing cold sores and primary herpetic gingivostomatitis' },
  { subjectName: 'Oral Pathology', question: 'What is oral lichen planus?', answer: 'Chronic inflammatory condition with white striations (Wickham\'s striae)' },
  { subjectName: 'Oral Pathology', question: 'What is a mucocele?', answer: 'Mucus-filled cyst from damaged salivary gland duct' },
  { subjectName: 'Oral Pathology', question: 'What is a ranula?', answer: 'Mucocele in the floor of the mouth' },
  { subjectName: 'Oral Pathology', question: 'What is a fibroma?', answer: 'Benign tumor of fibrous connective tissue' },
  { subjectName: 'Oral Pathology', question: 'What is a papilloma?', answer: 'Benign epithelial tumor with finger-like projections' },
  { subjectName: 'Oral Pathology', question: 'What is geographic tongue?', answer: 'Benign condition with irregular red patches on tongue (benign migratory glossitis)' },
  { subjectName: 'Oral Pathology', question: 'What is hairy tongue?', answer: 'Elongation of filiform papillae giving hairy appearance' },
  { subjectName: 'Oral Pathology', question: 'What is torus palatinus?', answer: 'Benign bony growth in midline of hard palate' },
  { subjectName: 'Oral Pathology', question: 'What is torus mandibularis?', answer: 'Benign bony growth on lingual surface of mandible' },
  { subjectName: 'Oral Pathology', question: 'What is ameloblastoma?', answer: 'Benign but locally aggressive odontogenic tumor' },
  { subjectName: 'Oral Pathology', question: 'What is a dentigerous cyst?', answer: 'Cyst surrounding the crown of an unerupted tooth' },
  { subjectName: 'Oral Pathology', question: 'What is a radicular cyst?', answer: 'Cyst at the apex of a non-vital tooth (periapical cyst)' },
  { subjectName: 'Oral Pathology', question: 'What is xerostomia?', answer: 'Dry mouth due to reduced saliva production' }
];

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seedQuizzesAndFlashcards() {
  try {
    console.log('🌱 Starting to seed Quizzes and Flashcards...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing Quizzes and Flashcards...');
    await Quiz.deleteMany({});
    await Flashcard.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Get all subjects to map names to IDs
    console.log('📚 Fetching subjects...');
    const subjects = await Subject.find({});
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });
    console.log(`✅ Found ${subjects.length} subjects\n`);

    // Prepare Quizzes with subjectId
    console.log('📝 Creating Quizzes...');
    const quizzesToCreate = quizzesData.map(quiz => {
      const subjectId = subjectMap[quiz.subjectName];
      if (!subjectId) {
        console.warn(`⚠️  Warning: Subject "${quiz.subjectName}" not found for quiz "${quiz.title}"`);
        return null;
      }
      return {
        title: quiz.title,
        subjectId: subjectId,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        shuffleQuestions: quiz.shuffleQuestions
      };
    }).filter(quiz => quiz !== null);

    const createdQuizzes = await Quiz.insertMany(quizzesToCreate);
    console.log(`✅ Created ${createdQuizzes.length} quizzes\n`);

    // Prepare Flashcards with subjectId
    console.log('🎴 Creating Flashcards...');
    const flashcardsToCreate = flashcardsData.map(flashcard => {
      const subjectId = subjectMap[flashcard.subjectName];
      if (!subjectId) {
        console.warn(`⚠️  Warning: Subject "${flashcard.subjectName}" not found for flashcard`);
        return null;
      }
      return {
        question: flashcard.question,
        answer: flashcard.answer,
        subjectId: subjectId
      };
    }).filter(flashcard => flashcard !== null);

    const createdFlashcards = await Flashcard.insertMany(flashcardsToCreate);
    console.log(`✅ Created ${createdFlashcards.length} flashcards\n`);

    // Display summary by subject
    console.log('📊 SUMMARY BY SUBJECT:');
    console.log('═══════════════════════════════════════');

    const summaryMap = {};

    // Count quizzes per subject
    createdQuizzes.forEach(quiz => {
      const subject = subjects.find(s => s._id.toString() === quiz.subjectId.toString());
      if (subject) {
        if (!summaryMap[subject.name]) {
          summaryMap[subject.name] = { quizzes: 0, questions: 0, flashcards: 0 };
        }
        summaryMap[subject.name].quizzes++;
        summaryMap[subject.name].questions += quiz.questions.length;
      }
    });

    // Count flashcards per subject
    createdFlashcards.forEach(flashcard => {
      const subject = subjects.find(s => s._id.toString() === flashcard.subjectId.toString());
      if (subject) {
        if (!summaryMap[subject.name]) {
          summaryMap[subject.name] = { quizzes: 0, questions: 0, flashcards: 0 };
        }
        summaryMap[subject.name].flashcards++;
      }
    });

    // Display summary
    Object.keys(summaryMap).sort().forEach(subjectName => {
      const counts = summaryMap[subjectName];
      console.log(`${subjectName}:`);
      if (counts.quizzes > 0) {
        console.log(`  - ${counts.quizzes} quizzes (${counts.questions} questions)`);
      }
      if (counts.flashcards > 0) {
        console.log(`  - ${counts.flashcards} flashcards`);
      }
    });

    // Calculate totals
    const totalQuestions = createdQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

    console.log('═══════════════════════════════════════');
    console.log(`\n✨ Total: ${createdQuizzes.length} quizzes, ${totalQuestions} questions, ${createdFlashcards.length} flashcards`);
    console.log('\n🎉 Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedQuizzesAndFlashcards();


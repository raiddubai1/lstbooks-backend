import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../models/Subject.js';
import Quiz from '../models/Quiz.js';
import Flashcard from '../models/Flashcard.js';
import Lab from '../models/Lab.js';
import OSCEStation from '../models/OSCE.js';
import Skill from '../models/Skill.js';

dotenv.config();

// Real Dental Subjects
const subjects = [
  {
    name: 'Dental Anatomy',
    description: 'Study of tooth morphology, development, and occlusion. Essential foundation for all dental procedures.',
    resources: [
      { title: 'Tooth Morphology Guide', type: 'pdf', url: 'https://example.com/tooth-morphology.pdf' },
      { title: 'Dental Anatomy Lecture Series', type: 'video', url: 'https://youtube.com/dental-anatomy' }
    ]
  },
  {
    name: 'Oral Pathology',
    description: 'Study of diseases affecting the oral and maxillofacial region, including diagnosis and treatment planning.',
    resources: [
      { title: 'Common Oral Lesions', type: 'pdf', url: 'https://example.com/oral-lesions.pdf' },
      { title: 'Pathology Case Studies', type: 'video', url: 'https://youtube.com/oral-pathology' }
    ]
  },
  {
    name: 'Periodontology',
    description: 'Study of supporting structures of teeth and diseases affecting them, including prevention and treatment.',
    resources: [
      { title: 'Periodontal Disease Classification', type: 'pdf', url: 'https://example.com/perio-classification.pdf' },
      { title: 'Scaling and Root Planing Techniques', type: 'video', url: 'https://youtube.com/perio-treatment' }
    ]
  },
  {
    name: 'Endodontics',
    description: 'Study of dental pulp and periapical tissues, focusing on root canal treatment and related procedures.',
    resources: [
      { title: 'Root Canal Anatomy', type: 'pdf', url: 'https://example.com/rct-anatomy.pdf' },
      { title: 'Endodontic Techniques', type: 'video', url: 'https://youtube.com/endodontics' }
    ]
  },
  {
    name: 'Prosthodontics',
    description: 'Restoration and replacement of teeth using crowns, bridges, dentures, and implants.',
    resources: [
      { title: 'Crown Preparation Guidelines', type: 'pdf', url: 'https://example.com/crown-prep.pdf' },
      { title: 'Complete Denture Fabrication', type: 'video', url: 'https://youtube.com/prosthodontics' }
    ]
  },
  {
    name: 'Oral Surgery',
    description: 'Surgical procedures in the oral and maxillofacial region, including extractions and implant placement.',
    resources: [
      { title: 'Surgical Extraction Techniques', type: 'pdf', url: 'https://example.com/extractions.pdf' },
      { title: 'Oral Surgery Procedures', type: 'video', url: 'https://youtube.com/oral-surgery' }
    ]
  },
  {
    name: 'Orthodontics',
    description: 'Diagnosis, prevention, and correction of malpositioned teeth and jaws.',
    resources: [
      { title: 'Cephalometric Analysis', type: 'pdf', url: 'https://example.com/cephalometrics.pdf' },
      { title: 'Orthodontic Treatment Planning', type: 'video', url: 'https://youtube.com/orthodontics' }
    ]
  },
  {
    name: 'Pediatric Dentistry',
    description: 'Dental care for infants, children, and adolescents, including special needs patients.',
    resources: [
      { title: 'Behavior Management in Children', type: 'pdf', url: 'https://example.com/pediatric-behavior.pdf' },
      { title: 'Pediatric Dental Procedures', type: 'video', url: 'https://youtube.com/pediatric-dentistry' }
    ]
  }
];

// Real Dental Quizzes (will be created after subjects)
const quizzesData = [
  {
    subjectName: 'Dental Anatomy',
    title: 'Tooth Morphology and Identification',
    timeLimit: 1200, // 20 minutes
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'Which tooth has the largest crown in the permanent dentition?',
        type: 'MCQ',
        options: ['Maxillary central incisor', 'Maxillary first molar', 'Mandibular first molar', 'Maxillary canine'],
        answer: 'Maxillary first molar',
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
        questionText: 'What is the primary function of canine teeth?',
        type: 'MCQ',
        options: ['Grinding food', 'Tearing food', 'Cutting food', 'Crushing food'],
        answer: 'Tearing food',
        points: 1
      },
      {
        questionText: 'Which permanent tooth typically erupts first?',
        type: 'MCQ',
        options: ['Central incisor', 'First molar', 'Canine', 'First premolar'],
        answer: 'First molar',
        points: 1
      },
      {
        questionText: 'What is the term for the chewing surface of posterior teeth?',
        type: 'MCQ',
        options: ['Incisal edge', 'Occlusal surface', 'Labial surface', 'Lingual surface'],
        answer: 'Occlusal surface',
        points: 1
      },
      {
        questionText: 'How many roots does a maxillary first molar typically have?',
        type: 'MCQ',
        options: ['1', '2', '3', '4'],
        answer: '3',
        points: 1
      },
      {
        questionText: 'What is the name of the junction between enamel and cementum?',
        type: 'MCQ',
        options: ['Dentinoenamel junction', 'Cementoenamel junction', 'Dentinogingival junction', 'Amelocemental junction'],
        answer: 'Cementoenamel junction',
        points: 1
      },
      {
        questionText: 'Which tooth is known as the "cornerstone" of the dental arch?',
        type: 'MCQ',
        options: ['Central incisor', 'Lateral incisor', 'Canine', 'First premolar'],
        answer: 'Canine',
        points: 1
      }
    ]
  },
  {
    subjectName: 'Oral Pathology',
    title: 'Common Oral Lesions and Diseases',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the most common oral cancer?',
        type: 'MCQ',
        options: ['Adenocarcinoma', 'Squamous cell carcinoma', 'Melanoma', 'Basal cell carcinoma'],
        answer: 'Squamous cell carcinoma',
        points: 1
      },
      {
        questionText: 'Which of the following is a white lesion that cannot be rubbed off?',
        type: 'MCQ',
        options: ['Candidiasis', 'Leukoplakia', 'Aphthous ulcer', 'Herpes simplex'],
        answer: 'Leukoplakia',
        points: 1
      },
      {
        questionText: 'What virus causes oral herpes?',
        type: 'MCQ',
        options: ['HPV', 'HSV-1', 'EBV', 'CMV'],
        answer: 'HSV-1',
        points: 1
      },
      {
        questionText: 'What is the term for inflammation of the tongue?',
        type: 'MCQ',
        options: ['Gingivitis', 'Glossitis', 'Stomatitis', 'Cheilitis'],
        answer: 'Glossitis',
        points: 1
      },
      {
        questionText: 'Which condition presents as white lacy patterns on buccal mucosa?',
        type: 'MCQ',
        options: ['Lichen planus', 'Leukoplakia', 'Candidiasis', 'Fordyce granules'],
        answer: 'Lichen planus',
        points: 1
      }
    ]
  },
  {
    subjectName: 'Periodontology',
    title: 'Periodontal Disease and Treatment',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the primary cause of periodontal disease?',
        type: 'MCQ',
        options: ['Genetics', 'Bacterial plaque', 'Trauma', 'Vitamin deficiency'],
        answer: 'Bacterial plaque',
        points: 1
      },
      {
        questionText: 'At what probing depth is a periodontal pocket generally considered pathological?',
        type: 'MCQ',
        options: ['1-2mm', '3mm or less', '4mm or more', '6mm or more'],
        answer: '4mm or more',
        points: 1
      },
      {
        questionText: 'What is the difference between gingivitis and periodontitis?',
        type: 'MCQ',
        options: ['Gingivitis is painful', 'Periodontitis involves bone loss', 'Gingivitis is irreversible', 'Periodontitis only affects gums'],
        answer: 'Periodontitis involves bone loss',
        points: 1
      },
      {
        questionText: 'Which bacteria is most associated with aggressive periodontitis?',
        type: 'MCQ',
        options: ['Streptococcus mutans', 'Aggregatibacter actinomycetemcomitans', 'Lactobacillus', 'Candida albicans'],
        answer: 'Aggregatibacter actinomycetemcomitans',
        points: 1
      },
      {
        questionText: 'What is the purpose of scaling and root planing?',
        type: 'MCQ',
        options: ['Whiten teeth', 'Remove plaque and calculus', 'Fill cavities', 'Extract teeth'],
        answer: 'Remove plaque and calculus',
        points: 1
      }
    ]
  },
  {
    subjectName: 'Endodontics',
    title: 'Root Canal Treatment Fundamentals',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the main goal of root canal treatment?',
        type: 'MCQ',
        options: ['Whiten the tooth', 'Remove infected pulp tissue', 'Strengthen the tooth', 'Prevent cavities'],
        answer: 'Remove infected pulp tissue',
        points: 1
      },
      {
        questionText: 'What material is commonly used to fill root canals?',
        type: 'MCQ',
        options: ['Amalgam', 'Composite', 'Gutta-percha', 'Glass ionomer'],
        answer: 'Gutta-percha',
        points: 1
      },
      {
        questionText: 'What is irreversible pulpitis?',
        type: 'MCQ',
        options: ['Mild inflammation that heals', 'Severe inflammation requiring RCT', 'Gum inflammation', 'Bone infection'],
        answer: 'Severe inflammation requiring RCT',
        points: 1
      },
      {
        questionText: 'How many canals does a maxillary first molar typically have?',
        type: 'MCQ',
        options: ['1', '2', '3', '4'],
        answer: '3',
        points: 1
      },
      {
        questionText: 'What is an apical abscess?',
        type: 'MCQ',
        options: ['Gum infection', 'Pus collection at tooth apex', 'Tooth decay', 'Jaw fracture'],
        answer: 'Pus collection at tooth apex',
        points: 1
      }
    ]
  },
  {
    subjectName: 'Prosthodontics',
    title: 'Fixed and Removable Prosthodontics',
    timeLimit: 900,
    shuffleQuestions: true,
    questions: [
      {
        questionText: 'What is the main advantage of a dental implant over a bridge?',
        type: 'MCQ',
        options: ['Cheaper', 'Faster to place', 'Does not require adjacent tooth preparation', 'Easier to clean'],
        answer: 'Does not require adjacent tooth preparation',
        points: 1
      },
      {
        questionText: 'What is a pontic?',
        type: 'MCQ',
        options: ['A type of crown', 'The artificial tooth in a bridge', 'A denture base', 'An implant fixture'],
        answer: 'The artificial tooth in a bridge',
        points: 1
      },
      {
        questionText: 'What material is most commonly used for dental implants?',
        type: 'MCQ',
        options: ['Stainless steel', 'Gold', 'Titanium', 'Ceramic'],
        answer: 'Titanium',
        points: 1
      },
      {
        questionText: 'What is the minimum bone height typically required for implant placement?',
        type: 'MCQ',
        options: ['5mm', '8mm', '10mm', '15mm'],
        answer: '10mm',
        points: 1
      },
      {
        questionText: 'What is osseointegration?',
        type: 'MCQ',
        options: ['Tooth decay', 'Bone fusion with implant', 'Gum healing', 'Crown cementation'],
        answer: 'Bone fusion with implant',
        points: 1
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Subject.deleteMany({}),
      Quiz.deleteMany({}),
      Flashcard.deleteMany({}),
      Lab.deleteMany({}),
      OSCEStation.deleteMany({}),
      Skill.deleteMany({})
    ]);
    console.log('✅ Existing data cleared\n');

    console.log('📚 Seeding subjects...');
    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`✅ Created ${createdSubjects.length} subjects\n`);

    // Create subject map for easy reference
    const subjectMap = {};
    createdSubjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });

    // Seed Quizzes
    console.log('📝 Seeding quizzes...');
    const quizzes = quizzesData.map(quizData => ({
      title: quizData.title,
      subjectId: subjectMap[quizData.subjectName],
      questions: quizData.questions,
      timeLimit: quizData.timeLimit,
      shuffleQuestions: quizData.shuffleQuestions
    }));
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log(`✅ Created ${createdQuizzes.length} quizzes\n`);

    // Seed Flashcards
    console.log('🎴 Seeding flashcards...');
    const flashcards = [
      // Dental Anatomy Flashcards
      { question: 'What is the hardest substance in the human body?', answer: 'Enamel - the outer layer of the tooth crown', subjectId: subjectMap['Dental Anatomy'] },
      { question: 'What are the four types of teeth?', answer: 'Incisors, Canines, Premolars, and Molars', subjectId: subjectMap['Dental Anatomy'] },
      { question: 'How many teeth are in the permanent dentition?', answer: '32 teeth (including wisdom teeth)', subjectId: subjectMap['Dental Anatomy'] },
      { question: 'What is the pulp chamber?', answer: 'The central cavity of the tooth containing nerves and blood vessels', subjectId: subjectMap['Dental Anatomy'] },
      { question: 'What is dentin?', answer: 'The hard tissue beneath enamel and cementum that forms the bulk of the tooth', subjectId: subjectMap['Dental Anatomy'] },

      // Oral Pathology Flashcards
      { question: 'What is leukoplakia?', answer: 'A white patch or plaque that cannot be scraped off and cannot be characterized clinically or pathologically as any other disease', subjectId: subjectMap['Oral Pathology'] },
      { question: 'What is oral candidiasis?', answer: 'A fungal infection of the oral cavity caused by Candida species, appearing as white patches', subjectId: subjectMap['Oral Pathology'] },
      { question: 'What is aphthous ulcer?', answer: 'A common recurrent painful oral ulcer, also known as canker sore', subjectId: subjectMap['Oral Pathology'] },
      { question: 'What is oral lichen planus?', answer: 'A chronic inflammatory condition affecting oral mucosa, appearing as white lacy patterns', subjectId: subjectMap['Oral Pathology'] },

      // Periodontology Flashcards
      { question: 'What is gingivitis?', answer: 'Inflammation of the gingiva (gums) without loss of attachment or bone', subjectId: subjectMap['Periodontology'] },
      { question: 'What is periodontitis?', answer: 'Inflammation of the periodontium with loss of attachment and alveolar bone', subjectId: subjectMap['Periodontology'] },
      { question: 'What is a periodontal pocket?', answer: 'A pathologically deepened gingival sulcus due to loss of attachment', subjectId: subjectMap['Periodontology'] },
      { question: 'What is scaling and root planing?', answer: 'Non-surgical periodontal treatment involving removal of plaque, calculus, and smoothing of root surfaces', subjectId: subjectMap['Periodontology'] },

      // Endodontics Flashcards
      { question: 'What is pulpitis?', answer: 'Inflammation of the dental pulp, can be reversible or irreversible', subjectId: subjectMap['Endodontics'] },
      { question: 'What is a root canal treatment?', answer: 'Removal of infected or inflamed pulp tissue, cleaning, shaping, and filling of root canals', subjectId: subjectMap['Endodontics'] },
      { question: 'What is an apical abscess?', answer: 'A localized collection of pus at the apex of a tooth root', subjectId: subjectMap['Endodontics'] },
      { question: 'What is gutta-percha?', answer: 'A rubber-like material used to fill root canals after cleaning and shaping', subjectId: subjectMap['Endodontics'] },

      // Prosthodontics Flashcards
      { question: 'What is a crown?', answer: 'A fixed prosthetic restoration that covers the entire clinical crown of a tooth', subjectId: subjectMap['Prosthodontics'] },
      { question: 'What is a bridge?', answer: 'A fixed prosthetic device that replaces missing teeth by attaching to adjacent teeth', subjectId: subjectMap['Prosthodontics'] },
      { question: 'What is a complete denture?', answer: 'A removable prosthetic device that replaces all teeth in an arch', subjectId: subjectMap['Prosthodontics'] },
      { question: 'What is an implant?', answer: 'A titanium post surgically placed in the jawbone to support a prosthetic tooth', subjectId: subjectMap['Prosthodontics'] },

      // Oral Surgery Flashcards
      { question: 'What is a simple extraction?', answer: 'Removal of a tooth that is visible in the mouth using forceps', subjectId: subjectMap['Oral Surgery'] },
      { question: 'What is a surgical extraction?', answer: 'Removal of a tooth that requires incision and bone removal', subjectId: subjectMap['Oral Surgery'] },
      { question: 'What is dry socket?', answer: 'Alveolar osteitis - painful condition after extraction due to loss of blood clot', subjectId: subjectMap['Oral Surgery'] },

      // Orthodontics Flashcards
      { question: 'What is malocclusion?', answer: 'Misalignment of teeth or incorrect relation between dental arches', subjectId: subjectMap['Orthodontics'] },
      { question: 'What is Class I malocclusion?', answer: 'Normal molar relationship with crowding, spacing, or rotations', subjectId: subjectMap['Orthodontics'] },
      { question: 'What is Class II malocclusion?', answer: 'Mesiobuccal cusp of maxillary first molar is mesial to buccal groove of mandibular first molar (overbite)', subjectId: subjectMap['Orthodontics'] },

      // Pediatric Dentistry Flashcards
      { question: 'When do primary teeth start erupting?', answer: 'Around 6 months of age, starting with lower central incisors', subjectId: subjectMap['Pediatric Dentistry'] },
      { question: 'How many primary teeth are there?', answer: '20 primary (deciduous) teeth', subjectId: subjectMap['Pediatric Dentistry'] },
      { question: 'What is early childhood caries?', answer: 'Severe tooth decay in young children, often caused by prolonged bottle feeding', subjectId: subjectMap['Pediatric Dentistry'] }
    ];
    const createdFlashcards = await Flashcard.insertMany(flashcards);
    console.log(`✅ Created ${createdFlashcards.length} flashcards\n`);

    // Seed Labs
    console.log('🔬 Seeding lab manuals...');
    const labs = [
      {
        title: 'Tooth Carving - Maxillary Central Incisor',
        subjectId: subjectMap['Dental Anatomy'],
        description: 'Learn to carve a maxillary central incisor from wax, understanding its anatomical features and proportions.',
        steps: [
          'Select appropriate wax block and carving tools',
          'Mark the outline of the tooth on all surfaces',
          'Carve the labial surface with proper convexity',
          'Shape the incisal edge with appropriate thickness',
          'Carve the lingual surface including cingulum and marginal ridges',
          'Refine the proximal surfaces and contact areas',
          'Smooth all surfaces and check proportions',
          'Compare with reference tooth or diagram'
        ]
      },
      {
        title: 'Cavity Preparation - Class I',
        subjectId: subjectMap['Dental Anatomy'],
        description: 'Practice preparing a Class I cavity on a molar tooth model for amalgam restoration.',
        steps: [
          'Identify the occlusal pit and fissure system',
          'Use high-speed handpiece with appropriate bur',
          'Create outline form following fissure pattern',
          'Establish proper depth (1.5-2mm into dentin)',
          'Create resistance and retention form',
          'Remove any remaining carious dentin',
          'Finish cavity walls and margins',
          'Clean and inspect the preparation'
        ]
      },
      {
        title: 'Periodontal Probing Technique',
        subjectId: subjectMap['Periodontology'],
        description: 'Master the technique of measuring periodontal pocket depths using a periodontal probe.',
        steps: [
          'Select appropriate periodontal probe',
          'Position patient and ensure good lighting',
          'Insert probe gently into gingival sulcus',
          'Walk the probe around the tooth at 6 points',
          'Measure depth from gingival margin to pocket base',
          'Record measurements for each tooth',
          'Note any bleeding on probing',
          'Document findings in periodontal chart'
        ]
      },
      {
        title: 'Root Canal Access Opening',
        subjectId: subjectMap['Endodontics'],
        description: 'Learn to create proper access cavity for root canal treatment on extracted teeth.',
        steps: [
          'Study tooth anatomy and pulp chamber location',
          'Mark access outline on occlusal surface',
          'Use high-speed bur to penetrate enamel',
          'Remove roof of pulp chamber completely',
          'Create straight-line access to canal orifices',
          'Remove all pulp tissue from chamber',
          'Locate all canal orifices',
          'Refine access cavity walls'
        ]
      }
    ];
    const createdLabs = await Lab.insertMany(labs);
    console.log(`✅ Created ${createdLabs.length} lab manuals\n`);

    // Seed Clinical Skills
    console.log('💉 Seeding clinical skills...');
    const skills = [
      {
        title: 'Local Anesthesia Administration',
        subjectId: subjectMap['Oral Surgery'],
        description: 'Proper technique for administering local anesthesia in dentistry, including inferior alveolar nerve block.',
        media: [
          { type: 'image', url: 'https://example.com/anesthesia-technique.jpg' },
          { type: 'video', url: 'https://youtube.com/local-anesthesia-demo' }
        ]
      },
      {
        title: 'Rubber Dam Application',
        subjectId: subjectMap['Endodontics'],
        description: 'Step-by-step technique for placing rubber dam isolation for endodontic procedures.',
        media: [
          { type: 'image', url: 'https://example.com/rubber-dam.jpg' },
          { type: 'video', url: 'https://youtube.com/rubber-dam-placement' }
        ]
      },
      {
        title: 'Suturing Techniques',
        subjectId: subjectMap['Oral Surgery'],
        description: 'Basic suturing techniques used in oral surgery including simple interrupted and continuous sutures.',
        media: [
          { type: 'image', url: 'https://example.com/suturing.jpg' },
          { type: 'video', url: 'https://youtube.com/dental-suturing' }
        ]
      },
      {
        title: 'Impression Taking',
        subjectId: subjectMap['Prosthodontics'],
        description: 'Proper technique for taking alginate and elastomeric impressions for prosthodontic work.',
        media: [
          { type: 'image', url: 'https://example.com/impression-taking.jpg' },
          { type: 'video', url: 'https://youtube.com/dental-impressions' }
        ]
      },
      {
        title: 'Tooth Extraction Forceps Technique',
        subjectId: subjectMap['Oral Surgery'],
        description: 'Correct use of extraction forceps for different teeth, including proper grip and movement.',
        media: [
          { type: 'image', url: 'https://example.com/extraction-forceps.jpg' },
          { type: 'video', url: 'https://youtube.com/extraction-technique' }
        ]
      }
    ];
    const createdSkills = await Skill.insertMany(skills);
    console.log(`✅ Created ${createdSkills.length} clinical skills\n`);

    // Seed OSCE Stations
    console.log('🏥 Seeding OSCE stations...');
    const osceStations = [
      {
        title: 'Patient History Taking - Toothache',
        subjectId: subjectMap['Oral Pathology'],
        description: 'Take a comprehensive dental history from a patient presenting with toothache.',
        steps: [
          'Introduce yourself and establish rapport',
          'Ask about chief complaint and its characteristics',
          'Determine onset, duration, and severity of pain',
          'Ask about aggravating and relieving factors',
          'Inquire about previous dental treatments',
          'Take medical history and medications',
          'Ask about allergies',
          'Summarize findings and explain next steps'
        ]
      },
      {
        title: 'Oral Examination - Soft Tissue',
        subjectId: subjectMap['Oral Pathology'],
        description: 'Perform a systematic extra-oral and intra-oral soft tissue examination.',
        steps: [
          'Wash hands and wear appropriate PPE',
          'Perform extra-oral examination (lymph nodes, TMJ, facial symmetry)',
          'Examine lips and labial mucosa',
          'Examine buccal mucosa bilaterally',
          'Examine tongue (dorsal, ventral, lateral borders)',
          'Examine floor of mouth',
          'Examine hard and soft palate',
          'Examine oropharynx',
          'Document any abnormal findings'
        ]
      },
      {
        title: 'Restorative Procedure - Composite Filling',
        subjectId: subjectMap['Dental Anatomy'],
        description: 'Demonstrate the complete procedure for placing a composite restoration.',
        steps: [
          'Administer local anesthesia',
          'Apply rubber dam isolation',
          'Remove carious tissue and prepare cavity',
          'Apply etchant to enamel and dentin',
          'Rinse and dry appropriately',
          'Apply bonding agent and light cure',
          'Place composite in incremental layers',
          'Light cure each layer adequately',
          'Check and adjust occlusion',
          'Polish the restoration'
        ]
      },
      {
        title: 'Emergency Management - Syncope',
        subjectId: subjectMap['Oral Surgery'],
        description: 'Manage a patient who has fainted in the dental chair.',
        steps: [
          'Recognize signs of syncope',
          'Stop dental procedure immediately',
          'Position patient supine with legs elevated',
          'Loosen tight clothing',
          'Ensure airway is open',
          'Monitor vital signs',
          'Administer oxygen if available',
          'Keep patient comfortable until recovery',
          'Document the incident',
          'Consider postponing treatment'
        ]
      },
      {
        title: 'Radiographic Interpretation',
        subjectId: subjectMap['Oral Pathology'],
        description: 'Systematically interpret a periapical radiograph and identify pathology.',
        steps: [
          'Check patient details and radiograph quality',
          'Identify the tooth/teeth present',
          'Examine crown (caries, restorations)',
          'Examine root morphology and canal system',
          'Assess periodontal ligament space',
          'Examine alveolar bone levels',
          'Look for periapical pathology',
          'Identify any other abnormalities',
          'Formulate differential diagnosis',
          'Recommend further investigations if needed'
        ]
      }
    ];
    const createdOSCE = await OSCEStation.insertMany(osceStations);
    console.log(`✅ Created ${createdOSCE.length} OSCE stations\n`);

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════');
    console.log(`📚 Subjects: ${createdSubjects.length}`);
    console.log(`📝 Quizzes: ${createdQuizzes.length}`);
    console.log(`🎴 Flashcards: ${createdFlashcards.length}`);
    console.log(`🔬 Lab Manuals: ${createdLabs.length}`);
    console.log(`💉 Clinical Skills: ${createdSkills.length}`);
    console.log(`🏥 OSCE Stations: ${createdOSCE.length}`);
    console.log('═══════════════════════════════════════════════\n');

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();


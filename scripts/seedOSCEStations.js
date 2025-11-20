import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OSCEStation from '../models/OSCE.js';
import Subject from '../models/Subject.js';
import Skill from '../models/Skill.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================
// OSCE STATIONS DATA
// ============================================

const osceStationsData = [
  // ============================================
  // CLINICAL EXAMINATION STATIONS
  // ============================================
  {
    title: 'Complete Oral Examination',
    subjectName: 'Introduction to Clinical Dentistry',
    skillNames: ['Intraoral and Extraoral Examination'],
    description: 'Patient presents for routine dental examination. Perform a comprehensive intraoral and extraoral examination, documenting all findings systematically.',
    steps: [
      'Introduce yourself and explain the procedure to the patient',
      'Perform extraoral examination: inspect face, TMJ, lymph nodes',
      'Palpate submandibular and cervical lymph nodes',
      'Assess TMJ function and range of motion',
      'Perform intraoral examination: soft tissues (lips, cheeks, tongue, palate, floor of mouth)',
      'Examine gingiva and periodontal tissues',
      'Chart all teeth present and missing',
      'Identify caries, restorations, and abnormalities',
      'Assess occlusion and bite relationship',
      'Document all findings clearly',
      'Communicate findings to patient in understandable terms',
      'Recommend appropriate treatment or follow-up'
    ]
  },
  {
    title: 'Periodontal Assessment',
    subjectName: 'Periodontology',
    skillNames: ['Periodontal Examination and Probing'],
    description: 'Patient with suspected periodontal disease. Perform comprehensive periodontal examination including probing depths, attachment levels, and mobility assessment.',
    steps: [
      'Explain periodontal examination to patient',
      'Assess gingival inflammation and bleeding',
      'Measure probing depths at 6 sites per tooth',
      'Record attachment levels',
      'Assess furcation involvement in molars',
      'Check tooth mobility (Miller classification)',
      'Evaluate plaque and calculus deposits',
      'Assess gingival recession',
      'Document findings on periodontal chart',
      'Classify periodontal disease severity',
      'Explain findings to patient',
      'Recommend appropriate periodontal treatment'
    ]
  },
  {
    title: 'Caries Risk Assessment',
    subjectName: 'Operative Dentistry (Clinical)',
    skillNames: [],
    description: 'Young adult patient with multiple carious lesions. Assess caries risk factors and develop preventive care plan.',
    steps: [
      'Take comprehensive medical and dental history',
      'Assess dietary habits and sugar intake',
      'Evaluate oral hygiene practices',
      'Examine for active caries lesions',
      'Assess saliva flow and quality',
      'Identify white spot lesions',
      'Evaluate fluoride exposure history',
      'Check for xerostomia or medications affecting saliva',
      'Classify patient as low, moderate, or high caries risk',
      'Develop individualized prevention plan',
      'Educate patient on caries prevention',
      'Schedule appropriate recall interval'
    ]
  },
  {
    title: 'Oral Cancer Screening',
    subjectName: 'Oral Medicine',
    skillNames: ['Intraoral and Extraoral Examination'],
    description: 'Patient with history of tobacco use presents for oral cancer screening. Perform systematic examination to identify suspicious lesions.',
    steps: [
      'Take detailed history including tobacco and alcohol use',
      'Inspect lips for lesions, asymmetry, or color changes',
      'Examine buccal mucosa bilaterally',
      'Inspect floor of mouth thoroughly',
      'Examine ventral and dorsal tongue surfaces',
      'Inspect hard and soft palate',
      'Palpate tongue and floor of mouth',
      'Assess any suspicious lesions (size, color, texture, borders)',
      'Palpate cervical lymph nodes',
      'Document all findings with measurements',
      'Explain findings and risk factors to patient',
      'Refer for biopsy if suspicious lesions identified'
    ]
  },

  // ============================================
  // EMERGENCY MANAGEMENT STATIONS
  // ============================================
  {
    title: 'Medical Emergency: Syncope',
    subjectName: 'Oral Surgery I',
    skillNames: [],
    description: 'Patient becomes unconscious in dental chair during treatment. Manage syncope episode appropriately.',
    steps: [
      'Recognize signs of syncope (pallor, sweating, loss of consciousness)',
      'Stop dental procedure immediately',
      'Position patient supine with legs elevated',
      'Ensure airway is open and patient is breathing',
      'Loosen tight clothing',
      'Monitor vital signs (pulse, breathing)',
      'Administer oxygen if available',
      'Apply cool compress to forehead',
      'Wait for patient to regain consciousness',
      'Keep patient supine for several minutes after recovery',
      'Assess patient condition before allowing to sit up',
      'Document incident thoroughly',
      'Determine if emergency services needed',
      'Reschedule treatment if appropriate'
    ]
  },
  {
    title: 'Medical Emergency: Anaphylaxis',
    subjectName: 'Oral Surgery I',
    skillNames: [],
    description: 'Patient develops anaphylactic reaction to local anesthetic. Recognize and manage life-threatening emergency.',
    steps: [
      'Recognize signs: difficulty breathing, swelling, urticaria, hypotension',
      'Call for emergency assistance immediately (911)',
      'Stop all dental procedures',
      'Position patient supine (unless breathing difficulty - then upright)',
      'Assess airway, breathing, circulation (ABC)',
      'Administer epinephrine 0.3mg IM (anterolateral thigh)',
      'Administer high-flow oxygen',
      'Monitor vital signs continuously',
      'Prepare for CPR if needed',
      'Administer antihistamine (diphenhydramine)',
      'Consider second dose of epinephrine if no improvement in 5 minutes',
      'Maintain IV access if possible',
      'Document all interventions and timeline',
      'Transfer to hospital when EMS arrives'
    ]
  },
  {
    title: 'Medical Emergency: Hypoglycemia',
    subjectName: 'Oral Medicine',
    skillNames: [],
    description: 'Diabetic patient shows signs of hypoglycemia during dental appointment. Recognize and manage appropriately.',
    steps: [
      'Recognize signs: sweating, trembling, confusion, weakness, hunger',
      'Stop dental procedure immediately',
      'Check blood glucose if glucometer available',
      'If conscious: give oral glucose (juice, glucose tablets, candy)',
      'Monitor patient response',
      'Keep patient seated or supine',
      'Recheck blood glucose after 15 minutes',
      'Give additional glucose if needed',
      'Do not resume treatment until glucose normalized',
      'If unconscious: call 911 and prepare for glucagon injection',
      'Monitor vital signs',
      'Document incident and glucose readings',
      'Advise patient to eat meal before leaving',
      'Consider medical consultation before future appointments'
    ]
  },
  {
    title: 'Medical Emergency: Angina',
    subjectName: 'Oral Medicine',
    skillNames: [],
    description: 'Patient with cardiac history experiences chest pain during treatment. Differentiate angina from myocardial infarction and manage appropriately.',
    steps: [
      'Recognize symptoms: chest pain, pressure, radiating pain',
      'Stop dental procedure immediately',
      'Position patient comfortably (usually upright)',
      'Administer oxygen',
      'Give nitroglycerin sublingually (patient\'s own medication)',
      'Monitor vital signs (pulse, blood pressure)',
      'Reassure patient and keep calm',
      'If pain resolves in 3-5 minutes: likely angina',
      'If pain persists after 3 nitroglycerin doses (5 min apart): suspect MI',
      'Call 911 if pain does not resolve or worsens',
      'Administer aspirin 325mg if MI suspected',
      'Be prepared for CPR',
      'Document all interventions and timeline',
      'Do not allow patient to drive if nitroglycerin given'
    ]
  },

  // ============================================
  // COMMUNICATION & PATIENT MANAGEMENT STATIONS
  // ============================================
  {
    title: 'Breaking Bad News: Oral Cancer Diagnosis',
    subjectName: 'Oral Medicine',
    skillNames: [],
    description: 'Inform patient about biopsy results showing oral squamous cell carcinoma. Demonstrate empathy and effective communication.',
    steps: [
      'Prepare private, quiet environment',
      'Ensure patient has support person if desired',
      'Use clear, simple language avoiding jargon',
      'Give warning shot: "I have some serious news to discuss"',
      'Deliver diagnosis clearly and directly',
      'Pause to allow patient to process information',
      'Show empathy and acknowledge emotions',
      'Answer questions honestly',
      'Explain next steps: referral to oral surgeon/oncologist',
      'Provide written information about condition',
      'Offer support resources',
      'Schedule follow-up appointment',
      'Ensure patient has contact information for questions',
      'Document conversation thoroughly'
    ]
  },
  {
    title: 'Anxious Patient Management',
    subjectName: 'Introduction to Clinical Dentistry',
    skillNames: [],
    description: 'Patient with severe dental anxiety presents for treatment. Use communication and behavioral management techniques.',
    steps: [
      'Greet patient warmly and establish rapport',
      'Acknowledge and validate patient\'s anxiety',
      'Ask about specific fears and concerns',
      'Explain all procedures before performing them',
      'Use tell-show-do technique',
      'Offer control: establish stop signal',
      'Use distraction techniques (music, TV)',
      'Demonstrate equipment before use',
      'Work slowly and give frequent breaks',
      'Provide positive reinforcement',
      'Consider sedation options if appropriate',
      'Schedule shorter appointments if needed',
      'Build trust gradually',
      'Follow up after appointment'
    ]
  },
  {
    title: 'Informed Consent for Extraction',
    subjectName: 'Oral Surgery I',
    skillNames: ['Simple Tooth Extraction'],
    description: 'Obtain informed consent for tooth extraction. Explain procedure, risks, benefits, and alternatives.',
    steps: [
      'Explain why extraction is necessary',
      'Describe the extraction procedure step-by-step',
      'Discuss anesthesia options',
      'Explain common risks: pain, swelling, bleeding, bruising',
      'Discuss serious but rare risks: nerve damage, sinus communication, jaw fracture',
      'Explain post-operative care requirements',
      'Discuss alternatives to extraction',
      'Explain consequences of not treating',
      'Answer all patient questions',
      'Ensure patient understands',
      'Obtain written consent signature',
      'Provide written post-op instructions',
      'Give emergency contact information',
      'Document consent process in chart'
    ]
  },
  {
    title: 'Treatment Planning Discussion',
    subjectName: 'Comprehensive Care',
    skillNames: [],
    description: 'Present comprehensive treatment plan to patient with multiple dental problems. Discuss options, costs, and priorities.',
    steps: [
      'Review all examination and radiographic findings',
      'Explain each dental problem in understandable terms',
      'Present treatment options for each problem',
      'Discuss pros and cons of each option',
      'Prioritize urgent vs elective treatments',
      'Provide cost estimates for treatments',
      'Discuss payment options and insurance coverage',
      'Create phased treatment plan if needed',
      'Address patient concerns and preferences',
      'Explain consequences of delaying treatment',
      'Provide written treatment plan',
      'Schedule first appointment',
      'Offer to answer questions at any time',
      'Document discussion and patient decisions'
    ]
  },

  // ============================================
  // PRACTICAL SKILLS STATIONS
  // ============================================
  {
    title: 'Local Anesthesia Administration',
    subjectName: 'Oral Surgery I',
    skillNames: ['Local Anesthesia Administration', 'Inferior Alveolar Nerve Block'],
    description: 'Administer inferior alveolar nerve block on manikin. Demonstrate proper technique, landmarks, and safety.',
    steps: [
      'Explain procedure to patient',
      'Select appropriate anesthetic and needle',
      'Assemble syringe and check aspiration',
      'Position patient appropriately',
      'Identify anatomical landmarks (coronoid notch, pterygomandibular raphe)',
      'Apply topical anesthetic',
      'Insert needle at correct height and angle',
      'Advance needle to proper depth (2/3 of needle length)',
      'Aspirate to check for blood vessel',
      'Deposit anesthetic slowly if aspiration negative',
      'Withdraw needle slowly',
      'Dispose of needle safely in sharps container',
      'Wait for anesthesia to take effect',
      'Test for adequate anesthesia before proceeding'
    ]
  },
  {
    title: 'Rubber Dam Application',
    subjectName: 'Operative Dentistry (Clinical)',
    skillNames: ['Rubber Dam Application'],
    description: 'Apply rubber dam isolation for restorative procedure on manikin. Demonstrate proper technique and troubleshooting.',
    steps: [
      'Select appropriate clamp for tooth',
      'Punch hole in rubber dam at correct position',
      'Test clamp stability on tooth',
      'Apply clamp to tooth',
      'Stretch rubber dam over clamp',
      'Pass dam through contact points with floss',
      'Secure dam on frame',
      'Invert dam margins around tooth',
      'Check for complete isolation',
      'Ensure patient comfort and breathing',
      'Troubleshoot leakage if present',
      'Maintain isolation throughout procedure',
      'Remove dam carefully after procedure',
      'Check for dam fragments'
    ]
  },
  {
    title: 'Suturing Technique',
    subjectName: 'Oral Surgery I',
    skillNames: [],
    description: 'Place simple interrupted sutures on practice pad. Demonstrate proper technique, knot tying, and instrument handling.',
    steps: [
      'Select appropriate suture material and needle',
      'Load needle in needle holder correctly (2/3 from point)',
      'Grasp tissue edge with forceps',
      'Insert needle perpendicular to tissue',
      'Drive needle through tissue in curved path',
      'Grasp needle point and pull through',
      'Repeat on opposite tissue edge',
      'Tie square knot (surgeon\'s knot)',
      'Place 3-4 throws for security',
      'Cut suture leaving 3mm tail',
      'Check suture tension (not too tight)',
      'Ensure wound edges are approximated',
      'Place additional sutures as needed',
      'Demonstrate suture removal technique'
    ]
  },
  {
    title: 'Impression Taking',
    subjectName: 'Prosthodontics I',
    skillNames: ['Impression Taking Techniques'],
    description: 'Take alginate impression of maxillary arch on manikin. Demonstrate proper mixing, loading, and technique.',
    steps: [
      'Select appropriate tray size',
      'Measure correct water and powder ratio',
      'Mix alginate to smooth, creamy consistency',
      'Load tray evenly, more material in anterior',
      'Wipe small amount on occlusal surfaces',
      'Seat tray from posterior to anterior',
      'Center tray over arch',
      'Hold tray steady until material sets',
      'Check for complete setting',
      'Break seal before removal',
      'Remove with quick snap motion',
      'Inspect impression for accuracy and completeness',
      'Rinse and disinfect impression',
      'Pour model within appropriate time'
    ]
  },
  {
    title: 'Periodontal Probing Technique',
    subjectName: 'Periodontology',
    skillNames: ['Periodontal Examination and Probing'],
    description: 'Perform periodontal probing on manikin. Demonstrate proper technique, angulation, and recording.',
    steps: [
      'Select appropriate periodontal probe',
      'Establish proper grasp and finger rest',
      'Insert probe gently into sulcus',
      'Keep probe parallel to long axis of tooth',
      'Walk probe around tooth at 6 points',
      'Measure mesiobuccal probing depth',
      'Measure midbuccal probing depth',
      'Measure distobuccal probing depth',
      'Repeat on lingual/palatal surface',
      'Note bleeding on probing',
      'Record all measurements accurately',
      'Assess furcation involvement on molars',
      'Check tooth mobility',
      'Communicate findings to patient'
    ]
  },

  // ============================================
  // RADIOGRAPHIC INTERPRETATION STATIONS
  // ============================================
  {
    title: 'Radiographic Interpretation: Caries Detection',
    subjectName: 'Dental Radiology',
    skillNames: ['Radiographic Interpretation'],
    description: 'Identify and classify carious lesions on bitewing radiographs. Demonstrate systematic interpretation.',
    steps: [
      'Check radiograph quality and orientation',
      'Systematically examine all teeth',
      'Identify radiolucent areas indicating caries',
      'Classify caries depth (enamel, dentin, pulpal)',
      'Assess interproximal caries',
      'Evaluate occlusal caries',
      'Check for recurrent caries around restorations',
      'Assess bone levels',
      'Identify calculus deposits',
      'Note any other pathology',
      'Correlate radiographic findings with clinical exam',
      'Develop treatment plan based on findings',
      'Document all radiographic findings',
      'Communicate findings to patient'
    ]
  },
  {
    title: 'Radiographic Interpretation: Periapical Pathology',
    subjectName: 'Dental Radiology',
    skillNames: ['Radiographic Interpretation'],
    description: 'Identify periapical pathology on periapical radiographs. Differentiate normal anatomy from pathology.',
    steps: [
      'Orient radiograph correctly',
      'Identify tooth in question',
      'Examine periapical region systematically',
      'Identify radiolucent or radiopaque lesions',
      'Assess lamina dura integrity',
      'Evaluate periodontal ligament space',
      'Measure lesion size if present',
      'Assess lesion borders (well-defined vs diffuse)',
      'Check for root resorption',
      'Evaluate quality of existing root canal treatment',
      'Differentiate periapical abscess from cyst from granuloma',
      'Identify normal anatomical structures (mental foramen, incisive canal)',
      'Formulate differential diagnosis',
      'Recommend appropriate treatment'
    ]
  },

  // ============================================
  // PEDIATRIC DENTISTRY STATIONS
  // ============================================
  {
    title: 'Child Behavior Management',
    subjectName: 'Pediatric Dentistry (Pedodontics)',
    skillNames: [],
    description: 'Manage uncooperative 5-year-old child for dental examination. Use appropriate behavior guidance techniques.',
    steps: [
      'Greet child at eye level with friendly manner',
      'Use age-appropriate language',
      'Establish rapport through conversation about interests',
      'Use tell-show-do technique for all procedures',
      'Demonstrate equipment on parent or stuffed animal first',
      'Give positive reinforcement for cooperation',
      'Use distraction techniques (counting, stories)',
      'Avoid negative words (pain, hurt, needle, drill)',
      'Use euphemisms (sleepy juice, tooth counter, water spray)',
      'Allow child some control (raise hand to stop)',
      'Involve parent appropriately',
      'Use voice control if needed',
      'Remain calm and patient',
      'End appointment on positive note with praise'
    ]
  },
  {
    title: 'Pediatric Oral Examination',
    subjectName: 'Pediatric Dentistry (Pedodontics)',
    skillNames: [],
    description: 'Perform comprehensive oral examination on 8-year-old child. Assess development, caries risk, and orthodontic needs.',
    steps: [
      'Review medical and dental history with parent',
      'Assess dietary and oral hygiene habits',
      'Examine extraoral structures and facial symmetry',
      'Assess dental development and eruption pattern',
      'Chart primary and permanent teeth present',
      'Identify caries in primary and permanent teeth',
      'Assess oral hygiene and gingival health',
      'Evaluate occlusion and bite relationship',
      'Check for crossbites, open bites, or crowding',
      'Assess need for space maintenance',
      'Evaluate habits (thumb sucking, tongue thrust)',
      'Perform caries risk assessment',
      'Discuss findings with parent and child',
      'Recommend preventive measures and treatment'
    ]
  },

  // ============================================
  // PROSTHODONTIC STATIONS
  // ============================================
  {
    title: 'Complete Denture Assessment',
    subjectName: 'Prosthodontics I',
    skillNames: [],
    description: 'Evaluate existing complete dentures for fit, retention, and occlusion. Identify problems and solutions.',
    steps: [
      'Interview patient about denture complaints',
      'Assess denture retention and stability',
      'Check denture extensions and borders',
      'Evaluate occlusal vertical dimension',
      'Assess centric relation and occlusion',
      'Check for balanced occlusion',
      'Examine denture base for cracks or fractures',
      'Assess artificial tooth wear',
      'Evaluate denture esthetics',
      'Examine supporting tissues for pathology',
      'Check for denture-induced stomatitis',
      'Assess need for reline, rebase, or remake',
      'Discuss findings and options with patient',
      'Develop treatment plan'
    ]
  },
  {
    title: 'Crown Preparation Evaluation',
    subjectName: 'Prosthodontics II',
    skillNames: ['Crown Preparation'],
    description: 'Evaluate crown preparation on typodont for adequacy. Identify deficiencies and corrections needed.',
    steps: [
      'Assess total occlusal reduction (1.5-2mm)',
      'Check axial reduction (1-1.5mm)',
      'Evaluate taper (6-10 degrees)',
      'Assess finish line design and placement',
      'Check finish line continuity',
      'Evaluate finish line depth (0.5-1mm)',
      'Assess occlusal anatomy preservation',
      'Check for undercuts',
      'Evaluate proximal clearance',
      'Assess surface smoothness',
      'Check for sharp line angles',
      'Evaluate retention and resistance form',
      'Identify any deficiencies',
      'Recommend corrections needed'
    ]
  },

  // ============================================
  // ENDODONTIC STATIONS
  // ============================================
  {
    title: 'Endodontic Diagnosis',
    subjectName: 'Endodontics',
    skillNames: [],
    description: 'Patient presents with tooth pain. Perform pulp testing and formulate endodontic diagnosis.',
    steps: [
      'Take detailed pain history (onset, duration, character)',
      'Identify specific tooth if possible',
      'Perform visual examination',
      'Perform percussion test',
      'Perform palpation test',
      'Perform cold test (refrigerant or ice)',
      'Perform heat test if indicated',
      'Perform electric pulp test',
      'Take periapical radiograph',
      'Assess pulp vitality status',
      'Formulate pulpal diagnosis (normal, reversible/irreversible pulpitis, necrosis)',
      'Formulate periapical diagnosis (normal, acute/chronic apical periodontitis, abscess)',
      'Explain diagnosis to patient',
      'Recommend appropriate treatment (observation, RCT, extraction)'
    ]
  },
  {
    title: 'Root Canal Working Length Determination',
    subjectName: 'Endodontics',
    skillNames: ['Access Cavity Preparation'],
    description: 'Determine working length for root canal treatment using radiographic and electronic methods.',
    steps: [
      'Review pre-operative radiograph',
      'Ensure proper access cavity',
      'Locate all canal orifices',
      'Negotiate canal with small file (#10 or #15)',
      'Take initial working length radiograph with file in place',
      'Measure file length on radiograph',
      'Calculate working length (1mm short of apex)',
      'Verify with electronic apex locator',
      'Confirm working length radiographically',
      'Adjust if needed',
      'Record working length for each canal',
      'Place reference point on tooth',
      'Use rubber stop on files at working length',
      'Verify working length throughout procedure'
    ]
  },

  // ============================================
  // ORTHODONTIC STATIONS
  // ============================================
  {
    title: 'Orthodontic Records and Analysis',
    subjectName: 'Orthodontics',
    skillNames: [],
    description: 'Perform orthodontic records collection and analysis. Classify malocclusion and identify treatment needs.',
    steps: [
      'Take extraoral photographs (frontal, profile, smile)',
      'Take intraoral photographs (anterior, right, left, occlusal)',
      'Take alginate impressions for study models',
      'Pour and trim study models',
      'Assess molar relationship (Angle Class I, II, III)',
      'Assess canine relationship',
      'Measure overjet and overbite',
      'Identify crowding or spacing',
      'Assess midline relationships',
      'Evaluate facial profile',
      'Perform cephalometric analysis if available',
      'Classify malocclusion',
      'Identify skeletal vs dental problems',
      'Formulate treatment objectives'
    ]
  },

  // ============================================
  // ORAL SURGERY STATIONS
  // ============================================
  {
    title: 'Pre-Surgical Assessment',
    subjectName: 'Oral Surgery II',
    skillNames: [],
    description: 'Assess patient scheduled for surgical extraction. Review medical history and identify risk factors.',
    steps: [
      'Review comprehensive medical history',
      'Identify systemic conditions affecting surgery',
      'Review current medications',
      'Assess bleeding risk (anticoagulants, antiplatelet drugs)',
      'Check for drug allergies',
      'Assess infection risk (diabetes, immunosuppression)',
      'Review vital signs',
      'Assess ASA classification',
      'Determine if medical consultation needed',
      'Review radiographs for surgical planning',
      'Assess difficulty of extraction',
      'Discuss procedure, risks, and alternatives',
      'Obtain informed consent',
      'Provide pre-operative and post-operative instructions'
    ]
  },
  {
    title: 'Post-Extraction Complications',
    subjectName: 'Oral Surgery II',
    skillNames: [],
    description: 'Patient returns 3 days post-extraction with severe pain. Diagnose and manage dry socket (alveolar osteitis).',
    steps: [
      'Take history of post-operative course',
      'Assess pain characteristics and severity',
      'Examine extraction site',
      'Look for exposed bone in socket',
      'Check for presence or absence of blood clot',
      'Assess for signs of infection',
      'Diagnose dry socket (alveolar osteitis)',
      'Irrigate socket gently with saline',
      'Place medicated dressing (eugenol paste)',
      'Prescribe analgesics',
      'Provide home care instructions',
      'Schedule follow-up in 24-48 hours',
      'Explain condition and expected healing',
      'Reassure patient'
    ]
  }
];

// ============================================
// MAIN SEEDING FUNCTION
// ============================================

async function seedOSCEStations() {
  try {
    console.log('🌱 Starting to seed OSCE Stations...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing OSCE Stations...');
    await OSCEStation.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Get all subjects and skills to map names to IDs
    console.log('📚 Fetching subjects and skills...');
    const subjects = await Subject.find({});
    const skills = await Skill.find({});

    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.name] = subject._id;
    });

    const skillMap = {};
    skills.forEach(skill => {
      skillMap[skill.title] = skill._id;
    });

    console.log(`✅ Found ${subjects.length} subjects and ${skills.length} skills\n`);

    // Prepare OSCE Stations with subjectId and skill IDs
    console.log('🏥 Creating OSCE Stations...');
    const stationsToCreate = osceStationsData.map(station => {
      const subjectId = subjectMap[station.subjectName];
      if (!subjectId) {
        console.warn(`⚠️  Warning: Subject "${station.subjectName}" not found for station "${station.title}"`);
        return null;
      }

      // Map skill names to IDs
      const skillIds = station.skillNames
        .map(skillName => skillMap[skillName])
        .filter(id => id !== undefined);

      return {
        title: station.title,
        subjectId: subjectId,
        skills: skillIds,
        description: station.description,
        steps: station.steps
      };
    }).filter(station => station !== null);

    const createdStations = await OSCEStation.insertMany(stationsToCreate);
    console.log(`✅ Created ${createdStations.length} OSCE stations\n`);

    // Display summary by category
    console.log('📊 SUMMARY BY CATEGORY:');
    console.log('═══════════════════════════════════════');

    const categories = {
      'Clinical Examination': 0,
      'Emergency Management': 0,
      'Communication & Patient Management': 0,
      'Practical Skills': 0,
      'Radiographic Interpretation': 0,
      'Pediatric Dentistry': 0,
      'Prosthodontics': 0,
      'Endodontics': 0,
      'Orthodontics': 0,
      'Oral Surgery': 0
    };

    createdStations.forEach(station => {
      if (station.title.includes('Examination') || station.title.includes('Assessment') && !station.title.includes('Pre-Surgical')) {
        categories['Clinical Examination']++;
      } else if (station.title.includes('Emergency')) {
        categories['Emergency Management']++;
      } else if (station.title.includes('Communication') || station.title.includes('Anxious') ||
                 station.title.includes('Consent') || station.title.includes('Breaking Bad News') ||
                 station.title.includes('Treatment Planning')) {
        categories['Communication & Patient Management']++;
      } else if (station.title.includes('Anesthesia') || station.title.includes('Rubber Dam') ||
                 station.title.includes('Suturing') || station.title.includes('Impression') ||
                 station.title.includes('Probing')) {
        categories['Practical Skills']++;
      } else if (station.title.includes('Radiographic')) {
        categories['Radiographic Interpretation']++;
      } else if (station.title.includes('Child') || station.title.includes('Pediatric')) {
        categories['Pediatric Dentistry']++;
      } else if (station.title.includes('Denture') || station.title.includes('Crown Preparation Evaluation')) {
        categories['Prosthodontics']++;
      } else if (station.title.includes('Endodontic') || station.title.includes('Root Canal')) {
        categories['Endodontics']++;
      } else if (station.title.includes('Orthodontic')) {
        categories['Orthodontics']++;
      } else if (station.title.includes('Surgical') || station.title.includes('Extraction')) {
        categories['Oral Surgery']++;
      }
    });

    Object.keys(categories).forEach(category => {
      if (categories[category] > 0) {
        console.log(`${category}: ${categories[category]} stations`);
      }
    });

    console.log('═══════════════════════════════════════');
    console.log(`\n✨ Total: ${createdStations.length} OSCE stations`);
    console.log('\n🎉 Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedOSCEStations();


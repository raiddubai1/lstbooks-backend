import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TreatmentProtocol from '../models/TreatmentProtocol.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

const protocolsData = [
  {
    title: "Class II Composite Restoration - Complete Protocol",
    description: "Comprehensive step-by-step protocol for restoring Class II cavities using posterior composite resin. Covers cavity preparation, isolation, bonding, and layering techniques for optimal esthetics and longevity.",
    category: "Operative Dentistry",
    subcategory: "Posterior Restorations",
    difficulty: "Intermediate",
    estimatedTime: "45-60 minutes",
    indications: [
      "Carious lesion on proximal surface of posterior tooth",
      "Replacement of defective amalgam or composite restoration",
      "Fractured cusp requiring restoration",
      "Patient preference for tooth-colored restoration"
    ],
    contraindications: [
      "Heavy occlusal forces in bruxism patients (relative)",
      "Inability to achieve adequate isolation",
      "Very deep subgingival margins",
      "Patient allergic to resin materials"
    ],
    prerequisites: [
      "Adequate local anesthesia",
      "Proper isolation (rubber dam preferred)",
      "Understanding of adhesive dentistry principles",
      "Knowledge of composite layering techniques"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Anesthesia and Isolation",
        description: "Administer local anesthesia (typically inferior alveolar block for mandibular teeth or infiltration for maxillary teeth). Place rubber dam for optimal isolation and moisture control.",
        duration: "5-10 minutes",
        materials: ["Local anesthetic", "Rubber dam", "Clamps", "Frame"],
        instruments: ["Syringe", "Rubber dam punch", "Forceps"],
        tips: ["Ensure complete anesthesia before starting", "Use wedges to protect interdental papilla"],
        warnings: ["Check for latex allergy before using rubber dam"]
      },
      {
        stepNumber: 2,
        title: "Cavity Preparation",
        description: "Remove all carious tissue using high-speed handpiece with copious water spray. Prepare cavity with proper retention and resistance form. Extend preparation to include all undermined enamel.",
        duration: "10-15 minutes",
        materials: ["Diamond burs", "Carbide burs", "Caries detector dye (optional)"],
        instruments: ["High-speed handpiece", "Slow-speed handpiece", "Excavators"],
        tips: ["Use caries detector to ensure complete removal", "Preserve tooth structure where possible", "Create smooth cavity walls"],
        warnings: ["Avoid pulp exposure - leave thin layer of affected dentin if near pulp", "Maintain adequate water cooling"]
      },
      {
        stepNumber: 3,
        title: "Matrix Band Placement",
        description: "Place sectional matrix system or circumferential matrix band to recreate proximal contour. Insert wooden wedge from lingual to ensure tight adaptation and prevent gingival overhang.",
        duration: "3-5 minutes",
        materials: ["Sectional matrix bands", "Separation rings", "Wooden wedges"],
        instruments: ["Matrix band holder", "Wedge placement forceps"],
        tips: ["Ensure matrix extends 1-2mm above marginal ridge", "Wedge should be snug but not cause blanching"],
        warnings: ["Avoid damaging interdental papilla with wedge"]
      },
      {
        stepNumber: 4,
        title: "Etching",
        description: "Apply 37% phosphoric acid etchant to enamel for 15-20 seconds and dentin for 10-15 seconds. Rinse thoroughly for 10-15 seconds and gently air dry.",
        duration: "2-3 minutes",
        materials: ["37% phosphoric acid gel", "Water spray"],
        instruments: ["Applicator tips", "Air-water syringe"],
        tips: ["Etch enamel margins first, then dentin", "Dentin should appear moist, not desiccated"],
        warnings: ["Do not over-dry dentin - maintain slight moisture", "Avoid etching soft tissue"]
      },
      {
        stepNumber: 5,
        title: "Bonding Agent Application",
        description: "Apply adhesive system according to manufacturer's instructions. Typically involves primer and bonding agent application with gentle air thinning and light curing for 20 seconds.",
        duration: "2-3 minutes",
        materials: ["Dental adhesive system", "Applicator brushes"],
        instruments: ["LED curing light", "Air syringe"],
        tips: ["Apply multiple coats for better bond strength", "Ensure complete coverage of all cavity walls"],
        warnings: ["Avoid contamination with saliva or blood", "Use adequate light intensity (>1000 mW/cm²)"]
      },
      {
        stepNumber: 6,
        title: "Composite Placement - Incremental Layering",
        description: "Place composite in 2mm increments to ensure adequate polymerization. Start with proximal box, then build occlusal portion. Light cure each layer for 40 seconds.",
        duration: "15-20 minutes",
        materials: ["Posterior composite resin", "Flowable composite (optional for base)"],
        instruments: ["Composite placement instruments", "LED curing light", "Burnishers"],
        tips: ["Use oblique incremental technique to minimize polymerization shrinkage", "Adapt composite to matrix band for proper contour", "Cure from multiple angles"],
        warnings: ["Do not exceed 2mm increment thickness", "Ensure complete polymerization before next layer"]
      },
      {
        stepNumber: 7,
        title: "Matrix Removal and Contouring",
        description: "Carefully remove matrix band and wedge. Check proximal contact with floss. Contour restoration using finishing burs and discs to achieve proper anatomy.",
        duration: "5-7 minutes",
        materials: ["Finishing burs", "Polishing discs", "Dental floss"],
        instruments: ["High-speed handpiece", "Slow-speed handpiece"],
        tips: ["Remove flash at gingival margin carefully", "Recreate natural occlusal anatomy"],
        warnings: ["Avoid damaging adjacent tooth when finishing proximal surface"]
      },
      {
        stepNumber: 8,
        title: "Occlusal Adjustment",
        description: "Check occlusion in centric and excursive movements using articulating paper. Adjust high spots carefully to achieve even contact with opposing teeth.",
        duration: "3-5 minutes",
        materials: ["Articulating paper"],
        instruments: ["Finishing burs", "Polishing points"],
        tips: ["Check occlusion before complete polymerization for easier adjustment", "Ensure smooth excursive movements"],
        warnings: ["Do not over-adjust - maintain proper contact"]
      },
      {
        stepNumber: 9,
        title: "Final Polishing",
        description: "Polish restoration using polishing burs, discs, and polishing paste to achieve smooth, glossy surface. This reduces plaque accumulation and improves esthetics.",
        duration: "5-7 minutes",
        materials: ["Polishing discs", "Polishing paste", "Polishing cups"],
        instruments: ["Slow-speed handpiece", "Prophy angle"],
        tips: ["Polish in sequence from coarse to fine", "Use wet polishing to avoid heat generation"],
        warnings: ["Avoid excessive pressure that could damage restoration"]
      },
      {
        stepNumber: 10,
        title: "Post-operative Instructions",
        description: "Advise patient about temporary sensitivity, proper oral hygiene, and when to return for follow-up. Explain that composite may feel slightly high initially due to anesthesia.",
        duration: "2-3 minutes",
        materials: ["Patient education materials"],
        instruments: [],
        tips: ["Document procedure in patient records", "Schedule follow-up if needed"],
        warnings: ["Warn patient not to eat until anesthesia wears off"]
      }
    ],
    requiredMaterials: [
      "Local anesthetic",
      "Rubber dam kit",
      "37% phosphoric acid etchant",
      "Dental adhesive system",
      "Posterior composite resin",
      "Matrix band system",
      "Wooden wedges",
      "Articulating paper",
      "Polishing materials"
    ],
    requiredInstruments: [
      "High-speed handpiece",
      "Slow-speed handpiece",
      "Diamond and carbide burs",
      "Composite placement instruments",
      "LED curing light",
      "Excavators",
      "Finishing and polishing burs"
    ],
    complications: [
      "Post-operative sensitivity (usually temporary)",
      "Marginal discoloration over time",
      "Secondary caries if margins not sealed properly",
      "Restoration fracture under heavy occlusal forces",
      "Pulp exposure during cavity preparation"
    ],
    postTreatmentCare: [
      "Avoid hard foods for 24 hours",
      "Maintain excellent oral hygiene",
      "Use desensitizing toothpaste if sensitivity persists",
      "Return if severe pain or restoration fracture occurs",
      "Regular dental check-ups every 6 months"
    ],
    followUp: "Review at 6 months to check restoration integrity, marginal adaptation, and occlusion. Annual radiographs to detect secondary caries.",
    evidenceLevel: "Level 1",
    references: [
      {
        title: "Clinical performance of posterior composite restorations: A systematic review",
        authors: "Opdam NJ, van de Sande FH, Bronkhorst E, et al.",
        journal: "Journal of Dentistry",
        year: 2014,
        doi: "10.1016/j.jdent.2014.07.014"
      }
    ],
    tags: ["composite", "class-ii", "posterior", "restoration", "operative-dentistry", "adhesive"],
    verified: true,
    featured: true
  },
  {
    title: "Root Canal Treatment - Single Rooted Tooth",
    description: "Complete endodontic protocol for root canal treatment of single-rooted anterior teeth. Covers access cavity preparation, cleaning and shaping, and obturation using lateral condensation technique.",
    category: "Endodontics",
    subcategory: "Root Canal Treatment",
    difficulty: "Intermediate",
    estimatedTime: "60-90 minutes",
    indications: [
      "Irreversible pulpitis with severe pain",
      "Necrotic pulp with or without periapical pathology",
      "Pulp exposure due to trauma or caries",
      "Elective endodontic treatment for prosthetic reasons"
    ],
    contraindications: [
      "Unrestorable tooth",
      "Vertical root fracture",
      "Severe periodontal disease with poor prognosis",
      "Patient medically compromised and unable to tolerate procedure"
    ],
    prerequisites: [
      "Preoperative radiograph for diagnosis and treatment planning",
      "Understanding of root canal anatomy",
      "Knowledge of endodontic instruments and materials",
      "Ability to achieve adequate isolation"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Diagnosis and Treatment Planning",
        description: "Confirm diagnosis through clinical examination and radiographic evaluation. Assess tooth restorability and discuss treatment options with patient.",
        duration: "10 minutes",
        materials: ["Radiographs", "Diagnostic instruments"],
        instruments: ["Explorer", "Periodontal probe", "Percussion instrument"],
        tips: ["Take multiple angulated radiographs", "Document all findings"],
        warnings: ["Ensure correct tooth identification"]
      },
      {
        stepNumber: 2,
        title: "Anesthesia and Isolation",
        description: "Administer local anesthesia and place rubber dam for complete isolation. This is critical for infection control and preventing aspiration of instruments.",
        duration: "5-10 minutes",
        materials: ["Local anesthetic", "Rubber dam", "Clamps"],
        instruments: ["Syringe", "Rubber dam punch", "Forceps"],
        tips: ["Use supplemental anesthesia if needed", "Ensure complete isolation"],
        warnings: ["Never perform RCT without rubber dam"]
      },
      {
        stepNumber: 3,
        title: "Access Cavity Preparation",
        description: "Create straight-line access to root canal using high-speed round bur. Remove all carious tissue and existing restorations. Access should be from lingual surface for anterior teeth.",
        duration: "10-15 minutes",
        materials: ["Diamond burs", "Carbide burs"],
        instruments: ["High-speed handpiece", "Endo-access burs"],
        tips: ["Ensure complete roof removal", "Preserve tooth structure"],
        warnings: ["Avoid perforation - stay centered"]
      },
      {
        stepNumber: 4,
        title: "Working Length Determination",
        description: "Determine working length using electronic apex locator and confirm with radiograph. Working length should be 0.5-1mm short of radiographic apex.",
        duration: "5-10 minutes",
        materials: ["K-files", "Apex locator"],
        instruments: ["Electronic apex locator", "Endodontic ruler"],
        tips: ["Use multiple methods for accuracy", "Document working length"],
        warnings: ["Do not force instruments beyond apex"]
      },
      {
        stepNumber: 5,
        title: "Cleaning and Shaping",
        description: "Clean and shape canal using rotary or hand instruments with crown-down technique. Irrigate frequently with sodium hypochlorite. Create apical stop at working length.",
        duration: "20-30 minutes",
        materials: ["Rotary NiTi files", "Sodium hypochlorite 2.5%", "EDTA 17%"],
        instruments: ["Endodontic motor", "Irrigation syringes", "Hand files"],
        tips: ["Maintain patency throughout", "Use copious irrigation"],
        warnings: ["Watch for instrument separation", "Avoid apical extrusion of irrigant"]
      },
      {
        stepNumber: 6,
        title: "Canal Obturation",
        description: "Dry canal with paper points and obturate using gutta-percha and sealer with lateral condensation technique. Ensure complete fill to working length.",
        duration: "15-20 minutes",
        materials: ["Gutta-percha points", "Endodontic sealer", "Paper points"],
        instruments: ["Spreaders", "Pluggers", "Heat carrier"],
        tips: ["Use sealer sparingly", "Achieve 3D obturation"],
        warnings: ["Do not overfill beyond apex"]
      },
      {
        stepNumber: 7,
        title: "Post-operative Radiograph and Restoration",
        description: "Take post-operative radiograph to confirm adequate obturation. Place temporary or permanent restoration to seal access cavity.",
        duration: "10 minutes",
        materials: ["Composite or GIC", "Bonding agent"],
        instruments: ["Radiograph sensor", "Composite instruments"],
        tips: ["Ensure complete seal", "Document final result"],
        warnings: ["Do not leave tooth open"]
      }
    ],
    requiredMaterials: [
      "Local anesthetic",
      "Rubber dam kit",
      "Endodontic files (rotary and hand)",
      "Sodium hypochlorite 2.5%",
      "EDTA 17%",
      "Gutta-percha points",
      "Endodontic sealer",
      "Paper points",
      "Temporary restoration material"
    ],
    requiredInstruments: [
      "High-speed handpiece",
      "Endodontic motor",
      "Electronic apex locator",
      "Irrigation syringes",
      "Spreaders and pluggers",
      "Radiograph equipment"
    ],
    complications: [
      "Instrument separation",
      "Perforation",
      "Ledge formation",
      "Apical extrusion of irrigant",
      "Persistent infection",
      "Post-operative pain"
    ],
    postTreatmentCare: [
      "Expect mild discomfort for 2-3 days",
      "Take prescribed analgesics as needed",
      "Avoid chewing on treated tooth until permanent restoration",
      "Return for permanent restoration within 2 weeks",
      "Contact dentist if severe pain or swelling occurs"
    ],
    followUp: "Review at 3 months, 6 months, and 1 year with radiographs to assess periapical healing. Complete healing may take up to 2 years.",
    evidenceLevel: "Level 1",
    references: [
      {
        title: "Outcome of primary root canal treatment: systematic review",
        authors: "Ng YL, Mann V, Rahbaran S, et al.",
        journal: "International Endodontic Journal",
        year: 2007,
        doi: "10.1111/j.1365-2591.2007.01322.x"
      }
    ],
    tags: ["endodontics", "root-canal", "rct", "obturation", "cleaning-shaping"],
    verified: true,
    featured: true
  },
  {
    title: "Simple Extraction - Single Rooted Tooth",
    description: "Step-by-step protocol for routine extraction of single-rooted teeth. Covers patient preparation, anesthesia, elevation, extraction, and post-operative care.",
    category: "Oral Surgery",
    subcategory: "Exodontia",
    difficulty: "Beginner",
    estimatedTime: "15-30 minutes",
    indications: [
      "Non-restorable tooth due to caries or fracture",
      "Severe periodontal disease",
      "Orthodontic treatment planning",
      "Impacted or malpositioned tooth causing problems",
      "Infection not responding to endodontic treatment"
    ],
    contraindications: [
      "Uncontrolled systemic disease",
      "Bleeding disorders without medical clearance",
      "Recent myocardial infarction (within 6 months)",
      "Bisphosphonate therapy (relative contraindication)"
    ],
    prerequisites: [
      "Preoperative radiograph",
      "Medical history review",
      "Informed consent obtained",
      "Understanding of surgical anatomy"
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Patient Preparation and Consent",
        description: "Review medical history, explain procedure, obtain informed consent. Discuss post-operative instructions and potential complications.",
        duration: "5 minutes",
        materials: ["Consent form", "Patient education materials"],
        instruments: [],
        tips: ["Address patient anxiety", "Explain what to expect"],
        warnings: ["Ensure no contraindications"]
      },
      {
        stepNumber: 2,
        title: "Local Anesthesia",
        description: "Administer adequate local anesthesia. For maxillary teeth, use infiltration. For mandibular teeth, use inferior alveolar nerve block plus buccal infiltration.",
        duration: "5-10 minutes",
        materials: ["Local anesthetic with vasoconstrictor"],
        instruments: ["Dental syringe", "Needles"],
        tips: ["Wait 5 minutes for full effect", "Test for adequate anesthesia"],
        warnings: ["Avoid intravascular injection"]
      },
      {
        stepNumber: 3,
        title: "Soft Tissue Reflection",
        description: "Use periosteal elevator to gently reflect gingival tissue around tooth. This provides better access and prevents tissue tearing.",
        duration: "2-3 minutes",
        materials: [],
        instruments: ["Periosteal elevator"],
        tips: ["Work gently to preserve tissue", "Reflect both buccal and lingual"],
        warnings: ["Avoid excessive force"]
      },
      {
        stepNumber: 4,
        title: "Luxation",
        description: "Insert straight elevator into PDL space and apply controlled force to expand alveolar bone and sever periodontal ligament fibers.",
        duration: "3-5 minutes",
        materials: [],
        instruments: ["Straight elevator", "Curved elevator"],
        tips: ["Use tooth as fulcrum, not alveolar bone", "Work circumferentially"],
        warnings: ["Do not use adjacent tooth as fulcrum"]
      },
      {
        stepNumber: 5,
        title: "Extraction",
        description: "Apply forceps to tooth, engage firmly, and deliver tooth using controlled rotational and traction movements. For single-rooted teeth, use rotation.",
        duration: "2-5 minutes",
        materials: [],
        instruments: ["Extraction forceps (appropriate for tooth)"],
        tips: ["Ensure firm grasp", "Use slow, controlled movements"],
        warnings: ["Avoid excessive force that could fracture tooth or bone"]
      },
      {
        stepNumber: 6,
        title: "Socket Inspection and Debridement",
        description: "Inspect socket for retained root fragments or pathology. Curette socket gently to remove granulation tissue. Irrigate with saline.",
        duration: "2-3 minutes",
        materials: ["Sterile saline"],
        instruments: ["Curette", "Irrigation syringe"],
        tips: ["Ensure complete removal of tooth", "Check for sharp bony edges"],
        warnings: ["Be gentle to preserve bone"]
      },
      {
        stepNumber: 7,
        title: "Hemostasis and Socket Management",
        description: "Compress socket walls digitally. Place gauze pack and have patient bite firmly for 30 minutes. Ensure adequate hemostasis before dismissing patient.",
        duration: "5 minutes",
        materials: ["Gauze packs", "Hemostatic agents if needed"],
        instruments: [],
        tips: ["Apply firm, continuous pressure", "Check for bleeding before discharge"],
        warnings: ["Do not dismiss patient with active bleeding"]
      },
      {
        stepNumber: 8,
        title: "Post-operative Instructions",
        description: "Provide verbal and written post-operative instructions. Prescribe analgesics and antibiotics if indicated. Schedule follow-up if needed.",
        duration: "5 minutes",
        materials: ["Written instructions", "Prescriptions"],
        instruments: [],
        tips: ["Ensure patient understands instructions", "Provide emergency contact"],
        warnings: ["Warn about dry socket risk"]
      }
    ],
    requiredMaterials: [
      "Local anesthetic",
      "Gauze packs",
      "Sterile saline",
      "Hemostatic agents (if needed)",
      "Sutures (if needed)"
    ],
    requiredInstruments: [
      "Dental syringe and needles",
      "Periosteal elevator",
      "Straight and curved elevators",
      "Extraction forceps",
      "Curettes",
      "Irrigation syringe"
    ],
    complications: [
      "Dry socket (alveolar osteitis)",
      "Excessive bleeding",
      "Root fracture",
      "Damage to adjacent teeth",
      "Nerve injury (rare for simple extractions)",
      "Infection"
    ],
    postTreatmentCare: [
      "Bite on gauze for 30 minutes",
      "Avoid rinsing for 24 hours",
      "No smoking for 48 hours",
      "Soft diet for 24 hours",
      "Take prescribed medications",
      "Apply ice packs for first 24 hours",
      "Gentle salt water rinses after 24 hours"
    ],
    followUp: "Return if excessive bleeding, severe pain, or signs of infection. Routine follow-up at 1 week if complications arise.",
    evidenceLevel: "Level 1",
    references: [
      {
        title: "Prevention of dry socket: A systematic review",
        authors: "Daly B, Sharif MO, Newton T, et al.",
        journal: "Journal of Dental Research",
        year: 2012,
        doi: "10.1177/0022034512450440"
      }
    ],
    tags: ["oral-surgery", "extraction", "exodontia", "simple-extraction", "basic-surgery"],
    verified: true,
    featured: true
  }
];

async function seedTreatmentProtocols() {
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

    // Clear existing protocols
    await TreatmentProtocol.deleteMany({});
    console.log('🗑️  Cleared existing treatment protocols');

    // Add createdBy to each protocol
    const protocolsWithUser = protocolsData.map(protocol => ({
      ...protocol,
      createdBy: user._id
    }));

    // Create protocols
    const createdProtocols = await TreatmentProtocol.insertMany(protocolsWithUser);
    console.log(`✅ Created ${createdProtocols.length} treatment protocol(s)`);

    console.log('\n📋 Treatment Protocols Created:');
    createdProtocols.forEach(protocol => {
      console.log(`   - ${protocol.title} (${protocol.category})`);
    });

    console.log('\n✅ Treatment Protocols seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding treatment protocols:', error);
    process.exit(1);
  }
}

seedTreatmentProtocols();


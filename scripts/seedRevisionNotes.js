import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RevisionNote from '../models/RevisionNote.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

// Real, professional revision notes for dental students
const revisionNotesData = [
  {
    title: "Dental Caries - Complete Overview",
    subject: "Operative Dentistry",
    year: "Year 2",
    topic: "Cariology",
    category: "theory",
    difficulty: "intermediate",
    content: `
# Dental Caries - Complete Revision Notes

## Definition
Dental caries is a **multifactorial, biofilm-mediated, dynamic disease** resulting in net mineral loss of dental hard tissues. It is determined by biological, behavioral, psychosocial, and environmental factors.

## Etiology - The Caries Balance

### Essential Factors (Keyes Triad + Time):
1. **Susceptible Host** (tooth)
2. **Cariogenic Bacteria** (biofilm)
3. **Fermentable Carbohydrates** (substrate)
4. **Time** (frequency of exposure)

### Cariogenic Bacteria:
- **Streptococcus mutans** - initiation
- **Lactobacilli** - progression
- **Actinomyces** - root caries

## Pathogenesis

### The Demineralization Process:
1. Bacteria metabolize sugars → produce acid
2. pH drops below **critical pH (5.5)** for enamel
3. Hydroxyapatite dissolves: Ca₁₀(PO₄)₆(OH)₂
4. Calcium and phosphate ions lost
5. Subsurface lesion forms (white spot)

### Remineralization:
- Saliva buffers acid (bicarbonate, phosphate)
- Calcium and phosphate redeposit
- **Fluoride** enhances remineralization → fluorapatite (more resistant)

## Classification

### By Location:
- **Pit and Fissure** (occlusal) - 80-90% of caries
- **Smooth Surface** (proximal, buccal, lingual)
- **Root Surface** (cementum/dentin)

### By Progression:
- **Incipient** - enamel only, reversible
- **Moderate** - into dentin
- **Advanced** - deep dentin, near pulp
- **Arrested** - inactive, remineralized

### By Activity:
- **Active** - soft, light-colored, progressing
- **Inactive/Arrested** - hard, dark, stable

## Clinical Features

### Enamel Caries:
- **White spot lesion** - earliest clinical sign
- Chalky, opaque appearance
- Subsurface demineralization
- Surface intact initially

### Dentin Caries:
- **Infected dentin** - outer, bacteria present, remove
- **Affected dentin** - inner, demineralized but remineralizable, preserve
- Softer consistency
- Discoloration (yellow-brown)

## Diagnosis

### Visual Examination:
- Clean, dry teeth
- Good lighting
- Look for: opacity, cavitation, discoloration

### Tactile:
- Gentle probing (avoid cavitation)
- Assess texture: soft vs hard

### Radiographic:
- **Bitewings** - best for proximal caries
- Radiolucency indicates mineral loss
- Underestimates true extent

### Advanced Methods:
- **ICDAS** (International Caries Detection and Assessment System)
- **Laser fluorescence** (DIAGNOdent)
- **Fiber-optic transillumination** (FOTI)

## Prevention

### Fluoride:
- **Systemic** - water fluoridation (0.7-1.2 ppm)
- **Topical** - toothpaste (1000-1500 ppm), varnish (22,600 ppm)
- Mechanism: promotes remineralization, inhibits demineralization

### Diet Modification:
- Reduce frequency of sugar intake
- Avoid sticky, retentive foods
- Limit acidic beverages

### Oral Hygiene:
- Brush 2x daily with fluoride toothpaste
- Floss daily
- Disrupt biofilm formation

### Sealants:
- Resin-based or GIC
- Seal pits and fissures
- 80% reduction in occlusal caries

## Treatment

### Non-Invasive:
- **Remineralization** - fluoride varnish, CPP-ACP
- **Infiltration** - resin infiltration (Icon)
- **Arrest** - SDF (Silver Diamine Fluoride) 38%

### Minimally Invasive:
- Remove infected dentin only
- Preserve tooth structure
- Adhesive restorations

### Restorative:
- **Composite** - esthetic, adhesive
- **Amalgam** - durable, cost-effective
- **GIC** - fluoride release, intermediate
- **Indirect** - inlay, onlay, crown (extensive)

## Key Points for Exams:
✓ Caries is a **dynamic disease** - balance between de/remineralization
✓ Critical pH for enamel = **5.5**
✓ S. mutans initiates, Lactobacilli progress
✓ White spot = **earliest reversible** stage
✓ Fluoride works **topically** (not systemically in adults)
✓ Prevention > Treatment
✓ Preserve tooth structure - minimal intervention
    `,
    keyPoints: [
      "Caries is multifactorial: host + bacteria + substrate + time",
      "Critical pH for enamel demineralization = 5.5",
      "White spot lesion is earliest clinical sign and is reversible",
      "S. mutans initiates caries, Lactobacilli cause progression",
      "Fluoride promotes remineralization and forms fluorapatite",
      "ICDAS system standardizes caries detection",
      "Infected dentin (remove) vs Affected dentin (preserve)",
      "Prevention strategies: fluoride, diet, hygiene, sealants",
      "SDF (38%) can arrest active caries non-invasively",
      "Minimal intervention dentistry preserves tooth structure"
    ],
    mnemonics: [
      {
        acronym: "BATS",
        meaning: "Caries Risk Factors",
        explanation: "Bacteria, Acid (diet), Time, Susceptible host"
      },
      {
        acronym: "RID",
        meaning: "Fluoride Mechanisms",
        explanation: "Remineralization (promotes), Inhibits demineralization, Disrupts bacterial metabolism"
      },
      {
        acronym: "VERT",
        meaning: "Caries Diagnosis Methods",
        explanation: "Visual, Electrical, Radiographic, Tactile"
      }
    ],
    diagrams: [
      {
        title: "Stephan Curve",
        description: "Shows pH changes in dental plaque after sugar exposure. pH drops below critical level (5.5) causing demineralization, then saliva buffers return pH to normal.",
        imageUrl: "https://example.com/stephan-curve.jpg"
      },
      {
        title: "Caries Balance",
        description: "Diagram showing protective factors (fluoride, saliva, diet) vs pathological factors (bacteria, substrate, time) determining caries risk.",
        imageUrl: "https://example.com/caries-balance.jpg"
      }
    ],
    tags: ["caries", "cariology", "demineralization", "fluoride", "prevention", "operative dentistry"],
    estimatedReadTime: 15,
    difficulty: "intermediate"
  },

  {
    title: "Local Anesthesia in Dentistry",
    subject: "Oral Surgery",
    year: "Year 2",
    topic: "Pain Management",
    category: "clinical",
    difficulty: "intermediate",
    content: `
# Local Anesthesia - Complete Revision Notes

## Definition
Local anesthesia is the **temporary loss of sensation** in a circumscribed area of the body caused by depression of excitation in nerve endings or inhibition of conduction in peripheral nerves.

## Mechanism of Action

### Nerve Physiology:
- Resting potential: **-70mV** (inside negative)
- Action potential: rapid depolarization
- Sodium channels open → Na⁺ influx → depolarization
- Potassium channels open → K⁺ efflux → repolarization

### How Local Anesthetics Work:
1. Cross nerve membrane (lipid-soluble form)
2. Bind to **sodium channels** (intracellular side)
3. Block sodium influx
4. Prevent depolarization
5. Stop nerve impulse transmission

## Chemistry

### Structure:
**Aromatic ring - Intermediate chain - Amino group**

### Types by Intermediate Chain:
1. **Esters** (metabolized by plasma cholinesterase)
   - Procaine, Benzocaine
   - Higher allergy risk (PABA metabolite)
   - Rarely used now

2. **Amides** (metabolized in liver)
   - **Lidocaine** - most common
   - **Articaine** - high tissue penetration
   - **Mepivacaine** - no vasoconstrictor needed
   - **Bupivacaine** - long duration
   - Lower allergy risk

### pKa and Onset:
- **pKa** = pH at which 50% ionized/50% unionized
- Lower pKa → more unionized at tissue pH → faster onset
- Lidocaine pKa = 7.9 (moderate onset)
- Mepivacaine pKa = 7.6 (faster onset)

## Vasoconstrictors

### Purpose:
- Decrease blood flow → slower absorption
- Prolong duration of anesthesia
- Reduce systemic toxicity
- Improve depth of anesthesia
- Reduce bleeding

### Types:
1. **Epinephrine** (Adrenaline)
   - Most common: 1:100,000 or 1:200,000
   - α and β adrenergic effects

2. **Levonordefrin** (Neo-Cobefrin)
   - 1:20,000 concentration
   - Mainly α effects

### Contraindications:
- Uncontrolled hyperthyroidism
- Severe cardiovascular disease
- Recent MI (< 6 months)
- Uncontrolled diabetes
- Pheochromocytoma
- Drug interactions: MAOIs, tricyclic antidepressants

## Common Local Anesthetic Solutions

### 1. Lidocaine 2% with Epinephrine 1:100,000
- **Onset**: 2-3 minutes
- **Duration**: Pulpal 60 min, Soft tissue 3-5 hours
- **Maximum dose**: 4.4 mg/kg (max 300mg)
- **Cartridge**: 1.8ml = 36mg lidocaine
- **Most commonly used**

### 2. Articaine 4% with Epinephrine 1:100,000
- **Onset**: 1-2 minutes (fastest)
- **Duration**: Pulpal 60-75 min
- **Maximum dose**: 7 mg/kg (max 500mg)
- **Advantage**: Better tissue penetration (buccal infiltration)

### 3. Mepivacaine 3% (Plain)
- **Onset**: 1.5-2 minutes
- **Duration**: Pulpal 20-40 min (shorter without vasoconstrictor)
- **Use**: Patients with vasoconstrictor contraindications

### 4. Bupivacaine 0.5% with Epinephrine 1:200,000
- **Onset**: 6-10 minutes (slowest)
- **Duration**: Pulpal 90-180 min, Soft tissue 4-9 hours (longest)
- **Use**: Long procedures, post-op pain control

## Injection Techniques

### Maxillary Injections:

**1. Infiltration (Supraperiosteal)**
- Most common in maxilla
- Deposit above apex of tooth
- Anesthetizes terminal nerve branches
- Success rate: 95%+

**2. Posterior Superior Alveolar (PSA)**
- Anesthetizes: maxillary molars (except MB root of 1st molar)
- Landmark: mucobuccal fold above 2nd molar
- Angle: 45° upward, inward, backward
- Risk: hematoma (pterygoid plexus)

**3. Middle Superior Alveolar (MSA)**
- Anesthetizes: premolars, MB root of 1st molar
- Not always present (40% of population)

**4. Anterior Superior Alveolar (ASA) / Infraorbital**
- Anesthetizes: canine to central incisor
- Landmark: infraorbital foramen
- Palpate foramen, deposit below it

**5. Nasopalatine**
- Anesthetizes: palatal tissue anterior teeth
- Landmark: incisive papilla
- Very painful - use topical first

**6. Greater Palatine**
- Anesthetizes: palatal tissue premolars/molars
- Landmark: junction of hard/soft palate, medial to 2nd molar

### Mandibular Injections:

**1. Inferior Alveolar Nerve Block (IANB)**
- **Most important mandibular injection**
- Anesthetizes: all mandibular teeth on one side, lower lip, chin
- Landmarks:
  - Coronoid notch (anterior)
  - Pterygomandibular raphe (medial)
  - Occlusal plane of mandibular molars (height)
- Technique:
  - Barrel parallel to occlusal plane
  - Inject lateral to pterygomandibular raphe
  - Advance until bone contact (15-25mm)
  - Aspirate, deposit slowly
- Success rate: 80-85%
- Lingual nerve anesthetized too

**2. Buccal Nerve Block**
- Anesthetizes: buccal gingiva of molars
- Supplement to IANB
- Deposit in mucobuccal fold distal to last molar

**3. Mental Nerve Block**
- Anesthetizes: lower lip, chin, buccal gingiva premolars
- Landmark: mental foramen (between premolar apices)

**4. Incisive Nerve Block**
- Anesthetizes: premolars to central incisor (pulpal)
- Same injection site as mental block
- Hold pressure over foramen

**5. Gow-Gates**
- Alternative to IANB
- Higher success rate (95%+)
- Anesthetizes: IAN, lingual, mylohyoid, auriculotemporal, buccal
- Landmark: mesiopalatal cusp of maxillary 2nd molar
- Patient opens wide

## Complications

### During Injection:

**1. Pain**
- Causes: rapid injection, acidic solution, hitting periosteum
- Prevention: slow injection, warm cartridge, proper technique

**2. Needle Breakage**
- Rare with modern needles
- Prevention: don't bend needles, don't insert to hub

**3. Hematoma**
- Common with PSA block
- Management: pressure, ice, reassure patient

### After Injection:

**1. Prolonged Anesthesia**
- Normal duration exceeded
- Causes: nerve trauma, hemorrhage into sheath
- Usually resolves in weeks-months

**2. Paresthesia**
- Persistent altered sensation
- Risk: lingual nerve (IANB), inferior alveolar nerve
- Higher risk with Articaine in IANB
- Most resolve spontaneously

**3. Trismus**
- Limited mouth opening
- Causes: muscle trauma, hematoma, infection
- Management: heat, analgesics, muscle relaxants

**4. Facial Nerve Paralysis**
- Temporary Bell's palsy
- Cause: anesthetic deposited in parotid gland (too posterior)
- Resolves when anesthetic wears off (2-3 hours)

**5. Self-Inflicted Trauma**
- Lip/tongue biting while numb
- Prevention: warn patient, especially children

### Systemic Complications:

**1. Toxicity**
- Overdose or intravascular injection
- CNS: tingling, tinnitus, seizures
- CVS: hypotension, arrhythmias, cardiac arrest
- Management: stop injection, ABC, benzodiazepines for seizures

**2. Allergy**
- True allergy rare (<1%)
- More common with esters
- Symptoms: rash, urticaria, anaphylaxis
- Management: antihistamines, epinephrine if severe

**3. Syncope (Fainting)**
- Most common emergency
- Vasovagal response (anxiety)
- Prevention: reassure patient, supine position
- Management: Trendelenburg position, ammonia inhalant

## Key Points for Exams:
✓ Amides metabolized in **liver**, esters in **plasma**
✓ Local anesthetics block **sodium channels**
✓ Lower pKa = faster onset
✓ Lidocaine 2% with epi 1:100,000 = **most common**
✓ Max lidocaine dose = **4.4 mg/kg** (max 300mg)
✓ IANB success rate = **80-85%** (lowest of all blocks)
✓ PSA risk = **hematoma**
✓ Articaine = best **tissue penetration**
✓ Bupivacaine = **longest duration**
✓ Most common emergency = **syncope**
    `,
    keyPoints: [
      "Local anesthetics block voltage-gated sodium channels",
      "Amides (lidocaine, articaine) metabolized in liver - safer than esters",
      "Vasoconstrictors prolong duration and reduce systemic toxicity",
      "Lidocaine 2% with epi 1:100,000 is most commonly used",
      "Maximum lidocaine dose: 4.4 mg/kg (max 300mg total)",
      "IANB has 80-85% success rate - lowest of all blocks",
      "PSA block risk: hematoma from pterygoid plexus",
      "Articaine has best tissue penetration for infiltrations",
      "Bupivacaine provides longest duration (90-180 min pulpal)",
      "Syncope (fainting) is most common dental emergency"
    ],
    mnemonics: [
      {
        acronym: "HUMID",
        meaning: "Vasoconstrictor Contraindications",
        explanation: "Hyperthyroidism (uncontrolled), Uncontrolled diabetes, MI (recent), Interactions (MAOIs), Drug abuse (cocaine)"
      },
      {
        acronym: "COP",
        meaning: "IANB Landmarks",
        explanation: "Coronoid notch, Occlusal plane, Pterygomandibular raphe"
      },
      {
        acronym: "SLUD",
        meaning: "Toxicity Symptoms",
        explanation: "Seizures, Lightheadedness, Unconsciousness, Death (severe progression)"
      }
    ],
    diagrams: [],
    tags: ["local anesthesia", "pain management", "injection techniques", "pharmacology", "oral surgery"],
    estimatedReadTime: 18,
    difficulty: "intermediate"
  },

  {
    title: "Periodontal Disease - Classification and Management",
    subject: "Periodontics",
    year: "Year 3",
    topic: "Periodontal Pathology",
    category: "theory",
    difficulty: "intermediate",
    content: `
# Periodontal Disease - Complete Revision Notes

## Definition
Periodontal disease encompasses **inflammatory conditions affecting the supporting structures of teeth** (gingiva, periodontal ligament, cementum, alveolar bone).

## Classification (2017 AAP/EFP)

### Health and Gingival Diseases:
1. **Periodontal Health**
   - Intact periodontium
   - Reduced periodontium (stable patient)

2. **Gingivitis**
   - Plaque-induced
   - Non-plaque-induced (rare)

### Periodontitis:
1. **Necrotizing Periodontal Diseases**
   - Necrotizing gingivitis (NUG)
   - Necrotizing periodontitis (NUP)

2. **Periodontitis**
   - Staging (I-IV): Severity and complexity
   - Grading (A-C): Rate of progression

3. **Periodontitis as Manifestation of Systemic Disease**

## Etiology and Pathogenesis

### Primary Etiologic Factor:
**Bacterial Biofilm (Dental Plaque)**

### Key Pathogens (Red Complex):
- **Porphyromonas gingivalis**
- **Tannerella forsythia**
- **Treponema denticola**

### Orange Complex (precursors):
- Fusobacterium nucleatum
- Prevotella intermedia

### Pathogenesis:
1. Plaque accumulation
2. Host immune response
3. Inflammatory mediators (IL-1, TNF-α, PGE₂)
4. Tissue destruction (collagenase, MMPs)
5. Bone resorption (osteoclast activation)

## Risk Factors

### Modifiable:
- **Smoking** (most significant)
- Poor oral hygiene
- Diabetes (uncontrolled)
- Stress
- Obesity

### Non-Modifiable:
- Genetics (IL-1 polymorphism)
- Age
- Gender (males > females)

## Clinical Features

### Gingivitis:
- Red, swollen gingiva
- Bleeding on probing (BOP)
- No attachment loss
- **Reversible**

### Periodontitis:
- All gingivitis signs PLUS:
- **Attachment loss** (CAL)
- **Pocket formation** (PD > 3mm)
- **Bone loss** (radiographic)
- Tooth mobility
- Drifting/spacing
- **Irreversible**

## Diagnosis

### Clinical Examination:
1. **Probing Depth (PD)**
   - Distance from gingival margin to pocket base
   - Normal: ≤3mm

2. **Clinical Attachment Level (CAL)**
   - Distance from CEJ to pocket base
   - Gold standard for attachment loss

3. **Bleeding on Probing (BOP)**
   - Indicator of inflammation
   - Positive predictive value low
   - Negative predictive value high (absence = health)

4. **Mobility**
   - Grade 0: Normal
   - Grade I: <1mm horizontal
   - Grade II: >1mm horizontal
   - Grade III: Vertical movement

5. **Furcation Involvement**
   - Grade I: Horizontal <3mm
   - Grade II: Horizontal >3mm, not through-and-through
   - Grade III: Through-and-through

### Radiographic Assessment:
- **Bitewings**: Interproximal bone levels
- **Periapicals**: Complete bone assessment
- **Panoramic**: Screening, bone loss pattern

### Bone Loss Patterns:
- **Horizontal**: Most common, uniform
- **Vertical/Angular**: Defect adjacent to tooth

## Staging and Grading (2017 Classification)

### Staging (Severity):
- **Stage I**: Initial (CAL 1-2mm, RBL <15%)
- **Stage II**: Moderate (CAL 3-4mm, RBL 15-33%)
- **Stage III**: Severe (CAL ≥5mm, RBL >33%, tooth loss ≤4)
- **Stage IV**: Very severe (CAL ≥5mm, tooth loss ≥5, secondary occlusal trauma)

### Grading (Progression):
- **Grade A**: Slow (RBL/age <0.25)
- **Grade B**: Moderate (RBL/age 0.25-1.0)
- **Grade C**: Rapid (RBL/age >1.0)

Modifiers: Smoking, Diabetes

## Treatment

### Phase 1: Cause-Related Therapy
1. **Oral Hygiene Instruction (OHI)**
   - Bass technique
   - Interdental cleaning

2. **Scaling and Root Planing (SRP)**
   - Remove plaque and calculus
   - Smooth root surface
   - Hand instruments or ultrasonic

3. **Risk Factor Modification**
   - Smoking cessation
   - Diabetes control

4. **Re-evaluation (6-8 weeks)**
   - Assess healing
   - Determine need for Phase 2

### Phase 2: Surgical Therapy
(If PD >5mm persists after Phase 1)

1. **Resective Surgery**
   - Gingivectomy
   - Apically positioned flap
   - Osseous surgery

2. **Regenerative Surgery**
   - Bone grafts
   - GTR (Guided Tissue Regeneration)
   - Enamel matrix derivative (Emdogain)

3. **Mucogingival Surgery**
   - Free gingival graft
   - Connective tissue graft
   - Coronally advanced flap

### Phase 3: Restorative Phase
- Replace missing teeth
- Restore damaged teeth
- Correct occlusion

### Phase 4: Maintenance (SPT)
**Supportive Periodontal Therapy**
- Recall every 3-6 months
- Professional cleaning
- Monitor for recurrence
- Reinforce OHI

## Necrotizing Periodontal Diseases

### NUG (Necrotizing Ulcerative Gingivitis):
**Clinical Features:**
- Punched-out papillae
- Pseudomembrane
- Severe pain
- Bleeding
- Halitosis
- Fever, malaise

**Risk Factors:**
- Stress
- Smoking
- Immunosuppression (HIV)
- Malnutrition

**Treatment:**
- Gentle debridement
- **Metronidazole 400mg TDS 3 days**
- Chlorhexidine 0.12% rinse
- Pain relief
- OHI (after acute phase)

## Key Points for Exams:
✓ Periodontitis = **irreversible** attachment loss
✓ CAL is **gold standard** for diagnosis
✓ Red complex bacteria: **P. gingivalis, T. forsythia, T. denticola**
✓ **Smoking** is most significant modifiable risk factor
✓ BOP negative = **high predictive value for health**
✓ 2017 classification: **Staging (severity) + Grading (progression)**
✓ SRP is **cornerstone** of periodontal therapy
✓ SPT recall: **3-6 months**
✓ NUG treatment: **Metronidazole + gentle debridement**
✓ Furcation Grade III = **through-and-through**
    `,
    keyPoints: [
      "Periodontitis involves irreversible attachment loss and bone loss",
      "CAL (Clinical Attachment Level) is gold standard for diagnosis",
      "Red complex bacteria: P. gingivalis, T. forsythia, T. denticola",
      "Smoking is the most significant modifiable risk factor",
      "2017 classification: Staging (I-IV) for severity, Grading (A-C) for progression",
      "BOP negative has high predictive value for periodontal health",
      "Scaling and Root Planing (SRP) is cornerstone of treatment",
      "Re-evaluation at 6-8 weeks post-SRP determines need for surgery",
      "Supportive Periodontal Therapy (SPT) every 3-6 months is essential",
      "NUG treated with metronidazole 400mg TDS for 3 days + gentle debridement"
    ],
    mnemonics: [
      {
        acronym: "PTT",
        meaning: "Red Complex Bacteria",
        explanation: "Porphyromonas gingivalis, Tannerella forsythia, Treponema denticola"
      },
      {
        acronym: "CSRM",
        meaning: "Periodontal Treatment Phases",
        explanation: "Cause-related, Surgical, Restorative, Maintenance"
      },
      {
        acronym: "PAINFUL",
        meaning: "NUG Clinical Features",
        explanation: "Punched-out papillae, Acute onset, Inflammation, Necrosis, Fetid odor, Ulceration, Lymphadenopathy"
      }
    ],
    diagrams: [],
    tags: ["periodontics", "periodontitis", "gingivitis", "periodontal disease", "classification"],
    estimatedReadTime: 16,
    difficulty: "intermediate"
  },

  {
    title: "Dental Radiography - Techniques and Interpretation",
    subject: "Oral Radiology",
    year: "Year 2",
    topic: "Imaging",
    category: "practical",
    difficulty: "basic",
    content: `
# Dental Radiography - Complete Revision Notes

## Types of Dental Radiographs

### Intraoral:
1. **Periapical** - entire tooth + surrounding bone
2. **Bitewing** - crowns + alveolar crest
3. **Occlusal** - larger area, occlusal plane

### Extraoral:
1. **Panoramic (OPG)** - all teeth and jaws
2. **Lateral Cephalometric** - orthodontic analysis
3. **CBCT** - 3D imaging

## Radiation Physics Basics

### X-ray Production:
- Electrons hit tungsten target
- Kinetic energy → X-rays (1%)
- Heat (99%)

### Properties:
- Electromagnetic radiation
- Travel at speed of light
- Penetrate matter
- Cause ionization

### Factors Affecting Image:
1. **kVp** (kilovoltage peak)
   - Penetrating power
   - Contrast (lower kVp = higher contrast)
   - Dental: 60-70 kVp

2. **mA** (milliamperage)
   - Quantity of X-rays
   - Density

3. **Time** (seconds)
   - Exposure duration
   - Density

## Radiation Protection

### ALARA Principle:
**As Low As Reasonably Achievable**

### Protection Methods:

**1. Justification**
- Only take necessary radiographs
- Clinical examination first

**2. Optimization**
- Proper technique
- Collimation (rectangular > circular)
- Filtration (aluminum)
- Fast film/digital sensors
- Lead apron + thyroid collar

**3. Dose Limitation**
- Occupational limits
- Public limits

### Operator Protection:
- Stand **6 feet away** at **90-135° angle**
- Never hold film/sensor
- Lead barriers

## Periapical Radiography

### Paralleling Technique (Preferred):
**Principle**: Film parallel to long axis of tooth

**Advantages:**
- Accurate representation
- Minimal distortion
- Reproducible

**Disadvantages:**
- Requires film holders
- Uncomfortable for patient
- Difficult in children

**Technique:**
- Film parallel to tooth
- X-ray beam perpendicular to both
- Use film holder (XCP)

### Bisecting Angle Technique:
**Principle**: Beam perpendicular to imaginary bisector

**Advantages:**
- No film holder needed
- More comfortable
- Useful in children

**Disadvantages:**
- Dimensional distortion
- Foreshortening/elongation
- Less reproducible

**Technique:**
- Bisect angle between tooth and film
- Beam perpendicular to bisector

## Bitewing Radiography

### Purpose:
- Detect **interproximal caries**
- Assess **alveolar bone levels**
- Evaluate restorations

### Technique:
- Film positioned between teeth
- Patient bites on tab
- Beam perpendicular to film
- Horizontal or vertical orientation

### Horizontal Bitewings:
- Routine caries detection
- Shows crowns + crestal bone

### Vertical Bitewings:
- Periodontal assessment
- Shows more bone

## Panoramic Radiography (OPG)

### Advantages:
- **Broad coverage** - all teeth, jaws, TMJ, sinuses
- Low radiation dose
- Comfortable for patient
- Useful for screening

### Disadvantages:
- **Lower resolution** than intraoral
- Distortion and magnification
- Overlapping in anterior region
- Ghost images

### Indications:
- Impacted teeth assessment
- Jaw pathology screening
- Trauma evaluation
- Pre-extraction assessment (wisdom teeth)
- Orthodontic treatment planning

### Common Errors:
- **Patient positioning**:
  - Too far forward → narrow anterior teeth
  - Too far back → wide anterior teeth
  - Head tilted → unequal magnification
- **Tongue not on palate** → radiolucent shadow
- **Movement** → blurred image

## Radiographic Interpretation

### Systematic Approach:
1. Patient details and image quality
2. **Number of teeth** present
3. **Tooth morphology** (shape, size)
4. **Periodontal structures** (bone levels, PDL, lamina dura)
5. **Periapical areas** (radiolucencies, radiopacities)
6. **Restorations** (integrity, overhangs)
7. **Caries** (interproximal, occlusal, recurrent)
8. **Other pathology** (cysts, tumors, calcifications)

### Radiolucent Lesions:
- **Caries**
- **Periapical abscess/granuloma/cyst**
- **Cysts** (dentigerous, radicular)
- **Tumors** (ameloblastoma)

### Radiopaque Lesions:
- **Condensing osteitis**
- **Tori/exostoses**
- **Odontomas**
- **Foreign bodies**

### Caries Detection:
- **Enamel caries**: radiolucent triangle (apex at DEJ)
- **Dentin caries**: radiolucent triangle (apex at pulp)
- **Interproximal**: best seen on bitewings
- **Radiographs underestimate** true extent

### Periodontal Assessment:
- **Normal bone level**: 1-2mm below CEJ
- **Horizontal bone loss**: uniform
- **Vertical bone loss**: angular defect
- **Furcation involvement**: radiolucency in furcation

## Digital Radiography

### Advantages:
- **60-80% less radiation**
- Instant image
- Image enhancement
- Easy storage and transfer
- No chemicals needed

### Types:
1. **Direct** (CCD/CMOS sensors)
   - Wired to computer
   - Instant image
   - Rigid sensor

2. **Indirect** (PSP plates)
   - Scanned after exposure
   - Flexible like film
   - Slight delay

## Key Points for Exams:
✓ **ALARA** = As Low As Reasonably Achievable
✓ Paralleling technique is **preferred** for periapicals
✓ Bitewings best for **interproximal caries** detection
✓ OPG advantages: **broad coverage**, low dose
✓ OPG disadvantages: **lower resolution**, distortion
✓ Operator stands **6 feet away** at **90-135°**
✓ Digital radiography: **60-80% less radiation**
✓ Rectangular collimation **better** than circular
✓ Radiographs **underestimate** caries extent
✓ Normal bone level: **1-2mm below CEJ**
    `,
    keyPoints: [
      "ALARA principle: As Low As Reasonably Achievable",
      "Paralleling technique preferred for periapicals - minimal distortion",
      "Bitewing radiographs best for detecting interproximal caries",
      "OPG provides broad coverage but lower resolution than intraoral",
      "Operator protection: stand 6 feet away at 90-135° angle",
      "Digital radiography reduces radiation dose by 60-80%",
      "Rectangular collimation reduces patient dose vs circular",
      "Radiographs underestimate true extent of caries",
      "Normal alveolar bone level: 1-2mm below CEJ",
      "Lead apron + thyroid collar for patient protection"
    ],
    mnemonics: [
      {
        acronym: "JOD",
        meaning: "Radiation Protection Principles",
        explanation: "Justification, Optimization, Dose limitation"
      },
      {
        acronym: "STOP",
        meaning: "OPG Patient Positioning",
        explanation: "Straight spine, Tongue on palate, Occlusal plane correct, Position in focal trough"
      }
    ],
    diagrams: [],
    tags: ["radiology", "radiography", "imaging", "x-ray", "diagnosis"],
    estimatedReadTime: 14,
    difficulty: "basic"
  }
];

async function seedRevisionNotes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing revision notes
    await RevisionNote.deleteMany({});
    console.log('🗑️  Cleared existing revision notes');

    // Get subjects and any user (prefer admin, but use any user if admin doesn't exist)
    const subjects = await Subject.find({});
    let user = await User.findOne({ role: 'admin' });

    if (!user) {
      console.log('⚠️  No admin user found. Looking for any user...');
      user = await User.findOne({});
    }

    if (!user) {
      console.log('❌ No users found in database. Creating a system user...');
      // Create a system user for content creation
      user = await User.create({
        name: 'System',
        email: 'system@lstbooks.com',
        password: 'system123', // This will be hashed
        role: 'admin'
      });
      console.log('✅ Created system user for content creation');
    }

    // Create revision notes with proper subject references
    const notesToCreate = revisionNotesData.map(note => ({
      ...note,
      subject: subjects.find(s => s.name === note.subject)?._id || subjects[0]?._id,
      createdBy: user._id
    }));

    const createdNotes = await RevisionNote.insertMany(notesToCreate);
    console.log(`✅ Created ${createdNotes.length} revision notes`);

    console.log('\n📝 Revision Notes Created:');
    createdNotes.forEach(note => {
      console.log(`   - ${note.title} (${note.year})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding revision notes:', error);
    process.exit(1);
  }
}

seedRevisionNotes();


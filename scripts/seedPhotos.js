import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Photo from '../models/Photo.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lstbooks';

const photosData = [
  {
    title: "Severe Dental Caries - Class II Cavity",
    description: "Clinical photograph showing extensive carious lesion on the mesial surface of maxillary first molar. Note the undermined enamel and discolored dentin. Patient presented with sensitivity to cold and sweet foods.",
    imageUrl: "/images/clinical/caries-class-ii-molar.jpg",
    thumbnailUrl: "/images/clinical/thumbs/caries-class-ii-molar-thumb.jpg",
    category: "Clinical Cases",
    subcategory: "Dental Caries",
    tags: ["caries", "class-ii", "molar", "operative-dentistry", "diagnosis"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 245000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Chronic Periodontitis - Advanced Stage",
    description: "Intraoral photograph demonstrating severe periodontal disease with gingival recession, bone loss, and tooth mobility. Probing depths ranged from 6-9mm with bleeding on probing. Patient is a 55-year-old smoker.",
    imageUrl: "/images/clinical/periodontitis-advanced.jpg",
    thumbnailUrl: "/images/clinical/thumbs/periodontitis-advanced-thumb.jpg",
    category: "Periodontology",
    subcategory: "Periodontal Disease",
    tags: ["periodontitis", "gingival-recession", "bone-loss", "periodontics", "diagnosis"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 312000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Successful Root Canal Treatment - Pre and Post Op",
    description: "Periapical radiograph showing completed root canal treatment of mandibular first molar. Note the well-condensed gutta-percha filling extending to the radiographic apex with good lateral condensation. Follow-up at 6 months shows complete healing of periapical lesion.",
    imageUrl: "/images/clinical/rct-success-molar.jpg",
    thumbnailUrl: "/images/clinical/thumbs/rct-success-molar-thumb.jpg",
    category: "Endodontics",
    subcategory: "Root Canal Treatment",
    tags: ["endodontics", "root-canal", "radiograph", "treatment-outcome", "success"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1200x900",
    fileSize: 189000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Impacted Mandibular Third Molar - Mesioangular",
    description: "Panoramic radiograph showing mesioangularly impacted lower right third molar in close proximity to the inferior alveolar nerve. The tooth is partially erupted with associated pericoronal radiolucency suggesting pericoronitis.",
    imageUrl: "/images/clinical/impacted-wisdom-tooth.jpg",
    thumbnailUrl: "/images/clinical/thumbs/impacted-wisdom-tooth-thumb.jpg",
    category: "Oral Surgery",
    subcategory: "Impacted Teeth",
    tags: ["oral-surgery", "impacted-tooth", "third-molar", "radiograph", "surgical-planning"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "2400x1200",
    fileSize: 425000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Porcelain Fused to Metal Crown - Final Result",
    description: "Clinical photograph of completed PFM crown on maxillary central incisor. Excellent marginal adaptation, proper contour, and natural shade matching with adjacent teeth. Patient satisfied with esthetic outcome.",
    imageUrl: "/images/clinical/pfm-crown-final.jpg",
    thumbnailUrl: "/images/clinical/thumbs/pfm-crown-final-thumb.jpg",
    category: "Prosthodontics",
    subcategory: "Fixed Prosthodontics",
    tags: ["prosthodontics", "crown", "pfm", "esthetics", "final-restoration"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 298000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Class II Malocclusion - Angle's Classification",
    description: "Lateral photograph showing Class II Division 1 malocclusion with increased overjet and proclined maxillary incisors. Patient exhibits convex profile and incompetent lips. Ideal case for orthodontic treatment with functional appliance.",
    imageUrl: "/images/clinical/class-ii-malocclusion.jpg",
    thumbnailUrl: "/images/clinical/thumbs/class-ii-malocclusion-thumb.jpg",
    category: "Orthodontics",
    subcategory: "Malocclusion",
    tags: ["orthodontics", "malocclusion", "class-ii", "diagnosis", "treatment-planning"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 267000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Early Childhood Caries - Severe Case",
    description: "Clinical photograph of 4-year-old child with severe early childhood caries (ECC) affecting all maxillary anterior teeth. Note the extensive destruction of tooth structure and gingival inflammation. Requires comprehensive treatment under general anesthesia.",
    imageUrl: "/images/clinical/early-childhood-caries.jpg",
    thumbnailUrl: "/images/clinical/thumbs/early-childhood-caries-thumb.jpg",
    category: "Pediatric Dentistry",
    subcategory: "Early Childhood Caries",
    tags: ["pediatric", "ecc", "children", "caries", "prevention"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 234000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Oral Squamous Cell Carcinoma - Lateral Tongue",
    description: "Clinical photograph showing ulcerative lesion on the lateral border of the tongue. The lesion is indurated with rolled borders and has been present for 3 months. Biopsy confirmed squamous cell carcinoma. Early detection is crucial for better prognosis.",
    imageUrl: "/images/clinical/oral-cancer-tongue.jpg",
    thumbnailUrl: "/images/clinical/thumbs/oral-cancer-tongue-thumb.jpg",
    category: "Oral Pathology",
    subcategory: "Malignant Lesions",
    tags: ["oral-pathology", "cancer", "squamous-cell-carcinoma", "diagnosis", "biopsy"],
    views: 0,
    likes: 0,
    featured: true,
    verified: true,
    resolution: "1920x1080",
    fileSize: 289000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Composite Restoration - Class IV Fracture",
    description: "Before and after photographs of Class IV composite restoration on maxillary central incisor. Traumatic fracture involving incisal edge and mesial corner. Restoration completed using layering technique with excellent color matching and contour.",
    imageUrl: "/images/clinical/composite-class-iv.jpg",
    thumbnailUrl: "/images/clinical/thumbs/composite-class-iv-thumb.jpg",
    category: "Procedures",
    subcategory: "Composite Restorations",
    tags: ["operative", "composite", "class-iv", "trauma", "esthetics"],
    views: 0,
    likes: 0,
    featured: false,
    verified: true,
    resolution: "1920x1080",
    fileSize: 276000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  },
  {
    title: "Dental Implant - Osseointegration Success",
    description: "Periapical radiograph showing successfully osseointegrated dental implant in the mandibular molar region. Note the intimate bone-to-implant contact with no radiolucency around the fixture. Ready for final crown placement.",
    imageUrl: "/images/clinical/implant-osseointegration.jpg",
    thumbnailUrl: "/images/clinical/thumbs/implant-osseointegration-thumb.jpg",
    category: "Prosthodontics",
    subcategory: "Dental Implants",
    tags: ["implants", "osseointegration", "radiograph", "prosthodontics", "success"],
    views: 0,
    likes: 0,
    featured: false,
    verified: true,
    resolution: "1200x900",
    fileSize: 198000,
    source: "Clinical Practice",
    copyright: "lstBooks Educational Use"
  }
];

async function seedPhotos() {
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

    // Clear existing photos
    await Photo.deleteMany({});
    console.log('🗑️  Cleared existing clinical photos');

    // Add uploadedBy to each photo
    const photosWithUser = photosData.map(photo => ({
      ...photo,
      uploadedBy: user._id
    }));

    // Create photos
    const createdPhotos = await Photo.insertMany(photosWithUser);
    console.log(`✅ Created ${createdPhotos.length} clinical photos`);

    console.log('\n📸 Clinical Photos Created:');
    createdPhotos.forEach(photo => {
      console.log(`   - ${photo.title} (${photo.category})`);
    });

    console.log('\n✅ Clinical Photos seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding photos:', error);
    process.exit(1);
  }
}

seedPhotos();


import express from 'express';
import Photo from '../models/Photo.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all photos with filtering
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, tags, search, featured, verified } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (tags) query.tags = { $in: tags.split(',') };
    if (featured !== undefined) query.featured = featured === 'true';
    if (verified !== undefined) query.verified = verified === 'true';
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const photos = await Photo.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    // If no photos exist, create sample data
    if (photos.length === 0 && !search && !category) {
      const samplePhotos = [
        {
          title: 'Tooth Anatomy - Cross Section',
          description: 'Detailed cross-sectional view of tooth anatomy showing enamel, dentin, pulp, and root structures',
          imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400',
          category: 'Dental Anatomy',
          subcategory: 'Tooth Structure',
          tags: ['anatomy', 'tooth', 'cross-section', 'education'],
          featured: true,
          verified: true,
          resolution: '1920x1080',
          views: 245
        },
        {
          title: 'Dental X-Ray - Panoramic View',
          description: 'Full panoramic radiograph showing complete dentition and jaw structures',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
          category: 'Radiology',
          subcategory: 'Panoramic',
          tags: ['x-ray', 'radiology', 'panoramic', 'diagnosis'],
          featured: true,
          verified: true,
          resolution: '2048x1024',
          views: 189
        },
        {
          title: 'Dental Instruments Set',
          description: 'Complete set of basic dental examination instruments including mirror, explorer, and forceps',
          imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
          category: 'Instruments',
          subcategory: 'Examination Tools',
          tags: ['instruments', 'tools', 'equipment', 'clinical'],
          verified: true,
          resolution: '1920x1280',
          views: 156
        },
        {
          title: 'Crown Preparation Procedure',
          description: 'Step-by-step crown preparation showing proper tooth reduction and margin placement',
          imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400',
          category: 'Procedures',
          subcategory: 'Crown Preparation',
          tags: ['crown', 'preparation', 'prosthodontics', 'procedure'],
          featured: true,
          verified: true,
          resolution: '1920x1080',
          views: 312
        },
        {
          title: 'Periodontal Disease - Clinical Case',
          description: 'Clinical presentation of advanced periodontal disease with gingival inflammation and bone loss',
          imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400',
          category: 'Clinical Cases',
          subcategory: 'Periodontal Disease',
          tags: ['periodontal', 'disease', 'clinical', 'pathology'],
          verified: true,
          resolution: '1920x1280',
          views: 203
        },
        {
          title: 'Dental Lab - Ceramic Crown',
          description: 'Laboratory fabrication of all-ceramic crown showing layering technique',
          imageUrl: 'https://images.unsplash.com/photo-1609840114035-3c981960afb8?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1609840114035-3c981960afb8?w=400',
          category: 'Lab Work',
          subcategory: 'Crown Fabrication',
          tags: ['lab', 'ceramic', 'crown', 'prosthodontics'],
          verified: true,
          resolution: '1920x1080',
          views: 178
        }
      ];
      
      await Photo.insertMany(samplePhotos);
      const newPhotos = await Photo.find(query).sort({ createdAt: -1 });
      return res.json(newPhotos);
    }
    
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Get single photo
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

// Create new photo
router.post('/', authenticate, async (req, res) => {
  try {
    const photo = new Photo({
      ...req.body,
      uploadedBy: req.user.userId
    });
    await photo.save();
    res.status(201).json(photo);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

// Update photo
router.put('/:id', authenticate, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Failed to update photo' });
  }
});

// Delete photo
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Track photo view
router.post('/:id/view', async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Like photo
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    console.error('Error liking photo:', error);
    res.status(500).json({ error: 'Failed to like photo' });
  }
});

export default router;


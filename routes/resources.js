import express from 'express';
import Resource from '../models/Resource.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * GET /api/resources
 * Get all resources with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { type, subject, year, search, featured, uploadedBy, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { isPublic: true };
    if (type) query.type = type;
    if (subject) query.subject = subject;
    if (year && year !== 'All') query.year = year;
    if (featured === 'true') query.featured = true;
    if (uploadedBy) query.uploadedBy = uploadedBy;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name email')
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Resource.countDocuments(query);

    // If no resources and no filters, create sample data
    if (resources.length === 0 && !search && !type && !subject) {
      const sampleResources = [
        {
          title: 'Dental Anatomy Complete Guide',
          description: 'Comprehensive PDF guide covering all aspects of dental anatomy',
          type: 'pdf',
          fileUrl: 'https://example.com/dental-anatomy.pdf',
          fileSize: 5242880, // 5MB
          year: 'All',
          topics: ['Dental Anatomy', 'Tooth Structure'],
          tags: ['anatomy', 'guide', 'comprehensive'],
          uploadedBy: req.user?._id || null,
          featured: true,
          isPublic: true
        },
        {
          title: 'Oral Pathology Lecture Series',
          description: 'Video lecture series on oral pathology fundamentals',
          type: 'video',
          fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: 3600, // 1 hour
          year: '3',
          topics: ['Oral Pathology', 'Diseases'],
          tags: ['pathology', 'lecture', 'video'],
          uploadedBy: req.user?._id || null,
          isExternal: true,
          externalSource: 'youtube',
          isPublic: true
        },
        {
          title: 'Periodontology Presentation Slides',
          description: 'PowerPoint slides for periodontology course',
          type: 'slide',
          fileUrl: 'https://example.com/periodontology-slides.pptx',
          thumbnailUrl: 'https://via.placeholder.com/400x300?text=Periodontology+Slides',
          fileSize: 2097152, // 2MB
          year: '4',
          topics: ['Periodontology', 'Gum Disease'],
          tags: ['periodontology', 'slides', 'presentation'],
          uploadedBy: req.user?._id || null,
          isPublic: true
        },
        {
          title: 'Endodontics Clinical Cases',
          description: 'Collection of clinical case studies in endodontics',
          type: 'pdf',
          fileUrl: 'https://example.com/endo-cases.pdf',
          fileSize: 10485760, // 10MB
          year: '4',
          topics: ['Endodontics', 'Root Canal'],
          tags: ['endodontics', 'cases', 'clinical'],
          uploadedBy: req.user?._id || null,
          featured: true,
          isPublic: true
        },
        {
          title: 'Prosthodontics Tutorial Videos',
          description: 'Step-by-step tutorial videos for prosthodontic procedures',
          type: 'video',
          fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          duration: 2400, // 40 minutes
          year: '5',
          topics: ['Prosthodontics', 'Dentures'],
          tags: ['prosthodontics', 'tutorial', 'video'],
          uploadedBy: req.user?._id || null,
          isExternal: true,
          externalSource: 'youtube',
          isPublic: true
        },
        {
          title: 'Radiology Interpretation Guide',
          description: 'Guide for interpreting dental radiographs',
          type: 'pdf',
          fileUrl: 'https://example.com/radiology-guide.pdf',
          fileSize: 7340032, // 7MB
          year: 'All',
          topics: ['Radiology', 'X-rays'],
          tags: ['radiology', 'x-ray', 'interpretation'],
          uploadedBy: req.user?._id || null,
          isPublic: true
        }
      ];

      await Resource.insertMany(sampleResources);
      const newResources = await Resource.find(query)
        .populate('subject', 'name')
        .populate('uploadedBy', 'name email')
        .sort({ featured: -1, createdAt: -1 })
        .lean();

      return res.json({
        resources: newResources,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: newResources.length,
          pages: Math.ceil(newResources.length / limit)
        }
      });
    }

    res.json({
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/resources/:id
 * Get single resource
 */
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name email')
      .lean();

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resources
 * Create new resource (teachers/admins only)
 */
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      fileUrl,
      thumbnailUrl,
      fileSize,
      duration,
      subject,
      year,
      topics,
      tags,
      featured,
      isPublic,
      isExternal,
      externalSource
    } = req.body;

    const resource = new Resource({
      title,
      description,
      type,
      fileUrl,
      thumbnailUrl,
      fileSize,
      duration,
      subject,
      year: year || 'All',
      topics: topics || [],
      tags: tags || [],
      uploadedBy: req.user._id,
      featured: featured || false,
      isPublic: isPublic !== false,
      isExternal: isExternal || false,
      externalSource
    });

    await resource.save();

    const populatedResource = await Resource.findById(resource._id)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name email')
      .lean();

    res.status(201).json(populatedResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/resources/:id
 * Update resource (teachers/admins only)
 */
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if user owns the resource or is admin
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'uploadedBy') { // Prevent changing owner
        resource[key] = updates[key];
      }
    });

    await resource.save();

    const updatedResource = await Resource.findById(resource._id)
      .populate('subject', 'name')
      .populate('uploadedBy', 'name email')
      .lean();

    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/resources/:id
 * Delete resource (teachers/admins only)
 */
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if user owns the resource or is admin
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resources/:id/view
 * Track resource view
 */
router.post('/:id/view', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ views: resource.views });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/resources/:id/download
 * Track resource download
 */
router.post('/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ downloads: resource.downloads });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


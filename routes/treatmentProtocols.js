import express from 'express';
import TreatmentProtocol from '../models/TreatmentProtocol.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * GET /api/treatment-protocols
 * Get all treatment protocols with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, verified, featured, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (verified === 'true') query.verified = true;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const protocols = await TreatmentProtocol.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedProtocols', 'title category')
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await TreatmentProtocol.countDocuments(query);

    // If no protocols and no filters, create sample data
    if (protocols.length === 0 && !search && !category) {
      const sampleProtocols = [
        {
          title: 'Class II Composite Restoration',
          description: 'Step-by-step protocol for posterior composite restoration using incremental layering technique',
          category: 'Operative Dentistry',
          subcategory: 'Direct Restorations',
          difficulty: 'Intermediate',
          estimatedTime: '45-60 minutes',
          indications: [
            'Carious lesion in posterior tooth',
            'Fractured cusp or marginal ridge',
            'Replacement of defective amalgam restoration',
            'Esthetic improvement of posterior teeth'
          ],
          contraindications: [
            'Heavy occlusal forces in bruxism patients',
            'Inability to maintain dry field',
            'Very deep subgingival margins',
            'Patient allergic to resin materials'
          ],
          prerequisites: [
            'Understanding of tooth anatomy',
            'Knowledge of adhesive dentistry',
            'Proficiency in rubber dam placement',
            'Familiarity with composite materials'
          ],
          steps: [
            {
              stepNumber: 1,
              title: 'Anesthesia and Isolation',
              description: 'Administer local anesthesia and place rubber dam for moisture control',
              duration: '5-10 minutes',
              materials: ['Local anesthetic', 'Rubber dam', 'Clamps', 'Floss'],
              instruments: ['Syringe', 'Rubber dam punch', 'Clamp forceps'],
              tips: ['Ensure complete anesthesia before starting', 'Use wedges for better isolation'],
              warnings: ['Check for latex allergy before rubber dam placement']
            },
            {
              stepNumber: 2,
              title: 'Cavity Preparation',
              description: 'Remove carious tissue and prepare cavity with proper retention form',
              duration: '10-15 minutes',
              materials: ['High-speed handpiece', 'Burs (330, 245)'],
              instruments: ['Excavators', 'Explorer'],
              tips: [
                'Preserve tooth structure',
                'Create divergent walls for retention',
                'Round internal line angles'
              ],
              warnings: ['Avoid pulp exposure', 'Protect adjacent teeth']
            },
            {
              stepNumber: 3,
              title: 'Matrix Band Placement',
              description: 'Place and contour sectional matrix system for proper contact',
              duration: '5 minutes',
              materials: ['Sectional matrix bands', 'Separation rings', 'Wedges'],
              instruments: ['Matrix forceps', 'Burnisher'],
              tips: ['Ensure tight contact with adjacent tooth', 'Contour band to tooth anatomy'],
              warnings: ['Avoid gingival trauma with wedge placement']
            },
            {
              stepNumber: 4,
              title: 'Adhesive Application',
              description: 'Etch, prime, and bond using total-etch adhesive technique',
              duration: '5 minutes',
              materials: ['37% phosphoric acid', 'Adhesive system', 'Applicator tips'],
              instruments: ['Air-water syringe', 'Curing light'],
              tips: [
                'Etch enamel for 15 seconds, dentin for 10 seconds',
                'Keep dentin moist after rinsing',
                'Apply adhesive in multiple coats'
              ],
              warnings: ['Avoid over-drying dentin', 'Ensure complete polymerization']
            },
            {
              stepNumber: 5,
              title: 'Incremental Composite Placement',
              description: 'Place composite in 2mm increments and light cure each layer',
              duration: '15-20 minutes',
              materials: ['Composite resin', 'Bonding agent'],
              instruments: ['Composite instruments', 'LED curing light'],
              tips: [
                'Use oblique incremental technique',
                'Adapt composite to cavity walls',
                'Cure for minimum 20 seconds per layer'
              ],
              warnings: ['Avoid voids and gaps', 'Prevent contamination between layers']
            },
            {
              stepNumber: 6,
              title: 'Finishing and Polishing',
              description: 'Contour, finish, and polish restoration to achieve smooth surface',
              duration: '10-15 minutes',
              materials: ['Finishing burs', 'Polishing discs', 'Polishing paste'],
              instruments: ['Slow-speed handpiece', 'Articulating paper'],
              tips: [
                'Check occlusion with articulating paper',
                'Polish in sequence from coarse to fine',
                'Achieve high gloss finish'
              ],
              warnings: ['Avoid over-contouring', 'Protect soft tissues during polishing']
            }
          ],
          requiredMaterials: [
            'Local anesthetic',
            'Rubber dam kit',
            'Composite resin',
            'Adhesive system',
            '37% phosphoric acid',
            'Matrix system',
            'Finishing and polishing materials'
          ],
          requiredInstruments: [
            'High-speed handpiece',
            'Slow-speed handpiece',
            'Burs (330, 245, finishing burs)',
            'Composite instruments',
            'LED curing light',
            'Articulating paper'
          ],
          complications: [
            'Post-operative sensitivity',
            'Marginal discoloration',
            'Secondary caries',
            'Restoration fracture',
            'Loss of contact point'
          ],
          postTreatmentCare: [
            'Avoid hard foods for 24 hours',
            'Maintain good oral hygiene',
            'Use desensitizing toothpaste if sensitivity occurs',
            'Report any sharp edges or high spots'
          ],
          followUp: 'Review in 1 week for sensitivity check, then 6-month recall',
          evidenceLevel: 'Level 1',
          references: [
            {
              title: 'Clinical performance of posterior composite restorations',
              authors: 'Opdam NJ, et al.',
              journal: 'Journal of Dentistry',
              year: 2014,
              doi: '10.1016/j.jdent.2014.07.014'
            }
          ],
          tags: ['composite', 'restoration', 'posterior', 'class-ii', 'operative'],
          verified: true,
          featured: true
        }
      ];

      await TreatmentProtocol.insertMany(sampleProtocols);
      const newProtocols = await TreatmentProtocol.find(query)
        .populate('createdBy', 'name email')
        .sort({ featured: -1, createdAt: -1 })
        .lean();

      return res.json({
        protocols: newProtocols,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: newProtocols.length,
          pages: Math.ceil(newProtocols.length / limit)
        }
      });
    }

    res.json({
      protocols,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching treatment protocols:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/treatment-protocols/:id
 * Get single treatment protocol
 */
router.get('/:id', async (req, res) => {
  try {
    const protocol = await TreatmentProtocol.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('relatedProtocols', 'title category difficulty')
      .lean();

    if (!protocol) {
      return res.status(404).json({ error: 'Treatment protocol not found' });
    }

    res.json(protocol);
  } catch (error) {
    console.error('Error fetching treatment protocol:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/treatment-protocols
 * Create new treatment protocol (teachers/admins only)
 */
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const protocol = new TreatmentProtocol({
      ...req.body,
      createdBy: req.user._id
    });

    await protocol.save();

    const populatedProtocol = await TreatmentProtocol.findById(protocol._id)
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json(populatedProtocol);
  } catch (error) {
    console.error('Error creating treatment protocol:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/treatment-protocols/:id
 * Update treatment protocol (teachers/admins only)
 */
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const protocol = await TreatmentProtocol.findById(req.params.id);

    if (!protocol) {
      return res.status(404).json({ error: 'Treatment protocol not found' });
    }

    // Check if user owns the protocol or is admin
    if (protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this protocol' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        protocol[key] = req.body[key];
      }
    });

    await protocol.save();

    const updatedProtocol = await TreatmentProtocol.findById(protocol._id)
      .populate('createdBy', 'name email')
      .lean();

    res.json(updatedProtocol);
  } catch (error) {
    console.error('Error updating treatment protocol:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/treatment-protocols/:id
 * Delete treatment protocol (teachers/admins only)
 */
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const protocol = await TreatmentProtocol.findById(req.params.id);

    if (!protocol) {
      return res.status(404).json({ error: 'Treatment protocol not found' });
    }

    // Check if user owns the protocol or is admin
    if (protocol.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this protocol' });
    }

    await TreatmentProtocol.findByIdAndDelete(req.params.id);

    res.json({ message: 'Treatment protocol deleted successfully' });
  } catch (error) {
    console.error('Error deleting treatment protocol:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/treatment-protocols/category/:category
 * Get protocols by category
 */
router.get('/category/:category', async (req, res) => {
  try {
    const protocols = await TreatmentProtocol.find({ category: req.params.category })
      .populate('createdBy', 'name email')
      .sort({ featured: -1, title: 1 })
      .lean();

    res.json(protocols);
  } catch (error) {
    console.error('Error fetching protocols by category:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


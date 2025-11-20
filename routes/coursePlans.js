import express from 'express';
import CoursePlan from '../models/CoursePlan.js';
import { authenticate } from '../middleware/auth.js';
import { requireTeacherOrAdmin } from '../middleware/roleAuth.js';

const router = express.Router();

/**
 * GET /api/course-plans
 * Get all course plans with filtering
 */
router.get('/', async (req, res) => {
  try {
    const { subject, year, semester, isTemplate, createdBy, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (subject) query.subject = subject;
    if (year && year !== 'All') query.year = year;
    if (semester) query.semester = semester;
    if (isTemplate === 'true') query.isTemplate = true;
    if (createdBy) query.createdBy = createdBy;

    const coursePlans = await CoursePlan.find(query)
      .populate('subject', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await CoursePlan.countDocuments(query);

    // If no course plans and no filters, create sample data
    if (coursePlans.length === 0 && !subject && !year && !isTemplate) {
      const samplePlans = [
        {
          title: 'Dental Anatomy - Fall Semester',
          description: 'Comprehensive course plan for Dental Anatomy covering tooth morphology, occlusion, and clinical applications',
          year: '1',
          semester: '1',
          academicYear: '2024-2025',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-15'),
          createdBy: req.user?._id || null,
          isPublic: true,
          tags: ['anatomy', 'morphology', 'year1'],
          weeks: [
            {
              weekNumber: 1,
              title: 'Introduction to Dental Anatomy',
              description: 'Overview of dental anatomy, terminology, and tooth notation systems',
              topics: ['Dental terminology', 'Tooth notation', 'Dental arches'],
              learningObjectives: [
                'Understand basic dental terminology',
                'Master tooth notation systems (Universal, Palmer, FDI)',
                'Identify dental arches and quadrants'
              ],
              resources: [],
              assignments: [
                {
                  title: 'Tooth Notation Quiz',
                  description: 'Complete quiz on tooth notation systems',
                  type: 'quiz',
                  dueDate: new Date('2024-09-08')
                }
              ],
              completed: false
            },
            {
              weekNumber: 2,
              title: 'Tooth Morphology - Incisors',
              description: 'Detailed study of incisor anatomy and characteristics',
              topics: ['Central incisors', 'Lateral incisors', 'Crown anatomy'],
              learningObjectives: [
                'Identify features of maxillary and mandibular incisors',
                'Understand functional anatomy of incisors',
                'Recognize variations in incisor morphology'
              ],
              resources: [],
              assignments: [],
              completed: false
            },
            {
              weekNumber: 3,
              title: 'Tooth Morphology - Canines',
              description: 'Study of canine anatomy and clinical significance',
              topics: ['Maxillary canines', 'Mandibular canines', 'Canine guidance'],
              learningObjectives: [
                'Describe canine anatomy and function',
                'Understand canine guidance in occlusion',
                'Identify canine variations'
              ],
              resources: [],
              assignments: [],
              completed: false
            },
            {
              weekNumber: 4,
              title: 'Tooth Morphology - Premolars',
              description: 'Comprehensive study of premolar anatomy',
              topics: ['First premolars', 'Second premolars', 'Occlusal anatomy'],
              learningObjectives: [
                'Differentiate between first and second premolars',
                'Understand premolar occlusal anatomy',
                'Recognize clinical significance of premolars'
              ],
              resources: [],
              assignments: [
                {
                  title: 'Anterior Teeth Practical Exam',
                  description: 'Identify and describe anterior teeth',
                  type: 'practice',
                  dueDate: new Date('2024-09-29')
                }
              ],
              completed: false
            },
            {
              weekNumber: 5,
              title: 'Tooth Morphology - Molars',
              description: 'Detailed study of molar anatomy and variations',
              topics: ['First molars', 'Second molars', 'Third molars', 'Root anatomy'],
              learningObjectives: [
                'Identify features of maxillary and mandibular molars',
                'Understand molar root anatomy',
                'Recognize molar variations and clinical implications'
              ],
              resources: [],
              assignments: [],
              completed: false
            },
            {
              weekNumber: 6,
              title: 'Occlusion and Articulation',
              description: 'Study of dental occlusion and jaw movements',
              topics: ['Centric occlusion', 'Lateral excursions', 'Protrusive movements'],
              learningObjectives: [
                'Understand principles of occlusion',
                'Describe mandibular movements',
                'Identify occlusal contacts'
              ],
              resources: [],
              assignments: [],
              completed: false
            }
          ]
        },
        {
          title: 'Operative Dentistry - Spring Semester',
          description: 'Clinical operative dentistry course covering cavity preparation and restoration techniques',
          year: '2',
          semester: '2',
          academicYear: '2024-2025',
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-05-15'),
          createdBy: req.user?._id || null,
          isPublic: true,
          isTemplate: true,
          tags: ['operative', 'restorations', 'year2'],
          weeks: [
            {
              weekNumber: 1,
              title: 'Introduction to Operative Dentistry',
              description: 'Principles of cavity preparation and restoration',
              topics: ['GV Black classification', 'Cavity preparation principles'],
              learningObjectives: ['Understand GV Black classification', 'Learn cavity preparation principles'],
              resources: [],
              assignments: [],
              completed: false
            }
          ]
        }
      ];

      await CoursePlan.insertMany(samplePlans);
      const newPlans = await CoursePlan.find(query)
        .populate('subject', 'name')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        coursePlans: newPlans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: newPlans.length,
          pages: Math.ceil(newPlans.length / limit)
        }
      });
    }

    res.json({
      coursePlans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching course plans:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/course-plans/:id
 * Get single course plan
 */
router.get('/:id', async (req, res) => {
  try {
    const coursePlan = await CoursePlan.findById(req.params.id)
      .populate('subject', 'name')
      .populate('createdBy', 'name email')
      .lean();

    if (!coursePlan) {
      return res.status(404).json({ error: 'Course plan not found' });
    }

    res.json(coursePlan);
  } catch (error) {
    console.error('Error fetching course plan:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/course-plans
 * Create new course plan (teachers/admins only)
 */
router.post('/', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const coursePlan = new CoursePlan({
      ...req.body,
      createdBy: req.user._id
    });

    await coursePlan.save();

    const populatedPlan = await CoursePlan.findById(coursePlan._id)
      .populate('subject', 'name')
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json(populatedPlan);
  } catch (error) {
    console.error('Error creating course plan:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/course-plans/:id
 * Update course plan (teachers/admins only)
 */
router.put('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const coursePlan = await CoursePlan.findById(req.params.id);

    if (!coursePlan) {
      return res.status(404).json({ error: 'Course plan not found' });
    }

    // Check if user owns the course plan or is admin
    if (coursePlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course plan' });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        coursePlan[key] = req.body[key];
      }
    });

    await coursePlan.save();

    const updatedPlan = await CoursePlan.findById(coursePlan._id)
      .populate('subject', 'name')
      .populate('createdBy', 'name email')
      .lean();

    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating course plan:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/course-plans/:id
 * Delete course plan (teachers/admins only)
 */
router.delete('/:id', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const coursePlan = await CoursePlan.findById(req.params.id);

    if (!coursePlan) {
      return res.status(404).json({ error: 'Course plan not found' });
    }

    // Check if user owns the course plan or is admin
    if (coursePlan.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course plan' });
    }

    await CoursePlan.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting course plan:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/course-plans/:id/weeks/:weekNumber/complete
 * Mark week as complete/incomplete
 */
router.put('/:id/weeks/:weekNumber/complete', authenticate, requireTeacherOrAdmin, async (req, res) => {
  try {
    const { completed } = req.body;
    const coursePlan = await CoursePlan.findById(req.params.id);

    if (!coursePlan) {
      return res.status(404).json({ error: 'Course plan not found' });
    }

    const week = coursePlan.weeks.find(w => w.weekNumber === parseInt(req.params.weekNumber));
    if (!week) {
      return res.status(404).json({ error: 'Week not found' });
    }

    week.completed = completed;
    await coursePlan.save();

    res.json(coursePlan);
  } catch (error) {
    console.error('Error updating week:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;


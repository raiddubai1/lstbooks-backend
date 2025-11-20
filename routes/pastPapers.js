import express from 'express';
import PastPaper from '../models/PastPaper.js';

const router = express.Router();

// Get all past papers with filtering
router.get('/', async (req, res) => {
  try {
    const { subject, year, semester, examType, academicYear, search, difficulty } = req.query;
    
    // Build query
    let query = {};
    
    if (subject) {
      query.subject = subject;
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (examType) {
      query.examType = examType;
    }
    
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pastPapers = await PastPaper.find(query)
      .sort({ year: -1, createdAt: -1 })
      .populate('uploadedBy', 'name email');
    
    // If no papers in database, return sample data
    if (pastPapers.length === 0) {
      return res.json([
        {
          _id: 'sample1',
          title: 'Dental Anatomy Final Exam 2023',
          subject: 'Dental Anatomy',
          year: 2023,
          semester: 'Fall',
          examType: 'Final Exam',
          academicYear: 'Year 1',
          fileUrl: 'https://example.com/papers/dental-anatomy-2023.pdf',
          solutionUrl: 'https://example.com/papers/dental-anatomy-2023-solutions.pdf',
          description: 'Comprehensive final exam covering tooth morphology, development, and occlusion.',
          totalMarks: 100,
          duration: 120,
          difficulty: 'Medium',
          topics: ['Tooth Morphology', 'Dental Development', 'Occlusion'],
          tags: ['anatomy', 'final', 'year1'],
          downloads: 245,
          verified: true
        },
        {
          _id: 'sample2',
          title: 'Oral Pathology Midterm 2024',
          subject: 'Oral Pathology',
          year: 2024,
          semester: 'Spring',
          examType: 'Midterm',
          academicYear: 'Year 2',
          fileUrl: 'https://example.com/papers/oral-pathology-2024.pdf',
          description: 'Midterm examination on common oral lesions and diseases.',
          totalMarks: 50,
          duration: 90,
          difficulty: 'Hard',
          topics: ['Oral Lesions', 'Pathology Diagnosis', 'Disease Classification'],
          tags: ['pathology', 'midterm', 'year2'],
          downloads: 189,
          verified: true
        },
        {
          _id: 'sample3',
          title: 'Periodontology Practice Test 2023',
          subject: 'Periodontology',
          year: 2023,
          semester: 'Final',
          examType: 'Practice Test',
          academicYear: 'Year 3',
          fileUrl: 'https://example.com/papers/perio-practice-2023.pdf',
          solutionUrl: 'https://example.com/papers/perio-practice-2023-solutions.pdf',
          description: 'Practice test for periodontal disease diagnosis and treatment planning.',
          totalMarks: 75,
          duration: 100,
          difficulty: 'Medium',
          topics: ['Periodontal Disease', 'Treatment Planning', 'Surgical Procedures'],
          tags: ['periodontology', 'practice', 'year3'],
          downloads: 312,
          verified: true
        }
      ]);
    }
    
    res.json(pastPapers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get past paper by ID
router.get('/:id', async (req, res) => {
  try {
    const pastPaper = await PastPaper.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!pastPaper) {
      return res.status(404).json({ error: 'Past paper not found' });
    }
    res.json(pastPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new past paper
router.post('/', async (req, res) => {
  try {
    const paperData = req.body;

    // Validation
    if (!paperData.title || !paperData.subject || !paperData.year || !paperData.fileUrl) {
      return res.status(400).json({ error: 'Title, subject, year, and file URL are required' });
    }

    const pastPaper = new PastPaper(paperData);
    await pastPaper.save();
    res.status(201).json(pastPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update past paper
router.put('/:id', async (req, res) => {
  try {
    const pastPaper = await PastPaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!pastPaper) {
      return res.status(404).json({ error: 'Past paper not found' });
    }

    res.json(pastPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete past paper
router.delete('/:id', async (req, res) => {
  try {
    const pastPaper = await PastPaper.findByIdAndDelete(req.params.id);

    if (!pastPaper) {
      return res.status(404).json({ error: 'Past paper not found' });
    }

    res.json({ message: 'Past paper deleted successfully', pastPaper });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment download count
router.post('/:id/download', async (req, res) => {
  try {
    const pastPaper = await PastPaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!pastPaper) {
      return res.status(404).json({ error: 'Past paper not found' });
    }

    res.json(pastPaper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;


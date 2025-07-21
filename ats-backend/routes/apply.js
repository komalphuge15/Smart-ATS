const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// 🗂️ Multer setup for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ POST /api/apply — Apply for a job
router.post('/', protect, upload.single('resumeFile'), async (req, res) => {
  try {
    const {
      name, email, phone, github, linkedin,
      tenth, twelfth, cgpa, location,
      availability, expectedSalary, jobId
    } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const resumePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const jobDesc = job.description.replace(/"/g, '');

    const pythonPath = path.join(__dirname, '..', 'resume-parser', 'venv', 'Scripts', 'python.exe');
    const parserPath = path.join(__dirname, '..', 'resume-parser', 'parser.py');
    const command = `"${pythonPath}" "${parserPath}" "${resumePath}" "${jobDesc}"`;

    exec(command, async (err, stdout, stderr) => {
      if (err) {
        console.error('Parser Error:', stderr);
        return res.status(500).json({ message: 'Resume parsing failed' });
      }

      let parsed = {};
      try {
        parsed = JSON.parse(stdout);
      } catch (e) {
        return res.status(500).json({ message: 'Invalid resume parser output' });
      }

      // ✅ Always create a new application (even if user applies again)
      const newApp = new Application({
        name,
        email: parsed.email || email,
        phone: parsed.phone || phone,
        github,
        linkedin,
        tenth,
        twelfth,
        cgpa,
        location,
        availability,
        expectedSalary,
        resumeFile: req.file?.filename || '',
        jobId: job._id,
        recruiterId: job.postedBy,
        applicantId: req.user.id,
        score: parsed.score ?? null,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      });

      await newApp.save();
      console.log('✅ New application saved:', newApp);
      res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
    });

  } catch (err) {
    console.error('❌ Application Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /api/apply/my-applications/:userId — List all applications of an applicant
router.get('/my-applications/:userId', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.params.userId })
      .populate('jobId', 'title location')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error('❌ Error fetching applications:', err.message);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// ✅ DELETE application
router.delete('/:applicationId', protect, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.applicationId);
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting application:', err.message);
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /api/apply/
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

    const { spawn } = require('child_process');

const python = spawn(pythonPath, [parserPath, resumePath, jobDesc]);

let jsonOutput = '';
let errorOutput = '';

python.stdout.on('data', (data) => {
  jsonOutput += data.toString();
});

python.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

python.on('close', async (code) => {
  if (code !== 0) {
    console.error('Python parser failed:', errorOutput);
    return res.status(500).json({ message: 'Resume parsing failed' });
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonOutput.trim());
  } catch (e) {
    console.error('JSON parse error:', e.message);
    return res.status(500).json({ message: 'Invalid JSON from resume parser' });
  }

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
    score: parsed.score !== undefined ? parsed.score : null,
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
  });

  await newApp.save();
  res.status(201).json({ message: 'Application submitted and parsed!', application: newApp });
});


  } catch (err) {
    console.error('Application Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

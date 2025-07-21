const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application'); // ✅ MISSING IMPORT FIXED
const { protect } = require('../middleware/authMiddleware');

// ✅ GET all jobs or only jobs by specific recruiter
router.get('/', async (req, res) => {
  try {
    const { postedBy } = req.query;
    const filter = postedBy ? { postedBy } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST new job (Recruiter only)
router.post('/', protect, async (req, res) => {
  const { title, location, description, skills, salary } = req.body;

  try {
    const newJob = new Job({
      title,
      location,
      description,
      skills,
      salary,
      postedBy: req.user.id,
    });

    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE job and its applications
router.delete('/:jobId', protect, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Optional: Verify that logged-in recruiter owns the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    // Delete all applications for that job
    await Application.deleteMany({ jobId });

    res.json({ message: 'Job and related applications deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err.message);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

module.exports = router;

// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

router.get('/recruiter/:recruiterId', protect, async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;

    const jobCount = await Job.countDocuments({ postedBy: recruiterId });
    const applicantCount = await Application.countDocuments({ recruiterId });

    const applications = await Application.find({ recruiterId })
      .populate('jobId', 'title location') // include job title/location
      .sort({ createdAt: -1 });

    res.json({ jobCount, applicantCount, applications });
  } catch (err) {
    console.error('Dashboard fetch error:', err.message);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;

// routes/applicants.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// ✅ Get applicants for a recruiter's posted jobs
router.get('/my-applicants/:recruiterId', protect, async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;

    const applications = await Application.find({ recruiterId })
      .populate('jobId', 'title location description')
      .sort({ createdAt: -1 });

    const finalData = applications.map(app => ({
      _id: app._id,
      applicantName: app.name || 'N/A',
      email: app.email || 'N/A',
      phone: app.phone || 'N/A',
      jobId: app.jobId?._id,
      jobTitle: app.jobId?.title || 'N/A',
      location: app.jobId?.location || 'N/A',
      resumeFilename: app.resumeFile || '',
      score: app.score ?? 0,
      matchedSkills: app.skills ?? [],
      createdAt: app.createdAt,
    }));

    res.json(finalData);
  } catch (err) {
    console.error('❌ Error fetching applicants:', err.message);
    res.status(500).json({ message: 'Failed to fetch applicants' });
  }
});

module.exports = router;

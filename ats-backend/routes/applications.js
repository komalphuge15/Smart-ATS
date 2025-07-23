const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

// GET /api/applications (filter applicants)
router.get('/', protect, async (req, res) => {
  try {
    const {
      recruiterId,
      skill,
      status,
      testStatus,
      email,
      jobTitle,
      minScore,
      maxScore,
      qualification,
      experience,
      interview1,
      interview2,
      gender,
      fromDate,
      toDate
    } = req.query;

    const query = { recruiterId };

    if (skill) query.skills = { $regex: skill, $options: 'i' };
    if (status) query.onboardingStatus = status;
    if (testStatus) query.testStatus = testStatus;
    if (email) query.email = { $regex: email, $options: 'i' };
    if (jobTitle) query.jobTitle = { $regex: jobTitle, $options: 'i' };

    if (qualification) query.qualification = { $regex: qualification, $options: 'i' };
    if (experience) query.experience = Number(experience);
    if (interview1) query['interviewRound1.status'] = interview1;
    if (interview2) query['interviewRound2.status'] = interview2;
    if (gender) query.gender = gender;

    if (minScore || maxScore) {
      query.score = {};
      if (minScore) query.score.$gte = parseFloat(minScore);
      if (maxScore) query.score.$lte = parseFloat(maxScore);
    }

    if (fromDate || toDate) {
      query.applicationDate = {};
      if (fromDate) query.applicationDate.$gte = new Date(fromDate);
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        query.applicationDate.$lte = to;
      }
    }

    const applicants = await Application.find(query).sort({ createdAt: -1 });
    res.json(applicants);
  } catch (err) {
    console.error('Filter Error:', err.message);
    res.status(500).json({ message: 'Server error while filtering' });
  }
});

// PUT: test status
router.put('/test-status/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { testStatus: req.body.testStatus },
      { new: true }
    );
    res.json(application);
  } catch (err) {
    console.error('Update test status error:', err.message);
    res.status(500).json({ message: 'Failed to update test status' });
  }
});

// PUT: onboarding status
router.put('/onboarding/:id', async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { onboardingStatus: req.body.onboardingStatus },
      { new: true }
    );
    res.json(application);
  } catch (err) {
    console.error('Update onboarding status error:', err.message);
    res.status(500).json({ message: 'Failed to update onboarding status' });
  }
});

// POST: send email
router.post('/notify/:id', async (req, res) => {
  const { subject, message } = req.body;

  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Applicant not found' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: application.email,
      subject,
      text: message,
    });

    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error('Send email error:', err.message);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// PUT: schedule interview
router.put('/interview/:id', protect, async (req, res) => {
  const { round, date, interviewer, comment } = req.body;

  try {
    const parsedDate = new Date(date); 

    const updateField = {
      status: 'Scheduled',
      date: parsedDate,
      interviewer,
      comment,
    };

    const update = {};
    if (round === '1') update.interviewRound1 = updateField;
    else if (round === '2') update.interviewRound2 = updateField;

    const updated = await Application.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Interview Scheduling Error:', err.message);
    res.status(500).json({ message: 'Failed to schedule interview' });
  }
});

// GET: export all applicants
router.get('/export/all-applicants/:recruiterId', async (req, res) => {
  try {
    const applications = await Application.find({ recruiterId: req.params.recruiterId });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Applicants');

    sheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Location', key: 'location' },
      { header: 'Score', key: 'score' },
      { header: 'Skills', key: 'skills' },
      { header: 'Test Status', key: 'testStatus' },
      { header: 'Onboarding', key: 'onboardingStatus' },
      { header: 'Interview 1', key: 'interview1' },
      { header: 'Interview 2', key: 'interview2' },
      { header: 'Job Title', key: 'jobTitle' },
      { header: 'Qualification', key: 'qualification' },
      { header: 'Experience', key: 'experience' },
      { header: 'Gender', key: 'gender' },
      { header: 'Kanaka Employee', key: 'isKanakaEmployee' },
      { header: 'Applied On', key: 'applicationDate' },
    ];

    applications.forEach(app => {
      sheet.addRow({
        name: app.name,
        email: app.email,
        phone: app.phone,
        location: app.location,
        score: app.score ?? 'N/A',
        skills: app.skills?.join(', ') || 'N/A',
        testStatus: app.testStatus || 'N/A',
        onboardingStatus: app.onboardingStatus || 'N/A',
        interview1: `${app.interviewRound1?.status || 'N/A'} - ${app.interviewRound1?.date?.toLocaleDateString() || ''}`,
        interview2: `${app.interviewRound2?.status || 'N/A'} - ${app.interviewRound2?.date?.toLocaleDateString() || ''}`,
        jobTitle: app.jobTitle || app.jobId?.title || 'N/A',
        qualification: app.qualification || 'N/A',
        experience: app.experience ?? 'N/A',
        gender: app.gender || 'N/A',
        isKanakaEmployee: app.isKanakaEmployee ? 'Yes' : 'No',
        applicationDate: app.applicationDate?.toLocaleDateString() || 'N/A',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="All_Applicants.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err.message);
    res.status(500).json({ message: 'Failed to export data' });
  }
});

// POST: Apply for job
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      resumeFile,
      recruiterId,
      skills,
      score,
      jobTitle,
      jobId,
      applicantId,
      qualification,
      experience,
      gender,
      isKanakaEmployee
    } = req.body;

    let onboardingStatus = 'Not Started';
    if (score >= 65) onboardingStatus = 'Shortlisted';

    const newApp = new Application({
      name,
      email,
      phone,
      location,
      resumeFile,
      recruiterId,
      skills,
      score,
      jobTitle,
      jobId,
      applicantId,
      onboardingStatus,
      qualification,
      experience,
      gender,
      isKanakaEmployee,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error('Apply error:', err.message);
    res.status(500).json({ message: 'Application submission failed' });
  }
});

module.exports = router;

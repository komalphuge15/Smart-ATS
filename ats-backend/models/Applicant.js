const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  name: String,
  email: String,
  resumeUrl: String,
  skills: [String],
  totalExperience: Number,
  jobTitle: String,
  jobId: String,
  matchScore: Number,
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Applicant', ApplicantSchema);

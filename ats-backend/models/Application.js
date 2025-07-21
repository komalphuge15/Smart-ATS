const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Applicant Info
  name: String,
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  tenth: String,
  twelfth: String,
  cgpa: String,
  location: String,
  availability: String,
  expectedSalary: String,
  resumeFile: String,

  // Parsed Resume Info
  score: Number,
  skills: [String],
}, { timestamps: true });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);

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

  qualification: {
    type: String,
    enum: ['BE', 'ME', 'MCA', 'MCS'],  
    default: 'BE'
  },
  experience: {
    type: Number,
    min: 0,
    max: 50
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  isKanakaEmployee: {
    type: Boolean,
    default: false
  },

  recruitmentStatus: {
    type: String,
    default: 'Applied',
  },

  // Parsed Resume Info
  score: Number,
  skills: [String],

  // Onboarding
  onboardingStatus: {
    type: String,
    enum: ['Not Started', 'Shortlisted', 'In Progress', 'Completed'],
    default: 'Not Started',
  },

  jobTitle: String,

  testStatus: {
    type: String,
    enum: ['Not Attempted', 'Cleared', 'Failed'],
    default: 'Not Attempted',
  },

  interviewRound1: {
    status: {
      type: String,
      enum: ['Pending', 'Cleared', 'Failed', 'Scheduled'],
      default: 'Pending',
    },
    date: Date,
    interviewer: String,
    comment: String,
  },

  interviewRound2: {
    status: {
      type: String,
      enum: ['Pending', 'Cleared', 'Failed', 'Scheduled'],
      default: 'Pending',
    },
    date: Date,
    interviewer: String,
    comment: String,
  },

  applicationDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);

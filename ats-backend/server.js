const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const applicantRoutes = require('./routes/applicantRoutes');
const jobRoutes = require('./routes/jobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const applyRoutes = require('./routes/applyRoutes');
require('dotenv').config();


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resumeParserRoute = require('./routes/resumeParserRoute');
app.use('/api/resume', resumeParserRoute);

// Routes
app.use('/api/applicants', applicantRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/apply', applyRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

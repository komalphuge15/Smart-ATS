const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/parse', upload.single('resume'), (req, res) => {
  const resumePath = path.join(__dirname, '..', req.file.path);
  const jobDesc = req.body.jobDescription;

  const command = `python resume-parser/parser.py "${resumePath}" "${jobDesc}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Python script error:', stderr);
      return res.status(500).json({ error: 'Resume parsing failed' });
    }

    try {
      const parsedData = JSON.parse(stdout);
      res.json(parsedData);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      res.status(500).json({ error: 'Invalid output from parser' });
    }
  });
});

module.exports = router;

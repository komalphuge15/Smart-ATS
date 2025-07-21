const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const natural = require('natural');

// List of predefined job-related skill phrases
const skill_phrases = [
  'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js',
  'Python', 'Java', 'HTML', 'CSS', 'C++', 'Machine Learning',
  'Deep Learning', 'Data Science', 'SQL', 'NoSQL', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'Git', 'REST APIs', 'Linux'
];

// Extract text from resume buffer
async function extractTextFromResume(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

// Extract matched skills from resume text
function extract_skills(text) {
  const tokens = text.toLowerCase().split(/[^a-zA-Z0-9+.#]/);
  const matched = [];

  for (const phrase of skill_phrases) {
    const lowerPhrase = phrase.toLowerCase();
    const phraseTokens = lowerPhrase.split(' ');

    if (phraseTokens.length === 1) {
      if (tokens.includes(lowerPhrase)) matched.push(phrase);
    } else {
      if (text.toLowerCase().includes(lowerPhrase)) matched.push(phrase);
    }
  }

  return [...new Set(matched)];
}

// Score = % of job skills matched
function calculate_manual_score(resumeSkills, jobSkills) {
  if (!jobSkills || jobSkills.length === 0) return { score: 0, matched: [] };

  const matched = resumeSkills.filter(skill =>
    jobSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const score = Math.round((matched.length / jobSkills.length) * 100);
  return { score, matched };
}

module.exports = {
  extractTextFromResume,
  extract_skills,
  calculate_manual_score,
};

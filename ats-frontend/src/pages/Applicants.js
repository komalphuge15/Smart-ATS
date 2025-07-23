import React, { useEffect, useState, useCallback } from 'react';
import './Applicants.css';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [skill, setSkill] = useState('');
  const [status, setStatus] = useState('');
  const [testStatus, setTestStatus] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [interview1, setInterview1] = useState('');
  const [interview2, setInterview2] = useState('');
  const [gender, setGender] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const recruiterId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
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
        toDate,
      }).toString();

      const res = await fetch(`http://localhost:5000/api/applications?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch applicants');
      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error('Fetch Error:', err.message);
      alert('Could not load applicants');
    } finally {
      setLoading(false);
    }
  }, [
    recruiterId, skill, status, testStatus, email, jobTitle, minScore,
    maxScore, qualification, experience, interview1, interview2,
    gender, fromDate, toDate, token,
  ]);

  useEffect(() => {
    if (recruiterId && token) fetchApplicants();
  }, [recruiterId, token, fetchApplicants]);

  const updateTestStatus = async (id, testStatus) => {
    await fetch(`http://localhost:5000/api/applications/test-status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testStatus }),
    });
    fetchApplicants();
  };

  const updateOnboarding = async (id, onboardingStatus) => {
    await fetch(`http://localhost:5000/api/applications/onboarding/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboardingStatus }),
    });
    fetchApplicants();
  };

  const sendEmail = async (id) => {
    const subject = prompt('Enter email subject:');
    const message = prompt('Enter email message:');
    if (!subject || !message) return;
    await fetch(`http://localhost:5000/api/applications/notify/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });
    alert('Email sent!');
  };

  const scheduleInterview = async (id) => {
    const round = prompt('Enter Interview Round (1 or 2):');
    const date = prompt('Enter Date (YYYY-MM-DD):');
    const interviewer = prompt('Interviewer Name:');
    const comment = prompt('Any comment?');
    await fetch(`http://localhost:5000/api/applications/interview/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ round, date, interviewer, comment }),
    });
    alert('Interview scheduled!');
  };

  const downloadExcel = async () => {
    const res = await fetch(`http://localhost:5000/api/applications/export/all-applicants/${recruiterId}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'All_Applicants.xlsx';
    a.click();
  };

  return (
    <div className="applicants-container">
      <h2>👨‍💼 Applicants for Your Jobs</h2>

      <div className="filters-grid">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        <input placeholder="Skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <input type="number" placeholder="Min Score" value={minScore} onChange={(e) => setMinScore(e.target.value)} />
        <input type="number" placeholder="Max Score" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
        <input placeholder="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} />
        <input type="number" placeholder="Experience (yrs)" value={experience} onChange={(e) => setExperience(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Onboarding</option>
          <option value="Not Started">Not Started</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={testStatus} onChange={(e) => setTestStatus(e.target.value)}>
          <option value="">All Test Status</option>
          <option value="Not Attempted">Not Attempted</option>
          <option value="Cleared">Cleared</option>
          <option value="Failed">Failed</option>
        </select>
        <select value={interview1} onChange={(e) => setInterview1(e.target.value)}>
          <option value="">Interview 1</option>
          <option value="Pending">Pending</option>
          <option value="Cleared">Cleared</option>
          <option value="Failed">Failed</option>
        </select>
        <select value={interview2} onChange={(e) => setInterview2(e.target.value)}>
          <option value="">Interview 2</option>
          <option value="Pending">Pending</option>
          <option value="Cleared">Cleared</option>
          <option value="Failed">Failed</option>
        </select>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      <div className="filter-actions">
        <button onClick={fetchApplicants}>🔍 Apply</button>
        <button onClick={() => {
          setEmail(''); setJobTitle(''); setSkill(''); setStatus('');
          setTestStatus(''); setMinScore(''); setMaxScore('');
          setQualification(''); setExperience(''); setInterview1('');
          setInterview2(''); setGender(''); setFromDate(''); setToDate('');
          fetchApplicants();
        }}>🔄 Clear</button>
        <button onClick={downloadExcel}>📥 Export All</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <div className="applicant-list">
          {applicants.map((a) => (
            <div key={a._id} className="applicant-card">
              <h4>{a.name}</h4>
              <p><strong>Email:</strong> {a.email}</p>
              <p><strong>Job Title:</strong> {a.jobId?.title || a.jobTitle || 'N/A'}</p>
              <p><strong>Score:</strong> {a.score ? `${a.score}%` : 'N/A'}</p>
              <p><strong>Skills:</strong> {a.skills?.join(', ') || 'N/A'}</p>
              <p><strong>Test Status:</strong> {a.testStatus}</p>
              <p><strong>Onboarding:</strong> {a.onboardingStatus}</p>
              <p><strong>Interview 1:</strong> {a.interviewRound1?.status}</p>
              <p><strong>Interview 2:</strong> {a.interviewRound2?.status}</p>
              <p><strong>Qualification:</strong> {a.qualification}</p>
              <p><strong>Experience:</strong> {a.experience}</p>
              <p><strong>Gender:</strong> {a.gender}</p>
              <p><strong>Kanaka Employee:</strong> {a.isKanakaEmployee ? 'Yes' : 'No'}</p>

              <a
                href={`http://localhost:5000/uploads/${a.resumeFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn"
              >
                View Resume
              </a>

              <div className="status-controls">
                <label>Onboarding:</label>
                <select value={a.onboardingStatus} onChange={(e) => updateOnboarding(a._id, e.target.value)}>
                  <option value="Not Started">Not Started</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <label>Test:</label>
                <select value={a.testStatus} onChange={(e) => updateTestStatus(a._id, e.target.value)}>
                  <option value="Not Attempted">Not Attempted</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="applicant-actions">
                <button onClick={() => sendEmail(a._id)}>📧 Email</button>
                <button onClick={() => scheduleInterview(a._id)}>📅 Schedule</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;

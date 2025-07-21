import React, { useEffect, useState } from 'react';
import './Applicants.css';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const recruiterId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/applicants/my-applicants/${recruiterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch');
        }

        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        console.error('Fetch Error:', err.message);
        alert('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    if (recruiterId && token) fetchApplicants();
  }, [recruiterId, token]);

  return (
    <div className="applicants-container">
      <h2>👨‍💼 Applicants for Your Jobs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="applicant-list">
          {applicants.map(a => (
            <div key={a._id} className="applicant-card">
              <h4>{a.applicantName}</h4>
              <p><strong>Email:</strong> {a.email}</p>
              <p><strong>Score:</strong> {a.score}%</p>
              <p><strong>Skills:</strong> {a.matchedSkills.join(', ')}</p>
              <p><strong>Job:</strong> {a.jobTitle} ({a.location})</p>
              <a
                href={`http://localhost:5000/uploads/${a.resumeFilename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-btn"
              >
                📄 View Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;

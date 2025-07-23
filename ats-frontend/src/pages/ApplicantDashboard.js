import React, { useEffect, useState } from 'react';
import './ApplicantDashboard.css';

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/apply/my-applications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await res.json();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
        alert('Error fetching applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userId, token]);

  return (
    <div className="dashboard-container">
      <h2>🎯 Your Applied Jobs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="applied-jobs-list">
          {applications.map((app) => (
            <div key={app._id} className="job-card">
              <h3>{app.jobId?.title}</h3>
              <p><strong>Qualification:</strong> {app.qualification || 'N/A'}</p>
              <p><strong>Experience:</strong> {app.experience || 'N/A'}</p>
              <p><strong>Gender:</strong> {app.gender || 'N/A'}</p>
              <p><strong>Kanaka Employee:</strong> {app.isKanakaEmployee || 'N/A'}</p>

              <p><strong>Location:</strong> {app.jobId?.location}</p>
              <p><strong>Status:</strong> Submitted</p>
              <p><strong>Application Date:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
              <p><strong>Resume Score:</strong> {app.score ? `${app.score}%` : 'N/A'}</p>
              <p><strong>Extracted Skills:</strong> {app.skills?.length ? app.skills.join(', ') : 'N/A'}</p>
              <p><strong>Shortlisting Status:</strong> 
                {app.onboardingStatus === "Shortlisted" ? " Shortlisted ✅" : app.onboardingStatus}
              </p>

              <p><strong>Onboarding Status:</strong> {app.onboardingStatus || 'N/A'}</p>
              <p><strong>Test Status:</strong> {app.testStatus || 'Not Attempted'}</p>
              <p><strong>Interview Round 1:</strong> {app.interviewRound1?.status || 'Pending'}</p>
              <p><strong>Interview Round 2:</strong> {app.interviewRound2?.status || 'Pending'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;

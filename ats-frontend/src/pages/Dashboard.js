import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        console.log(' Dashboard API Response:', data);
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (data && Array.isArray(data.applications)) {
          setApplications(data.applications);
        } else {
          console.error(' Unexpected format from dashboard API:', data);
          setApplications([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(' Failed to load dashboard data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h2>📊 My Application Dashboard</h2>
      {loading ? (
        <p className="empty">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="empty">No applications submitted yet. Start exploring jobs!</p>
      ) : (
        <div className="application-grid">
          {applications.map(app => (
            <div key={app._id} className="application-card">
              <div className="card-header">
                <h3>{app.jobTitle}</h3>
                <span className={`status-tag ${app.status?.toLowerCase()}`}>{app.status}</span>
              </div>
              <p><strong>Match Score:</strong> <span className="score">{app.matchScore}%</span></p>
              <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
              <Link to={`/applicants/${app._id}`} className="details-button">🔎 View Full Profile</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

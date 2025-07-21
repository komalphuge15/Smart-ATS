import React, { useEffect, useState } from 'react';
import './RecruiterDashboard.css';

const Dashboard = () => {
  const [jobCount, setJobCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);

  const recruiterId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!recruiterId || !token) return;

      try {
        const res = await fetch(`http://localhost:5000/api/dashboard/recruiter/${recruiterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setJobCount(data.jobCount || 0);
          setApplicantCount(data.applicantCount || 0);
        } else {
          alert(data.message || 'Failed to load dashboard stats');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        alert('Error loading dashboard data');
      }
    };
    
// Include token in dependencies
    fetchDashboardData();
  }, [recruiterId, token]); 

  return (
    <div className="dashboard-container">
      <h1>📊 Recruiter Dashboard</h1>
      <p className="dashboard-subtext">Track all your recruitment activity here.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h2>{jobCount}</h2>
          <p>Jobs Posted</p>
        </div>
        <div className="card">
          <h2>{applicantCount}</h2>
          <p>Total Applicants</p>
        </div>
      </div>

      <div className="dashboard-tip">
        💡 Tip: Stay proactive — regularly update job descriptions and follow up with top applicants.
      </div>
    </div>
  );
};

export default Dashboard;

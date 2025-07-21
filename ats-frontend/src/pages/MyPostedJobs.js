import React, { useEffect, useState, useCallback } from 'react';
import './MyPostedJobs.css';

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const recruiterId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  //  useCallback memoizes fetchJobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs?postedBy=${recruiterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setJobs(data);
      } else {
        alert(data.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  }, [recruiterId, token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Job deleted successfully');
        fetchJobs(); 
      } else {
        alert(data.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Server error during deletion');
    }
  };

  return (
    <div className="postedjobs-container">
      <h2>📂 My Posted Jobs</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Location:</strong> {job.location}</p>
              <p>{job.description}</p>
              <button
                className="delete-btn"
                onClick={() => handleDelete(job._id)}
              >
                🗑️ Delete Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;

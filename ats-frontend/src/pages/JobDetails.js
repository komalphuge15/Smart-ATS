import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams(); 
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error('Failed to load job', err));
  }, [id]);

  const handleApply = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Please log in first!');
      return;
    }

    const res = await fetch('http://localhost:5000/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        jobId: job._id,
        jobTitle: job.title,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Application submitted successfully!');
    } else {
      setMessage(data.message || 'Failed to apply.');
    }
  };

  if (!job) return <div>Loading job details...</div>;

  return (
    <div className="job-details">
      <h2>{job.title}</h2>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <button onClick={handleApply}>Apply for this Job</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JobDetails;

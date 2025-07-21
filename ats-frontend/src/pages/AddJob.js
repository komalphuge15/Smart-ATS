import React, { useState } from 'react';
import './AddJob.css';

const AddJob = () => {
  const [job, setJob] = useState({
    title: '',
    location: '',
    description: '',
    skills: '',
    salary: '',
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Posting job:', job);

    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();

      if (res.ok) {
        alert(' Job posted successfully!');
        setJob({ title: '', location: '', description: '', skills: '', salary: '' });
      } else {
        alert(data.message || ' Failed to post job');
      }
    } catch (err) {
      console.error('Post job error:', err);
      alert(' Server error, please try again later.');
    }
  };

  return (
    <div className="addjob-container">
      <h2 className="addjob-title">📝 Post a New Job</h2>
      <p className="addjob-subtext">Fill out the form below to post a new job opening and attract top talent.</p>
      <form className="addjob-form" onSubmit={handleSubmit}>
        <h4 className="form-section">Job Information</h4>
        <input
          type="text"
          name="title"
          placeholder="📌 Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="📍 Location"
          value={job.location}
          onChange={handleChange}
          required
        />

        <h4 className="form-section">Requirements</h4>
        <textarea
          name="description"
          placeholder="📝 Job Description"
          value={job.description}
          onChange={handleChange}
          rows="4"
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="💰 Salary Range (e.g. 5-7 LPA)"
          value={job.salary}
          onChange={handleChange}
        />

        <button type="submit">📤 Post Job</button>
      </form>
    </div>
  );
};

export default AddJob;

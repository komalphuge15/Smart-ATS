import React, { useState, useEffect } from 'react';
import './Applications.css';

const Applications = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    tenth: '',
    twelfth: '',
    cgpa: '',
    location: '',
    availability: '',
    expectedSalary: '',
    jobId: '',
    resumeFile: null,
  });

  const [jobOptions, setJobOptions] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        const data = await res.json();
        setJobOptions(data);
      } catch (err) {
        console.error('Error fetching job options:', err);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resumeFile') {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert(' Application submitted successfully!');
        if (onSubmit) onSubmit(data.application);
        setFormData({
          name: '',
          email: '',
          phone: '',
          github: '',
          linkedin: '',
          tenth: '',
          twelfth: '',
          cgpa: '',
          location: '',
          availability: '',
          expectedSalary: '',
          jobId: '',
          resumeFile: null,
        });
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error(' Error submitting application:', error);
      alert('Server error during application');
    }
  };

  return (
    <div className="applications-page">
      <h1>📤 Submit Job Application</h1>
      <form className="application-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} required onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} required onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone" value={formData.phone} required onChange={handleChange} />
        <input type="text" name="github" placeholder="GitHub" value={formData.github} onChange={handleChange} />
        <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} />
        <input type="text" name="tenth" placeholder="10th %" value={formData.tenth} required onChange={handleChange} />
        <input type="text" name="twelfth" placeholder="12th %" value={formData.twelfth} required onChange={handleChange} />
        <input type="text" name="cgpa" placeholder="CGPA" value={formData.cgpa} required onChange={handleChange} />
        <input type="text" name="location" placeholder="Preferred Location" value={formData.location} onChange={handleChange} />
        

        <select name="jobId" value={formData.jobId} required onChange={handleChange}>
          <option value="">Select Job Position</option>
          {jobOptions.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} - {job.location}
            </option>
          ))}
        </select>

        <input type="file" name="resumeFile" accept=".pdf,.doc,.docx" required onChange={handleChange} />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default Applications;

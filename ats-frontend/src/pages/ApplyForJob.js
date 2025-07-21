import React, { useEffect, useState } from 'react';
import './ApplyForJob.css';

const ApplyForJob = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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
    resumeFile: null,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resumeFile') {
      setFormData({ ...formData, resumeFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedJob) return alert("Please select a job first.");

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }
    form.append('jobId', selectedJob._id);

    try {
      const res = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || 'Application submitted successfully!');
        setSelectedJob(null);
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
          resumeFile: null,
        });
      } else {
        alert(data.message || 'Failed to apply');
      }
    } catch (error) {
      console.error('Apply error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="apply-job-container">
      <h1 className="apply-heading">🚀 Apply for a Job</h1>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Skills:</strong> {job.skills}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <button onClick={() => handleApplyClick(job)}>Apply Now</button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="application-form-container">
          <h2>Apply for: {selectedJob.title}</h2>
          <form className="apply-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="👤 Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="📧 Email Address" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="📞 Phone Number" value={formData.phone} onChange={handleChange} required />
            <input type="url" name="linkedin" placeholder="🔗 LinkedIn Profile" value={formData.linkedin} onChange={handleChange} />
            <input type="url" name="github" placeholder="💻 GitHub Profile" value={formData.github} onChange={handleChange} />
            <input type="text" name="tenth" placeholder="🎓 10th %" value={formData.tenth} onChange={handleChange} required />
            <input type="text" name="twelfth" placeholder="🏫 12th %" value={formData.twelfth} onChange={handleChange} required />
            <input type="text" name="cgpa" placeholder="📘 CGPA" value={formData.cgpa} onChange={handleChange} required />
           
            <label>📄 Upload Resume (PDF)</label>
            <input type="file" name="resumeFile" accept=".pdf" onChange={handleChange} required />
            <button type="submit">Submit Application</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplyForJob;

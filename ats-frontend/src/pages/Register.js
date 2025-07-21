import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    role: 'applicant',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const formToSend = new FormData();
      for (const key in formData) {
        formToSend.append(key, formData[key]);
      }

      if (resumeFile) {
        formToSend.append('resume', resumeFile);
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: formToSend,
      });

      let data;
      const text = await res.text();

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ JSON parse error:', err);
        console.error('🔴 Raw response:', text);
        alert('Unexpected server response. Please check the console.');
        return;
      }

      console.log('Register response:', data);

      if (res.ok) {
        alert(data.message || 'Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2>Create Your Smart ATS Account</h2>
        <p className="subtext">Join as an applicant or recruiter to start your journey</p>
        <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
            />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn Profile URL"
              onChange={handleChange}
            />
            <input
              type="url"
              name="github"
              placeholder="GitHub Profile URL"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="url"
              name="portfolio"
              placeholder="Portfolio Website (Optional)"
              onChange={handleChange}
            />
            {formData.role === 'applicant' && (
              <input
                type="file"
                accept=".pdf"
                name="resume"
                onChange={handleFileChange}
                required
              />
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Register Account</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-title">Smart ATS</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard">Dashboard</Link>

            {role === 'applicant' && <Link to="/apply">Apply for Job</Link>}

            {role === 'recruiter' && (
              <>
                <Link to="/addjob">Post Job</Link>
                <Link to="/mypostedjobs">My Posted Jobs</Link>
                <Link to="/applicants">Applicants</Link>
              </>
            )}

            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

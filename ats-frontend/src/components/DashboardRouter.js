import React from 'react';
import { Navigate } from 'react-router-dom';
import ApplicantDashboard from '../pages/ApplicantDashboard';
import RecruiterDashboard from '../pages/RecruiterDashboard';


const DashboardRouter = () => {
  const role = localStorage.getItem('userRole');

  if (role === 'applicant') return <ApplicantDashboard />;
  if (role === 'recruiter') return <RecruiterDashboard />;
  
  return <Navigate to="/login" />; 
};

export default DashboardRouter;

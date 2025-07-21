import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import DashboardRouter from './components/DashboardRouter';

// Pages
import Home from './pages/Home';

// import JobDetails from './pages/JobDetails';
// import Apply from './pages/Apply';
import ApplyJob from './pages/ApplyForJob'; 
import MyPostedJobs from './pages/MyPostedJobs'; 
import AddJob from './pages/AddJob';
import Applicants from './pages/Applicants';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';





const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/apply/:jobId" element={<Apply />} /> */}

            {/* ✅ Role-based dashboard */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* ✅ Applicant-specific */}
            <Route path="/apply" element={<ApplyJob />} />


            {/* ✅ Recruiter-specific */}
            <Route path="/addjob" element={<AddJob />} />
            <Route path="/mypostedjobs" element={<MyPostedJobs />} />
            <Route path="/applicants" element={<Applicants />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

            
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

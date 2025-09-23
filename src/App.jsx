import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import JobsBoard from './pages/JobsBoard';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/CandidatesPage'; 
import CandidateProfilePage from './pages/CandidatesProfilePage'; 
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import AssessmentFormPage from './pages/AssessmentFormPage';
// Basic styles for the navigation
const navStyles = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem 2rem',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #dee2e6'
};

const navLinkStyles = {
  textDecoration: 'none',
  color: '#007bff',
  fontWeight: 'bold',
};

const activeLinkStyles = {
  color: '#0056b3',
  textDecoration: 'underline',
};

function App() {
  return (
    <div className="App">
      <nav style={navStyles}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({ ...navLinkStyles, ...(isActive ? activeLinkStyles : {}) })}
        >
          Jobs
        </NavLink>
        <NavLink 
          to="/candidates" 
          style={({ isActive }) => ({ ...navLinkStyles, ...(isActive ? activeLinkStyles : {}) })}
        >
          Candidates
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<JobsBoard />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
         <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilderPage />} />
        <Route path="/jobs/:jobId/apply" element={<AssessmentFormPage />} />
      </Routes>
    </div>
  );
}

export default App;
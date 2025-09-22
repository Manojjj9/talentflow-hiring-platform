import React from 'react';
import { Routes, Route } from 'react-router-dom';
import JobsBoard from './pages/JobsBoard';
import JobDetailPage from './pages/JobDetailPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<JobsBoard />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
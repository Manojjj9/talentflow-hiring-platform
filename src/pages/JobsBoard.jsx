// src/pages/JobsBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../features/jobs/components/JobCard';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import JobForm from '../features/jobs/components/JobForm'; // Import the new form
import './JobsBoard.css';

const PAGE_SIZE = 10;

const JobsBoard = () => {
  // ... All existing state remains the same (jobs, loading, error, etc.) ...
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    tags: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    // ... fetchJobs function remains the same ...
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, pageSize: PAGE_SIZE, ...filters });
      const response = await fetch(`/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    // ... handleFilterChange function remains the same ...
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    setCurrentPage(1);

  };

  // New function to handle form submission
  const handleCreateJob = async (formData) => {
    try {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create job.');
      }
      setIsModalOpen(false); // Close modal on success
      fetchJobs(); // Refresh the jobs list
    } catch (err) {
      console.error(err);
      // Here you could set an error message to display in the modal
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="jobs-header">
        <h1>Jobs Board</h1>
        <button className="create-job-btn" onClick={() => setIsModalOpen(true)}>
          + Create Job
        </button>
      </div>

      {/* ... (filters and job list rendering remain the same) ... */}
      <div className="filters">
        <div>
          <label htmlFor="search">Search by Title</label>
          <input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="e.g., Senior Developer" />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label htmlFor="tags">Search by Tag</label>
          <input type="text" id="tags" name="tags" value={filters.tags} onChange={handleFilterChange} placeholder="e.g., Engineering" />
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      {loading && <div>Loading jobs...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && jobs.length > 0 && (
        <div className="job-list">{jobs.map(job => (<JobCard key={job.id} job={job} />))}</div>
      )}
      {!loading && !error && jobs.length === 0 && (<div>No jobs found matching your criteria.</div>)}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Render the Modal with the JobForm inside it */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create a New Job"
      >
        <JobForm 
          onSave={handleCreateJob} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default JobsBoard;
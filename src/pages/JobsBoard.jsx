import React, { useState, useEffect, useCallback } from 'react';
import JobCard from '../features/jobs/components/JobCard';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import JobForm from '../features/jobs/components/JobForm';
import './JobsBoard.css';

const PAGE_SIZE = 10;

const JobsBoard = () => {
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ search: '', status: 'all', tags: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = useCallback(async () => { 
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, pageSize: PAGE_SIZE, ...filters });
      const response = await fetch(`/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setJobs(data.jobs);
      setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  }, [currentPage, filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleFilterChange = (e) => { 
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => { 
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { 
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSaveJob = async (formData) => { 
    const url = editingJob ? `/jobs/${editingJob.id}` : '/jobs';
    const method = editingJob ? 'PATCH' : 'POST';
    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    handleCloseModal();
    fetchJobs();
  };

  
  const handleArchiveToggle = async (job) => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    await fetch(`/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchJobs(); 
  };

  return (
    <div style={{ padding: '20px' }}>
      
      <div className="jobs-header">
        <h1>Jobs Board</h1>
        <button className="create-job-btn" onClick={handleOpenCreateModal}>+ Create Job</button>
      </div>
      <div className="filters">
        <div><label htmlFor="search">Search by Title</label><input type="text" id="search" name="search" value={filters.search} onChange={handleFilterChange} placeholder="e.g., Senior Developer" /></div>
        <div><label htmlFor="status">Status</label><select id="status" name="status" value={filters.status} onChange={handleFilterChange}><option value="all">All</option><option value="active">Active</option><option value="archived">Archived</option></select></div>
        <div><label htmlFor="tags">Search by Tag</label><input type="text" id="tags" name="tags" value={filters.tags} onChange={handleFilterChange} placeholder="e.g., Engineering" /></div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
      
      {loading && <div>Loading jobs...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div className="job-list">
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onEdit={() => handleOpenEditModal(job)}
              onArchiveToggle={() => handleArchiveToggle(job)} 
            />
          ))}
        </div>
      )}
      
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingJob ? "Edit Job" : "Create a New Job"}>
        <JobForm onSave={handleSaveJob} onCancel={handleCloseModal} initialData={editingJob} />
      </Modal>
    </div>
  );
};

export default JobsBoard;
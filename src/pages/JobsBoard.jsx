import React, { useState, useEffect } from 'react';
import JobCard from '../features/jobs/components/JobCard';
import Pagination from '../components/common/Pagination';

const PAGE_SIZE = 10;

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Requesting the specific page from the API
        const response = await fetch(`/jobs?page=${currentPage}&pageSize=${PAGE_SIZE}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJobs(data.jobs);
        // Calculating total pages based on the total count from the API
        setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]); // Re-runing the effect when currentPage changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Jobs Board</h1>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {loading && <div>Loading jobs...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && (
        <div className="job-list">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default JobsBoard;
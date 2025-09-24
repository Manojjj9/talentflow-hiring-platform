import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './JobDetailPage.css';

const JobDetailPage = () => {
  const { jobId } = useParams(); 
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Job not found.');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return <div>Loading job details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!job) return <div>Job not found.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Link to="/" className="back-link">
        &larr; Back to Jobs Board
      </Link>
      <h1>{job.title}</h1>
      <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{job.status}</span></p>
      <div>
        <strong>Tags:</strong>
        {job.tags.map(tag => (
          <span key={tag} style={{ backgroundColor: '#eee', padding: '4px 8px', borderRadius: '4px', marginLeft: '8px' }}>
            {tag}
          </span>
        ))}
      </div>
      {/* <p style={{ marginTop: '20px' }}><em>(More job details would go here...)</em></p> */}

      {/* <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <Link to={`/jobs/${jobId}/assessment`} className="edit-btn" style={{ textDecoration: 'none' }}>
          Manage Assessment
        </Link>
      </div> */}

      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' }}>
        <Link to={`/jobs/${jobId}/apply`} className="create-job-btn" style={{ textDecoration: 'none' }}>
          Apply Now
        </Link>
        <Link to={`/jobs/${jobId}/assessment`} className="edit-btn" style={{ textDecoration: 'none' }}>
          Manage Assessment
        </Link>
      </div>
    </div>


  );
};

export default JobDetailPage;
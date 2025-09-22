import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onEdit, onArchiveToggle }) => {
  return (
    <div className={`job-card ${job.status}`}>
      
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="job-status">{job.status}</span>
      </div>
      <div className="job-card-body">
        <p>Order: {job.order}</p>
        <div className="job-tags">
          {job.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="job-card-actions">
       
        <button 
          onClick={onArchiveToggle} 
          className="archive-btn"
        >
          {job.status === 'active' ? 'Archive' : 'Unarchive'}
        </button>
        <button onClick={onEdit} className="edit-btn">Edit</button>
      </div>
    </div>
  );
};

export default JobCard;
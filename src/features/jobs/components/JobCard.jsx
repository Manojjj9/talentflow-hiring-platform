
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, onEdit, onArchiveToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab', 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`job-card ${job.status}`}>
      <div className="job-card-header">
        <h3 className="job-title">
          <Link to={`/jobs/${job.id}`} className="job-title-link" onClick={(e) => e.preventDefault()}>
            {job.title}
          </Link>
        </h3>
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
        <button onClick={onArchiveToggle} className="archive-btn">
          {job.status === 'active' ? 'Archive' : 'Unarchive'}
        </button>
        <button onClick={onEdit} className="edit-btn">Edit</button>
      </div>
    </div>
  );
};

export default JobCard;
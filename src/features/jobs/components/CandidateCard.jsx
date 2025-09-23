
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: { candidate },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1, 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="candidate-card"
    >
      <div {...listeners} {...attributes} style={{ cursor: 'grab', flexGrow: 1 }}>
        <p className="candidate-name">{candidate.name}</p>
        <p className="candidate-email">{candidate.email}</p>
      </div>
      <Link to={`/candidates/${candidate.id}`} className="profile-link">
        View Profile
      </Link>
    </div>
  );
};

export default CandidateCard;
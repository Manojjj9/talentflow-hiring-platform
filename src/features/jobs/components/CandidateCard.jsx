
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const CandidateCard = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
    data: { candidate }, 
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="candidate-card"
    >
      <p className="candidate-name">{candidate.name}</p>
      <p className="candidate-email">{candidate.email}</p>
    </div>
  );
};

export default CandidateCard;

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import CandidateCard from './CandidateCard';

const StageColumn = ({ stage, candidates }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: stage.id,
  });

  const style = {
    backgroundColor: isOver ? '#cce5ff' : undefined, // Highlight when dragging over
  };

  return (
    <div ref={setNodeRef} className="stage-column" style={style}>
      <h3 className="stage-title">{stage.title} ({candidates.length})</h3>
      <div className="card-list">
        {candidates.map(candidate => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
};

export default StageColumn;
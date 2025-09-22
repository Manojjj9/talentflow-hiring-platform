
import React, { useState, useEffect, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import StageColumn from '../features/jobs/components/StageColumn';
import './CandidatesPage.css';

const STAGES = [
  { id: 'applied', title: 'Applied' },
  { id: 'screen', title: 'Screen' },
  { id: 'tech', title: 'Tech' },
  { id: 'offer', title: 'Offer' },
  { id: 'hired', title: 'Hired' },
  { id: 'rejected', title: 'Rejected' },
];

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCandidates = async () => {
      setLoading(true);
      const response = await fetch('/candidates?pageSize=1000');
      const data = await response.json();
      setCandidates(data.candidates);
      setLoading(false);
    };
    fetchAllCandidates();
  }, []);

  const candidatesByStage = useMemo(() => {
    const grouped = {};
    STAGES.forEach(stage => {
      grouped[stage.id] = candidates.filter(c => c.stage === stage.id);
    });
    return grouped;
  }, [candidates]);

  // This function runs when a drag operation ends
  const handleDragEnd = async (event) => {
    const { over, active } = event;

    
    if (over && over.id) {
      const candidateId = active.id;
      const newStage = over.id;
      
      // Optimistically updates the UI
      setCandidates(prev => 
        prev.map(c => 
          c.id === candidateId ? { ...c, stage: newStage } : c
        )
      );

      // Persist the change to the mock API
      await fetch(`/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading Kanban board...</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STAGES.map(stage => (
          <StageColumn
            key={stage.id}
            stage={stage}
            candidates={candidatesByStage[stage.id]}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default CandidatesPage;
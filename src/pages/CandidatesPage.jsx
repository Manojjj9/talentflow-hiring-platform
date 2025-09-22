// src/pages/CandidatesPage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import './CandidatesPage.css'; // Import our new styles

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for client-side search
  const [searchTerm, setSearchTerm] = useState('');
  // State for server-side stage filter
  const [stageFilter, setStageFilter] = useState('all');

  // Fetch data whenever the server-side filter changes
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      // NOTE: We fetch ALL candidates for a given stage to enable client-side search.
      // A more robust solution might paginate, but this fulfills the specific requirement.
      const response = await fetch(`/candidates?stage=${stageFilter}&pageSize=1000`);
      const data = await response.json();
      setCandidates(data.candidates);
      setLoading(false);
    };

    fetchCandidates();
  }, [stageFilter]);

  // Apply client-side search filter
  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    return candidates.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  // Setup for virtualization
  const parentRef = useRef();
  const rowVirtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73, // Estimate height of a row
    overscan: 5,
  });

  return (
    <div className="candidates-container">
      <h1>Candidates</h1>

      {/* Re-use the filters component styles from JobsBoard */}
      <div className="filters">
        <div>
          <label htmlFor="search-candidate">Search by Name/Email (Client-Side)</label>
          <input
            type="text"
            id="search-candidate"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div>
          <label htmlFor="stage-filter">Filter by Stage (Server-Side)</label>
          <select 
            id="stage-filter" 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screen">Screen</option>
            <option value="tech">Tech</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading candidates...</p>}

      {!loading && (
        <div ref={parentRef} className="list-container">
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map(virtualItem => {
              const candidate = filteredCandidates[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="list-item"
                >
                  <div className="candidate-info">
                    {candidate.name}
                    <span>{candidate.email}</span>
                  </div>
                  <div className="candidate-stage">{candidate.stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;
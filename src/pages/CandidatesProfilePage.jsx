
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CandidatesProfilePage.css';

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Fetch candidate details and timeline in parallel
        const [candidateRes, timelineRes] = await Promise.all([
          fetch(`/candidates/${candidateId}`),
          fetch(`/candidates/${candidateId}/timeline`),
        ]);
        if (!candidateRes.ok || !timelineRes.ok) {
          throw new Error('Could not fetch candidate profile data.');
        }

        const candidateData = await candidateRes.json();
        const timelineData = await timelineRes.json();
        
        setCandidate(candidateData);
        setTimeline(timelineData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [candidateId]);

  if (loading) return <div>Loading profile...</div>;
  if (!candidate) return <div>Candidate not found.</div>;

  return (
    <div className="profile-container">
      <Link to="/candidates" className="back-link">&larr; Back to Kanban Board</Link>
      <div className="profile-header">
        <h1>{candidate.name}</h1>
        <p>{candidate.email}</p>
      </div>
      <h2>Hiring Timeline</h2>
      <ul className="timeline">
        {timeline.map((item, index) => (
          <li key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <p className="timeline-date">{new Date(item.date).toLocaleDateString()}</p>
            <h4 className="timeline-stage">{item.stage}</h4>
            <p className="timeline-notes">{item.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateProfilePage;
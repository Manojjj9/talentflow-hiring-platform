import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CandidatesProfilePage.css';

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    const notesRes = await fetch(`/candidates/${candidateId}/notes`);
    if (notesRes.ok) {
      const notesData = await notesRes.json();
      setNotes(notesData);
    }
  }, [candidateId]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
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
        fetchNotes(); // Fetch notes after initial data is loaded
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [candidateId, fetchNotes]);

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    await fetch(`/candidates/${candidateId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newNoteText }),
    });
    
    setNewNoteText(''); // Clear the textarea
    fetchNotes(); // Refresh the notes list
  };

  if (loading) return <div>Loading profile...</div>;
  if (!candidate) return <div>Candidate not found.</div>;

  return (
    <div className="profile-container">
      <Link to="/candidates" className="back-link">&larr; Back to Kanban Board</Link>
      
      <div className="profile-header">
        <h1>{candidate.name}</h1>
        <p>{candidate.email}</p>
      </div>

      <div className="notes-section">
        <h2>Notes</h2>
        <form onSubmit={handleNoteSubmit} className="note-form">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add a note... use @ to mention a user."
          />
          <button type="submit">Save Note</button>
        </form>
        <ul className="notes-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <p className="note-date">
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <p className="note-text">{note.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="timeline-section" style={{marginTop: '40px'}}>
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
    </div>
  );
};

export default CandidateProfilePage;
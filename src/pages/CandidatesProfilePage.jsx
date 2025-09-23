import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CandidatesProfilePage.css';

// A mock list of users for @mention suggestions
const MOCK_USERS = [
  { id: 1, name: 'Jane Doe' },
  { id: 2, name: 'John Smith' },
  { id: 3, name: 'Peter Jones' },
];

const CandidateProfilePage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  // State for managing @mention suggestions
  const [mentionQuery, setMentionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    
    setNewNoteText('');
    setShowSuggestions(false);
    fetchNotes();
  };

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setNewNoteText(text);

    const lastAtPos = text.lastIndexOf('@');
    const lastSpacePos = text.lastIndexOf(' ');

    if (lastAtPos > lastSpacePos) {
      const query = text.substring(lastAtPos + 1);
      setMentionQuery(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
    const lastAtPos = newNoteText.lastIndexOf('@');
    const textBefore = newNoteText.substring(0, lastAtPos);
    setNewNoteText(`${textBefore}@${name} `);
    setShowSuggestions(false);
  };

  const renderNoteText = (text) => {
    const parts = text.split(/(@[A-Za-z\s]+)/g);
    return parts.map((part, i) =>
      part.startsWith('@') && MOCK_USERS.some(u => part.substring(1).trim() === u.name) ? (
        <strong key={i} className="mention">{part}</strong>
      ) : (
        part
      )
    );
  };

  const mentionSuggestions = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );
  
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
          <div className="textarea-wrapper">
            <textarea
              value={newNoteText}
              onChange={handleNoteChange}
              placeholder="Add a note... use @ to mention a user."
            />
            {showSuggestions && mentionSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {mentionSuggestions.map(user => (
                  <li key={user.id} onClick={() => handleSuggestionClick(user.name)}>
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit">Save Note</button>
        </form>
        <ul className="notes-list">
          {notes.map(note => (
            <li key={note.id} className="note-item">
              <p className="note-date">{new Date(note.createdAt).toLocaleString()}</p>
              <p className="note-text">{renderNoteText(note.text)}</p>
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
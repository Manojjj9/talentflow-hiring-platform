import React, { useState } from 'react';
import './JobForm.css'; 

const JobForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    // Converting comma-separated string to an array of strings
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onSave({ title, tags: tagsArray });
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      {error && <p className="form-error">{error}</p>}
      <div className="form-group">
        <label htmlFor="title">Job Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(''); 
          }}
          placeholder="e.g., Senior React Developer"
        />
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., react, javascript, remote"
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-save">
          Save Job
        </button>
      </div>
    </form>
  );
};

export default JobForm;
// src/features/assessments/components/QuestionEditor.jsx
import React from 'react';

const QuestionEditor = ({ question, onQuestionChange, onRemoveQuestion, onAddOption, onRemoveOption }) => {
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    onQuestionChange(question.id, { ...question, [name]: newValue });
  };

  const handleOptionChange = (optionId, value) => {
    const newOptions = question.options.map(opt => 
      opt.id === optionId ? { ...opt, value } : opt
    );
    onQuestionChange(question.id, { ...question, options: newOptions });
  };
  
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    onQuestionChange(question.id, { 
      ...question, 
      range: { ...question.range, [name]: parseInt(value) || '' } 
    });
  };

  return (
    <div className="question-editor">
      <div className="question-header">
        <select name="type" value={question.type} onChange={handleInputChange}>
          <option value="short-text">Short Text</option>
          <option value="long-text">Long Text</option>
          <option value="single-choice">Single-Choice</option>
          <option value="multi-choice">Multi-Choice</option>
          <option value="numeric">Numeric</option>
          <option value="file-upload">File Upload</option>
        </select>
        <button onClick={onRemoveQuestion} className="remove-btn">&times;</button>
      </div>
      <input
        type="text"
        name="label"
        value={question.label}
        onChange={handleInputChange}
        placeholder="Enter your question label"
        className="question-label-input"
      />
      
      {['single-choice', 'multi-choice'].includes(question.type) && (
        <div className="options-container">
          <label>Options:</label>
          {question.options.map(option => (
            <div key={option.id} className="option-item">
              <input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder="Option text"
              />
              <button onClick={() => onRemoveOption(option.id)} className="remove-option-btn">-</button>
            </div>
          ))}
          <button onClick={onAddOption} className="add-option-btn">+ Add Option</button>
        </div>
      )}

      {question.type === 'numeric' && (
        <div className="numeric-range-container">
          <label>Range:</label>
          <input type="number" name="min" value={question.range?.min || ''} onChange={handleRangeChange} placeholder="Min" />
          <input type="number" name="max" value={question.range?.max || ''} onChange={handleRangeChange} placeholder="Max" />
        </div>
      )}

      <div className="validation-container">
        <label>
          <input type="checkbox" name="required" checked={!!question.required} onChange={handleInputChange} />
          Required
        </label>
      </div>
    </div>
  );
};

export default QuestionEditor;
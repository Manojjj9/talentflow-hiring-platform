// src/features/assessments/components/FormPreview.jsx
import React from 'react';

const FormPreview = ({ structure }) => {
  if (!structure) return null;

  return (
    <div className="form-preview">
      <h2>{structure.title}</h2>
      {structure.sections.map(section => (
        <div key={section.id} className="preview-section">
          <h3>{section.title}</h3>
          {section.questions.map(q => (
            <div key={q.id} className="preview-question">
              <label>{q.label} {q.required && <span className="required-asterisk">*</span>}</label>
              
              {q.type === 'short-text' && <input type="text" disabled />}
              {q.type === 'long-text' && <textarea disabled />}
              
              {q.type === 'single-choice' && q.options.map(opt => (
                <div key={opt.id} className="preview-option">
                  <input type="radio" name={q.id} disabled />
                  <span>{opt.value || `Option`}</span>
                </div>
              ))}
              
              {q.type === 'multi-choice' && q.options.map(opt => (
                <div key={opt.id} className="preview-option">
                  <input type="checkbox" name={q.id} disabled />
                  <span>{opt.value || `Option`}</span>
                </div>
              ))}
              
              {q.type === 'numeric' && (
                <input 
                  type="number" 
                  min={q.range?.min} 
                  max={q.range?.max} 
                  placeholder={`Number between ${q.range?.min || '...'} and ${q.range?.max || '...'}`} 
                  disabled 
                />
              )}

              {q.type === 'file-upload' && (
                <div className="preview-file-upload">
                  <button disabled>Choose File</button>
                  <span>No file chosen</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormPreview;
// src/pages
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AssessmentFormPage.css';

const AssessmentFormPage = () => {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/assessments/${jobId}`);
        const data = await res.json();
        setAssessment(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchAssessment();
  }, [jobId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    assessment.structure.sections.forEach(section => {
      section.questions.forEach(q => {
        const answer = answers[q.id];
        if (q.required && (!answer || answer.length === 0)) {
          newErrors[q.id] = 'This field is required.';
        }
        if (q.type === 'numeric' && answer) {
          const num = Number(answer);
          if (q.range?.min && num < q.range.min) newErrors[q.id] = `Must be at least ${q.range.min}.`;
          if (q.range?.max && num > q.range.max) newErrors[q.id] = `Must be no more than ${q.range.max}.`;
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await fetch(`/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      setSubmitted(true);
    }
  };

  if (loading) return <div>Loading Assessment...</div>;
  if (!assessment?.structure?.sections?.length) return <div>This job does not have an assessment.</div>;

  if (submitted) {
    return (
      <div className="form-runtime-container">
        <h1>Thank You!</h1>
        <p>Your assessment has been submitted successfully.</p>
        <Link to={`/jobs/${jobId}`}>&larr; Back to Job Details</Link>
      </div>
    );
  }

  return (
    <div className="form-runtime-container">
      <h1>{assessment.structure.title}</h1>
      <form onSubmit={handleSubmit} noValidate>
        {assessment.structure.sections.map(section => (
          <div key={section.id}>
            <h2>{section.title}</h2>
            {section.questions.map(q => (
              <div key={q.id} className="form-question">
                <label>
                  {q.label} 
                  {q.required && <span className="required-asterisk"> *</span>}
                </label>
                {/* Render different input types based on question.type */}
                { q.type === 'short-text' && <input type="text" value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} /> }
                { q.type === 'long-text' && <textarea value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} /> }
                { q.type === 'numeric' && <input type="number" value={answers[q.id] || ''} onChange={e => handleAnswerChange(q.id, e.target.value)} /> }
                { q.type === 'file-upload' && <input type="file" /> /* File inputs are not easily managed in this simple state */}
                
                { q.type === 'single-choice' && q.options.map(opt => (
                  <div key={opt.id} className="form-option">
                    <input type="radio" name={q.id} value={opt.value} checked={answers[q.id] === opt.value} onChange={e => handleAnswerChange(q.id, e.target.value)} />
                    <label>{opt.value}</label>
                  </div>
                ))}

                { q.type === 'multi-choice' && q.options.map(opt => (
                  <div key={opt.id} className="form-option">
                    <input type="checkbox" value={opt.value} checked={(answers[q.id] || []).includes(opt.value)} 
                           onChange={e => {
                             const currentAnswers = answers[q.id] || [];
                             const newAnswers = e.target.checked ? [...currentAnswers, opt.value] : currentAnswers.filter(v => v !== opt.value);
                             handleAnswerChange(q.id, newAnswers);
                           }} />
                    <label>{opt.value}</label>
                  </div>
                ))}
                {errors[q.id] && <p className="error-message">{errors[q.id]}</p>}
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit Assessment</button>
      </form>
    </div>
  );
};

export default AssessmentFormPage;
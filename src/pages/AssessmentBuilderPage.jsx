import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import QuestionEditor from '../features/jobs/components/QuestionEditor';
import FormPreview from '../features/jobs/components/FormPreview';
import './AssessmentBuilderPage.css';

const AssessmentBuilderPage = () => {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = useCallback(async () => {
    // We wrapped this logic in a try...catch...finally block
    try {
      setLoading(true); // Set loading to true at the start of the fetch
      const res = await fetch(`/assessments/${jobId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch assessment data.");
      }
      const data = await res.json();
      setAssessment(data);
    } catch (error) {
      console.error("Error fetching assessment:", error);
    } finally {
      // This 'finally' block ensures that loading is always set to false,
      // even if an error occurs.
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  const handleSave = async () => {
    await fetch(`/assessments/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment.structure),
    });
    alert('Assessment saved!');
  };
  
  // This is the full code with all the handler functions from the previous step
  const handleAddSection = () => {
    const newSection = { id: `s${Date.now()}`, title: 'New Section', questions: [] };
    const newStructure = { ...assessment.structure, sections: [...assessment.structure.sections, newSection] };
    setAssessment({ ...assessment, structure: newStructure });
  };

  const handleAddQuestion = (sectionId) => {
    const newQuestion = { id: `q${Date.now()}`, type: 'short-text', label: 'New Question', required: false };
    if (['single-choice', 'multi-choice'].includes(newQuestion.type)) {
      newQuestion.options = [{ id: `o${Date.now()}`, value: '' }];
    }
    const newStructure = {
      ...assessment.structure,
      sections: assessment.structure.sections.map(s => s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s),
    };
    setAssessment({ ...assessment, structure: newStructure });
  };

  const handleQuestionChange = (sectionId, questionId, updatedQuestion) => {
    if (['single-choice', 'multi-choice'].includes(updatedQuestion.type) && !updatedQuestion.options) {
      updatedQuestion.options = [{ id: `o${Date.now()}`, value: '' }];
    }
    const newStructure = {
      ...assessment.structure,
      sections: assessment.structure.sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.map(q => q.id === questionId ? updatedQuestion : q) } : s ),
    };
    setAssessment({ ...assessment, structure: newStructure });

  };
  
  const handleRemoveQuestion = (sectionId, questionId) => {
     const newStructure = {
      ...assessment.structure,
      sections: assessment.structure.sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } : s ),
    };
    setAssessment({ ...assessment, structure: newStructure });
  };

  const handleAddOption = (sectionId, questionId) => {
    const newOption = { id: `o${Date.now()}`, value: '' };
    const newStructure = {
      ...assessment.structure,
      sections: assessment.structure.sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, options: [...q.options, newOption] } : q )} : s ),
    };
    setAssessment({ ...assessment, structure: newStructure });
  };

  const handleRemoveOption = (sectionId, questionId, optionId) => {
    const newStructure = {
      ...assessment.structure,
      sections: assessment.structure.sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, options: q.options.filter(opt => opt.id !== optionId) } : q )} : s ),
    };
    setAssessment({ ...assessment, structure: newStructure });
  };

  if (loading) return <div>Loading Assessment Builder...</div>;
  if (!assessment) return <div>Could not load assessment. Please try again.</div>

  return (
    <div>
      <div className="builder-header">
        <Link to={`/jobs/${jobId}`} className="back-link">&larr; Back to Job</Link>
        <h1>Assessment Builder</h1>
        <button onClick={handleSave} className="save-btn">Save Assessment</button>
      </div>
      <div className="builder-container">
        <div className="builder-controls">
          <input 
            type="text" 
            value={assessment.structure.title}
            onChange={(e) => setAssessment({ ...assessment, structure: { ...assessment.structure, title: e.target.value }})}
            className="assessment-title-input"
          />
          {assessment.structure.sections.map(section => (
            <div key={section.id} className="section-editor">
              <input 
                type="text" 
                value={section.title}
                onChange={(e) => {
                  const newSections = assessment.structure.sections.map(s => s.id === section.id ? { ...s, title: e.target.value } : s);
                  setAssessment({ ...assessment, structure: { ...assessment.structure, sections: newSections } });
                }}
                className="section-title-input"
              />
              {section.questions.map(q => (
                <QuestionEditor
                  key={q.id}
                  question={q}
                  onQuestionChange={(id, updated) => handleQuestionChange(section.id, id, updated)}
                  onRemoveQuestion={() => handleRemoveQuestion(section.id, q.id)}
                  onAddOption={() => handleAddOption(section.id, q.id)}
                  onRemoveOption={(optionId) => handleRemoveOption(section.id, q.id, optionId)}
                />
              ))}
              <button onClick={() => handleAddQuestion(section.id)} className="add-btn">+ Add Question</button>
            </div>
          ))}
          <button onClick={handleAddSection} className="add-btn">+ Add Section</button>
        </div>
        <div className="builder-preview">
          <FormPreview structure={assessment.structure} />
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './AssessmentBuilderPage.css'; 

const AssessmentBuilderPage = () => {
  const { jobId } = useParams();

  return (
    <div>
      <div className="builder-header">
        <Link to={`/jobs/${jobId}`} className="back-link">&larr; Back to Job</Link>
        <h1>Assessment Builder</h1>
      </div>
      <div className="builder-container">
        <div className="builder-controls">
          {/* Form controls will go here */}
          <p>Controls Panel</p>
        </div>
        <div className="builder-preview">
          {/* Live preview will go here */}
          <p>Live Preview Panel</p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilderPage;
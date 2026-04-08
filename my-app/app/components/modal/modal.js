import React from 'react';
import './modal.css';

const Model = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
      <div className="modal-content">
        <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />
      </div>
    </div>
  );
};

export default Model;

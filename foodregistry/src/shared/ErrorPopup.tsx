import React from 'react';
import '../css/ErrorPopup.css';

interface ErrorPopupProps {
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ onClose }) => {
  return (
    <div className="error-popup-overlay">
      <div className="error-popup">
        <h3>Access Denied!</h3>
        <p>Login with a registered account to perform this action.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ErrorPopup;
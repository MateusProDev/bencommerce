import React from 'react';
import './Loading.css';

const Loading = ({ text = "Carregando...", size = "medium" }) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-spinner">
        <div className="loading-ring">
          <div className="loading-ring-item"></div>
          <div className="loading-ring-item"></div>
          <div className="loading-ring-item"></div>
          <div className="loading-ring-item"></div>
        </div>
        <div className="loading-pulse"></div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;

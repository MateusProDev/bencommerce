import React from 'react';
import './LoadingProgress.css';

const LoadingProgress = ({ 
  progress = 0, 
  text = "Carregando...", 
  showProgress = true, 
  size = "medium" 
}) => {
  return (
    <div className={`loading-progress-container loading-progress-${size}`}>
      <div className="loading-progress-spinner">
        <div className="loading-progress-circle">
          <svg className="loading-progress-svg" viewBox="0 0 100 100">
            <circle 
              className="loading-progress-background"
              cx="50" 
              cy="50" 
              r="45"
            />
            <circle 
              className="loading-progress-bar"
              cx="50" 
              cy="50" 
              r="45"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
              }}
            />
          </svg>
          <div className="loading-progress-center">
            <div className="loading-progress-dots">
              <div className="loading-progress-dot"></div>
              <div className="loading-progress-dot"></div>
              <div className="loading-progress-dot"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="loading-progress-info">
        <div className="loading-progress-text">{text}</div>
        {showProgress && (
          <div className="loading-progress-percentage">{Math.round(progress)}%</div>
        )}
      </div>
      
      {showProgress && (
        <div className="loading-progress-bar-container">
          <div 
            className="loading-progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default LoadingProgress;

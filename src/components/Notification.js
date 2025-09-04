import React, { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4ecdc4';
      case 'error':
        return '#ff6b6b';
      case 'warning':
        return '#ffd93d';
      default:
        return '#667eea';
    }
  };

  return (
    <div 
      className="notification"
      style={{ background: getBackgroundColor() }}
    >
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification; 
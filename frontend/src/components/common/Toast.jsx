import React, { useEffect } from 'react';

/**
 * type: 'success' | 'error' | 'info'
 */
const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`fb-toast fb-toast--${type}`} role="alert">
      <span className="fb-toast__icon">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span className="fb-toast__msg">{message}</span>
      <button className="fb-toast__close" onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
};

export default Toast;

import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fb-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal__header">
          <h3 className="fb-modal__title">{title}</h3>
          <button className="fb-modal__close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="fb-modal__body">{children}</div>
        {footer && <div className="fb-modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import Button from './Button';

const EmptyState = ({ icon = '📭', title = 'Nothing here yet', description = '', actionLabel, onAction }) => (
  <div className="fb-empty">
    <div className="fb-empty__icon">{icon}</div>
    <h3 className="fb-empty__title">{title}</h3>
    {description && <p className="fb-empty__desc">{description}</p>}
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction} className="fb-empty__action">
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;

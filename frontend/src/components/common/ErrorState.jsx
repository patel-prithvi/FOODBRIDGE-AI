import React from 'react';
import Button from './Button';

const ErrorState = ({ title = 'Something went wrong', description = '', onRetry }) => (
  <div className="fb-error-state">
    <div className="fb-error-state__icon">⚠️</div>
    <h3 className="fb-error-state__title">{title}</h3>
    {description && <p className="fb-error-state__desc">{description}</p>}
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

export default ErrorState;

import React from 'react';

/**
 * variant: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'pending' | 'info' | 'donor' | 'receiver'
 */
const Badge = ({ children, variant = 'info', className = '' }) => {
  return (
    <span className={`fb-badge fb-badge--${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

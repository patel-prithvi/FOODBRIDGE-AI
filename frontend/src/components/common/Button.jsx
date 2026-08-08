import React from 'react';

/**
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
 * size: 'sm' | 'md' | 'lg'
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`fb-btn fb-btn--${variant} fb-btn--${size} ${fullWidth ? 'fb-btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="fb-btn__spinner" /> : null}
      {children}
    </button>
  );
};

export default Button;

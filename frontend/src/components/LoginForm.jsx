import React, { useState } from 'react';

export const LoginForm = ({ onSubmit, loading, error, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email.trim()) return setValidationError('Email is required');
    if (!credentials.password) return setValidationError('Password is required');

    onSubmit(credentials);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-header text-center">
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Sign in to your FoodBridge AI account</p>
      </div>

      {(validationError || error) && (
        <div className="form-alert error">{validationError || error}</div>
      )}

      <div className="form-group full-width">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="your.email@example.com"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group full-width">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn-primary full-width-btn" disabled={loading}>
        {loading ? 'Authenticating...' : 'SIGN IN'}
      </button>

      <div className="form-footer-switch">
        <span>Don't have an account yet?</span>
        <button type="button" className="btn-link" onClick={onSwitchToRegister}>
          Create Account
        </button>
      </div>
    </form>
  );
};

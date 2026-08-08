import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email.trim()) return setError('Email is required');
    if (!credentials.password) return setError('Password is required');

    setLoading(true);
    const result = await login(credentials);
    setLoading(false);

    if (result.success && result.data?.user) {
      const role = result.data.user.role;
      const redirect = from || (role === 'DONOR' ? '/donor/dashboard' : '/receiver/dashboard');
      navigate(redirect, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="fb-auth-page">
      <div className="fb-auth-hero">
        <span className="fb-hero__badge">🍊 Food Surplus Redistribution Platform</span>
        <h1>Welcome Back</h1>
        <p>Sign in to continue your FoodBridge AI journey</p>
      </div>

      <div className="fb-auth-card">
        <form className="fb-auth-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <p className="fb-auth-form__sub">Access your donor or receiver dashboard</p>

          {error && <div className="fb-form-alert fb-form-alert--error">{error}</div>}

          <div className="fb-form-group">
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

          <div className="fb-form-group">
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

          <button
            type="submit"
            className="fb-btn fb-btn--primary fb-btn--full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="fb-auth-form__switch">
            Don't have an account?{' '}
            <Link to="/register">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

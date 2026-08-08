import React from 'react';

export const Navbar = ({ user, onLogout, onNavigate, currentView }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <span className="brand-icon">🌉</span>
          <span className="brand-title">FoodBridge <span className="highlight">AI</span></span>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-badge-group">
              <span className={`role-tag ${user.role.toLowerCase()}`}>
                {user.role === 'DONOR' ? '🏪 DONOR' : '🏢 RECEIVER'}
              </span>
              <span className="user-email">{user.organizationName || user.email}</span>
              <button className="btn-logout" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-nav-buttons">
              {currentView === 'login' ? (
                <button className="btn-secondary" onClick={() => onNavigate('register')}>
                  Create Account
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => onNavigate('login')}>
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

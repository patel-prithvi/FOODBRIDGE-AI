import React from 'react';

export const DonorDashboardPlaceholder = ({ user, onLogout }) => {
  return (
    <div className="dashboard-placeholder-container">
      <div className="dashboard-card donor-theme">
        <div className="dashboard-header">
          <span className="role-chip donor">🏪 DONOR DASHBOARD</span>
          <h1>Welcome, {user.organizationName || user.name}!</h1>
          <p className="subtitle">Authenticated Protected Donor Route Verified ✓</p>
        </div>

        <div className="profile-summary-grid">
          <div className="info-box">
            <span className="label">Contact Name</span>
            <span className="value">{user.name}</span>
          </div>

          <div className="info-box">
            <span className="label">Organization / Business</span>
            <span className="value">{user.organizationName}</span>
          </div>

          <div className="info-box">
            <span className="label">Email Address</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="info-box">
            <span className="label">Phone</span>
            <span className="value">{user.phone}</span>
          </div>

          <div className="info-box full">
            <span className="label">Registered Location</span>
            <span className="value">
              {user.location?.address}, {user.location?.city}
            </span>
          </div>
        </div>

        <div className="placeholder-notice">
          <div className="notice-icon">🔒</div>
          <div className="notice-text">
            <h4>Authentication Phase Verified</h4>
            <p>
              Your Donor account is successfully registered and authenticated via JWT.
              Donation creation, AI waste prediction, and receiver matching features will be unlocked in subsequent phases.
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn-secondary logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

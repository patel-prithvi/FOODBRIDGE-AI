import React from 'react';

export const ReceiverDashboardPlaceholder = ({ user, onLogout }) => {
  return (
    <div className="dashboard-placeholder-container">
      <div className="dashboard-card receiver-theme">
        <div className="dashboard-header">
          <span className="role-chip receiver">🏢 RECEIVER DASHBOARD</span>
          <h1>Welcome, {user.organizationName}!</h1>
          <p className="subtitle">Authenticated Protected Receiver Route Verified ✓</p>
        </div>

        <div className="profile-summary-grid">
          <div className="info-box">
            <span className="label">Organization Name</span>
            <span className="value">{user.organizationName}</span>
          </div>

          <div className="info-box">
            <span className="label">Contact Person</span>
            <span className="value">{user.contactPerson}</span>
          </div>

          <div className="info-box">
            <span className="label">Email Address</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="info-box">
            <span className="label">Phone</span>
            <span className="value">{user.phone}</span>
          </div>

          <div className="info-box">
            <span className="label">Verification Status</span>
            <span className="status-pill pending">
              {user.verificationStatus || 'PENDING'}
            </span>
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
              Your Receiver account is successfully registered and authenticated via JWT.
              Available food discovery, AI recommendation matches, and pickup acceptance will be unlocked in subsequent phases.
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

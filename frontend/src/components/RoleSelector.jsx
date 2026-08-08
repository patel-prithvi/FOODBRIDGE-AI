import React from 'react';

export const RoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="role-selector-container">
      <h3 className="role-selector-title">Select Your Role to Continue</h3>
      <p className="role-selector-subtitle">Choose how you will be using FoodBridge AI</p>

      <div className="role-cards-grid">
        {/* DONOR CARD */}
        <div
          className={`role-card ${selectedRole === 'DONOR' ? 'selected' : ''}`}
          onClick={() => onSelectRole('DONOR')}
        >
          <div className="role-icon">🏪</div>
          <h4 className="role-name">DONOR</h4>
          <p className="role-desc">I have surplus food</p>
          <span className="role-badge">Restaurants, Caterers & Supermarkets</span>
          {selectedRole === 'DONOR' && <div className="selected-indicator">✓ Selected</div>}
        </div>

        {/* RECEIVER CARD */}
        <div
          className={`role-card ${selectedRole === 'RECEIVER' ? 'selected' : ''}`}
          onClick={() => onSelectRole('RECEIVER')}
        >
          <div className="role-icon">🏢</div>
          <h4 className="role-name">RECEIVER</h4>
          <p className="role-desc">I receive food</p>
          <span className="role-badge">Shelters, Food Banks & Community Kitchens</span>
          {selectedRole === 'RECEIVER' && <div className="selected-indicator">✓ Selected</div>}
        </div>
      </div>
    </div>
  );
};

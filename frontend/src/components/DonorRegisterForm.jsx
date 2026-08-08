import React, { useState } from 'react';
import { LocationInput } from './LocationInput';

export const DonorRegisterForm = ({ onSubmit, loading, error, onChangeRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    phone: '',
    location: {
      address: '',
      city: '',
      lat: 0,
      lng: 0,
    },
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleLocationChange = (newLocation) => {
    setFormData((prev) => ({
      ...prev,
      location: newLocation,
    }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return setValidationError('Full name is required');
    if (!formData.email.trim()) return setValidationError('Email address is required');
    if (!formData.password || formData.password.length < 6)
      return setValidationError('Password must be at least 6 characters');
    if (!formData.organizationName.trim())
      return setValidationError('Organization / Business name is required');
    if (!formData.phone.trim()) return setValidationError('Phone number is required');

    // Location validations
    if (!formData.location.city?.trim()) return setValidationError('City is required in location');
    if (!formData.location.address?.trim()) return setValidationError('Street address is required in location');

    onSubmit({
      role: 'DONOR',
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organizationName: formData.organizationName,
      phone: formData.phone,
      location: {
        address: formData.location.address,
        city: formData.location.city,
        lat: Number(formData.location.lat) || 0,
        lng: Number(formData.location.lng) || 0,
      },
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <span className="form-role-tag donor">🏪 DONOR Registration</span>
        <button type="button" className="btn-link-change-role" onClick={onChangeRole}>
          Change Role
        </button>
      </div>

      {(validationError || error) && (
        <div className="form-alert error">{validationError || error}</div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Organization / Business Name *</label>
          <input
            type="text"
            name="organizationName"
            placeholder="e.g. Royal Spice Restaurant"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="donor@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password * (min 6 chars)</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* REAL LOCATION SELECTION COMPONENT */}
      <LocationInput
        locationData={formData.location}
        onChangeLocation={handleLocationChange}
      />

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Creating Donor Account...' : 'REGISTER AS DONOR'}
      </button>
    </form>
  );
};

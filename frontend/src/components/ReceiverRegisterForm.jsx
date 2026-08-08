import React, { useState } from 'react';
import { LocationInput } from './LocationInput';

export const ReceiverRegisterForm = ({ onSubmit, loading, error, onChangeRole }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    password: '',
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

    if (!formData.organizationName.trim())
      return setValidationError('Organization name is required');
    if (!formData.contactPerson.trim())
      return setValidationError('Contact person is required');
    if (!formData.email.trim()) return setValidationError('Email is required');
    if (!formData.password || formData.password.length < 6)
      return setValidationError('Password must be at least 6 characters');
    if (!formData.phone.trim()) return setValidationError('Phone number is required');

    // Location validations
    if (!formData.location.city?.trim()) return setValidationError('City is required in location');
    if (!formData.location.address?.trim()) return setValidationError('Street address is required in location');

    onSubmit({
      role: 'RECEIVER',
      organizationName: formData.organizationName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      password: formData.password,
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
        <span className="form-role-tag receiver">🏢 RECEIVER Registration</span>
        <button type="button" className="btn-link-change-role" onClick={onChangeRole}>
          Change Role
        </button>
      </div>

      {(validationError || error) && (
        <div className="form-alert error">{validationError || error}</div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>Organization Name *</label>
          <input
            type="text"
            name="organizationName"
            placeholder="e.g. Hope Shelter & Food Bank"
            value={formData.organizationName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Person *</label>
          <input
            type="text"
            name="contactPerson"
            placeholder="e.g. Ananya Patel"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="receiver@example.org"
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
            placeholder="+91 9876543211"
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
        {loading ? 'Creating Receiver Account...' : 'REGISTER AS RECEIVER'}
      </button>
    </form>
  );
};

import React, { useState } from 'react';

export const DonorRegisterForm = ({ onSubmit, loading, error, onChangeRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    phone: '',
    address: '',
    city: '',
    lat: '',
    lng: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return setValidationError('Full name is required');
    if (!formData.email.trim()) return setValidationError('Email is required');
    if (!formData.password || formData.password.length < 6)
      return setValidationError('Password must be at least 6 characters');
    if (!formData.organizationName.trim())
      return setValidationError('Organization / Business name is required');
    if (!formData.phone.trim()) return setValidationError('Phone number is required');
    if (!formData.address.trim()) return setValidationError('Street address is required');
    if (!formData.city.trim()) return setValidationError('City is required');

    onSubmit({
      role: 'DONOR',
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organizationName: formData.organizationName,
      phone: formData.phone,
      location: {
        address: formData.address,
        city: formData.city,
        lat: Number(formData.lat) || 0,
        lng: Number(formData.lng) || 0
      }
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

        <div className="form-group">
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

        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Ahmedabad"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Street Address *</label>
        <input
          type="text"
          name="address"
          placeholder="e.g. 102 MG Road, Satellite Area"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-grid coords-grid">
        <div className="form-group">
          <label>Latitude (Optional)</label>
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="23.0225"
            value={formData.lat}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Longitude (Optional)</label>
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="72.5714"
            value={formData.lng}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Creating Donor Account...' : 'REGISTER AS DONOR'}
      </button>
    </form>
  );
};

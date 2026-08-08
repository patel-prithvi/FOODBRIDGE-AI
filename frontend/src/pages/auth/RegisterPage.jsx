import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'DONOR', icon: '🏪', name: 'DONOR', desc: 'I have surplus food', badge: 'Restaurants, Caterers & Supermarkets' },
  { id: 'RECEIVER', icon: '🏢', name: 'RECEIVER', desc: 'I receive food', badge: 'Shelters, Food Banks & Community Kitchens' },
];

const INITIAL_FORM = {
  name: '', organizationName: '', contactPerson: '', email: '',
  password: '', phone: '', address: '', city: '', lat: '', lng: '',
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('DONOR');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!formData.organizationName.trim()) return 'Organization name is required';
    if (role === 'DONOR' && !formData.name.trim()) return 'Full name is required';
    if (role === 'RECEIVER' && !formData.contactPerson.trim()) return 'Contact person is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!formData.phone.trim()) return 'Phone is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    const payload = {
      role,
      email: formData.email,
      password: formData.password,
      organizationName: formData.organizationName,
      phone: formData.phone,
      location: { address: formData.address, city: formData.city, lat: Number(formData.lat) || 0, lng: Number(formData.lng) || 0 },
    };
    if (role === 'DONOR') payload.name = formData.name;
    if (role === 'RECEIVER') payload.contactPerson = formData.contactPerson;

    const result = await register(payload);
    setLoading(false);

    if (result.success && result.data?.user) {
      const r = result.data.user.role;
      navigate(r === 'DONOR' ? '/donor/dashboard' : '/receiver/dashboard', { replace: true });
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="fb-auth-page">
      <div className="fb-auth-hero">
        <span className="fb-hero__badge">🍊 Food Surplus Redistribution Platform</span>
        <h1>Join FoodBridge AI</h1>
        <p>Create your account and start making an impact today</p>
      </div>

      <div className="fb-auth-card">
        {/* Role Selector */}
        <div className="fb-role-selector">
          <h3>Select Your Role</h3>
          <div className="fb-role-cards">
            {ROLES.map((r) => (
              <div
                key={r.id}
                className={`fb-role-card ${role === r.id ? 'fb-role-card--selected' : ''}`}
                onClick={() => { setRole(r.id); setError(''); }}
              >
                <div className="fb-role-card__icon">{r.icon}</div>
                <div className="fb-role-card__name">{r.name}</div>
                <div className="fb-role-card__desc">{r.desc}</div>
                <div className="fb-role-card__badge">{r.badge}</div>
                {role === r.id && <div className="fb-role-card__selected">✓ Selected</div>}
              </div>
            ))}
          </div>
        </div>

        <form className="fb-auth-form" onSubmit={handleSubmit}>
          {error && <div className="fb-form-alert fb-form-alert--error">{error}</div>}

          <div className="fb-form-grid">
            <div className="fb-form-group">
              <label>Organization / Business Name *</label>
              <input type="text" name="organizationName" placeholder="e.g. Royal Spice Restaurant"
                value={formData.organizationName} onChange={handleChange} required />
            </div>

            {role === 'DONOR' && (
              <div className="fb-form-group">
                <label>Full Name *</label>
                <input type="text" name="name" placeholder="e.g. Rahul Sharma"
                  value={formData.name} onChange={handleChange} required />
              </div>
            )}

            {role === 'RECEIVER' && (
              <div className="fb-form-group">
                <label>Contact Person *</label>
                <input type="text" name="contactPerson" placeholder="e.g. Ananya Patel"
                  value={formData.contactPerson} onChange={handleChange} required />
              </div>
            )}

            <div className="fb-form-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>

            <div className="fb-form-group">
              <label>Password * (min 6 chars)</label>
              <input type="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required />
            </div>

            <div className="fb-form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" placeholder="+91 9876543210"
                value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="fb-form-group">
              <label>City *</label>
              <input type="text" name="city" placeholder="e.g. Ahmedabad"
                value={formData.city} onChange={handleChange} required />
            </div>

            <div className="fb-form-group fb-form-group--full">
              <label>Street Address *</label>
              <input type="text" name="address" placeholder="e.g. 102 MG Road, Satellite Area"
                value={formData.address} onChange={handleChange} required />
            </div>

            <div className="fb-form-group">
              <label>Latitude (Optional)</label>
              <input type="number" step="any" name="lat" placeholder="23.0225"
                value={formData.lat} onChange={handleChange} />
            </div>
            <div className="fb-form-group">
              <label>Longitude (Optional)</label>
              <input type="number" step="any" name="lng" placeholder="72.5714"
                value={formData.lng} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="fb-btn fb-btn--primary fb-btn--full" disabled={loading}>
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>

          <p className="fb-auth-form__switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

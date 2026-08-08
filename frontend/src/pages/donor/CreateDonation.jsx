import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createDonation } from '../../services/donationService';
import { analyzeDonation } from '../../services/aiService';
import AIRiskCard from '../../components/ai/AIRiskCard';
import Loader from '../../components/common/Loader';

const FOOD_TYPES = ['Vegetarian Meals', 'Non-Vegetarian Meals', 'Bakery Items', 'Fresh Produce', 'Dairy Products', 'Grains & Cereals', 'Fruits', 'Beverages', 'Other'];
const UNITS = ['meals', 'kg', 'pieces', 'litres', 'boxes', 'packets'];

const INITIAL = {
  foodType: '', quantity: '', unit: 'meals', dietaryInfo: '',
  preparedAt: '', pickupStart: '', pickupEnd: '',
  address: '', city: '', description: '',
};

const CreateDonation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'ai' | 'done'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.foodType) return 'Food type is required';
    if (!form.quantity || Number(form.quantity) <= 0) return 'Quantity must be greater than 0';
    if (!form.preparedAt) return 'Preparation time is required';
    if (!form.pickupStart) return 'Pickup start time is required';
    if (!form.pickupEnd) return 'Pickup end time is required';
    if (new Date(form.pickupEnd) <= new Date(form.pickupStart)) return 'Pickup end must be after start';
    if (!form.address.trim()) return 'Pickup address is required';
    if (!form.city.trim()) return 'City is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setSubmitting(true);
    const donationPayload = {
      foodType: form.foodType,
      quantity: Number(form.quantity),
      unit: form.unit,
      dietaryInfo: form.dietaryInfo,
      preparedAt: form.preparedAt,
      pickupStart: form.pickupStart,
      pickupEnd: form.pickupEnd,
      location: { address: form.address, city: form.city },
      description: form.description,
    };

    const createRes = await createDonation(donationPayload);
    setSubmitting(false);

    if (!createRes.success) return setError(createRes.error);

    // Trigger AI analysis
    setStep('ai');
    setAnalyzing(true);
    const aiRes = await analyzeDonation(donationPayload);
    setAnalyzing(false);

    if (aiRes.success) {
      setAiResult(aiRes.data);
      // Attach donation id for matching page
      setAiResult({ ...aiRes.data, donationId: createRes.data._id });
    }
    setStep('done');
  };

  if (step === 'ai') {
    return (
      <div className="fb-create-donation__analyzing">
        <Loader text="🤖 AI is analyzing your donation..." />
        <p className="fb-muted">Evaluating surplus risk, urgency, and priority score...</p>
      </div>
    );
  }

  if (step === 'done' && aiResult) {
    return (
      <div className="fb-create-donation__result">
        <div className="fb-create-donation__result-header">
          <h1>Donation Created ✓</h1>
          <p>AI has analyzed your surplus. Here is the assessment:</p>
        </div>

        <AIRiskCard
          riskScore={aiResult.riskScore}
          priority={aiResult.priority}
          reasons={aiResult.reasons}
        />

        <div className="fb-create-donation__result-actions">
          <button
            className="fb-btn fb-btn--primary fb-btn--lg"
            onClick={() => navigate(`/donor/ai-matching/${aiResult.donationId}`)}
          >
            🎯 View AI Receiver Matches
          </button>
          <button
            className="fb-btn fb-btn--outline"
            onClick={() => navigate('/donor/donations')}
          >
            View My Donations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-create-donation">
      <div className="fb-page-header">
        <div>
          <h1>Create Donation</h1>
          <p className="fb-page-header__subtitle">List your surplus food for redistribution</p>
        </div>
      </div>

      <div className="fb-create-donation__card">
        <form onSubmit={handleSubmit}>
          {error && <div className="fb-form-alert fb-form-alert--error">{error}</div>}

          <div className="fb-form-section">
            <h3 className="fb-form-section__title">Food Information</h3>
            <div className="fb-form-grid">
              <div className="fb-form-group">
                <label>Food Type *</label>
                <select name="foodType" value={form.foodType} onChange={handleChange} required>
                  <option value="">Select food type</option>
                  {FOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="fb-form-group">
                <label>Dietary Information</label>
                <input type="text" name="dietaryInfo" placeholder="e.g. Vegetarian, No Nuts"
                  value={form.dietaryInfo} onChange={handleChange} />
              </div>

              <div className="fb-form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" placeholder="120" min="1"
                  value={form.quantity} onChange={handleChange} required />
              </div>

              <div className="fb-form-group">
                <label>Unit *</label>
                <select name="unit" value={form.unit} onChange={handleChange} required>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

              <div className="fb-form-group fb-form-group--full">
                <label>Description</label>
                <textarea name="description" placeholder="Describe the food, its condition, and any additional notes"
                  value={form.description} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          <div className="fb-form-section">
            <h3 className="fb-form-section__title">Timing</h3>
            <div className="fb-form-grid">
              <div className="fb-form-group">
                <label>Preparation Time *</label>
                <input type="datetime-local" name="preparedAt" value={form.preparedAt} onChange={handleChange} required />
              </div>

              <div className="fb-form-group" />

              <div className="fb-form-group">
                <label>Pickup Window — Start *</label>
                <input type="datetime-local" name="pickupStart" value={form.pickupStart} onChange={handleChange} required />
              </div>

              <div className="fb-form-group">
                <label>Pickup Window — End *</label>
                <input type="datetime-local" name="pickupEnd" value={form.pickupEnd} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="fb-form-section">
            <h3 className="fb-form-section__title">Pickup Location</h3>
            <div className="fb-form-grid">
              <div className="fb-form-group">
                <label>City *</label>
                <input type="text" name="city" placeholder="e.g. Ahmedabad"
                  value={form.city} onChange={handleChange} required />
              </div>

              <div className="fb-form-group" />

              <div className="fb-form-group fb-form-group--full">
                <label>Street Address *</label>
                <input type="text" name="address" placeholder="e.g. 102 MG Road, Satellite Area"
                  value={form.address} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="fb-create-donation__submit">
            <button type="submit" className="fb-btn fb-btn--primary fb-btn--lg" disabled={submitting || analyzing}>
              {submitting ? 'Saving...' : '🤖 Analyze With AI'}
            </button>
            <button type="button" className="fb-btn fb-btn--ghost" onClick={() => navigate('/donor/donations')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;

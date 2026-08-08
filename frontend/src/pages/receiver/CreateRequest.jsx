import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createFoodRequest, updateFoodRequest, getActiveRequest } from '../../services/requestService';

const FOOD_TYPES = [
  'Vegetarian Meals',
  'Non-Vegetarian Meals',
  'Bakery Items',
  'Fresh Produce',
  'Dairy Products',
  'Grains & Cereals',
  'Fruits',
  'Beverages',
  'Other',
];

const UNITS = ['meals', 'kg', 'pieces', 'litres', 'boxes', 'packets'];

const INITIAL_FORM = {
  foodType: '',
  quantity: '',
  unit: 'meals',
  dietaryInformation: '',
  description: '',
};

const CreateRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // If ?edit=true is in URL, always show the form even if active request exists
  const isEditMode = searchParams.get('edit') === 'true';

  const [form, setForm] = useState(INITIAL_FORM);
  const [existingRequestId, setExistingRequestId] = useState(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkActive = async () => {
      setChecking(true);
      const res = await getActiveRequest();
      setChecking(false);

      if (res.success && res.data) {
        const active = res.data;

        if (!isEditMode) {
          // Already has an active request — skip form and go to availability
          navigate(`/receiver/availability?requestId=${active._id}`, { replace: true });
          return;
        }

        // Edit mode — pre-fill the form with existing data
        setExistingRequestId(active._id);
        setForm({
          foodType: active.foodType || '',
          quantity: String(active.quantity || ''),
          unit: active.unit || 'meals',
          dietaryInformation: active.dietaryInformation || '',
          description: active.description || '',
        });
      }
    };

    checkActive();
  }, [isEditMode, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.foodType) return 'Please select a food type.';
    const numQty = Number(form.quantity);
    if (!form.quantity || isNaN(numQty) || numQty <= 0) {
      return 'Please enter a valid quantity.';
    }
    if (!form.unit) return 'Please select a unit.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      foodType: form.foodType,
      quantity: Number(form.quantity),
      unit: form.unit,
      dietaryInformation: form.dietaryInformation,
      description: form.description,
    };

    let res;
    if (existingRequestId) {
      // Update existing active request
      res = await updateFoodRequest(existingRequestId, payload);
    } else {
      // Create new food request
      res = await createFoodRequest(payload);
    }

    setSubmitting(false);

    if (res.success && res.data) {
      navigate(`/receiver/availability?requestId=${res.data._id}`);
    } else {
      setError(res.error || 'Unable to save food request. Please try again.');
    }
  };

  if (checking) {
    return (
      <div className="fb-create-request">
        <div className="fb-page-header">
          <div>
            <h1>Find Food</h1>
            <p className="fb-page-header__subtitle">Checking your current food request...</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div className="fb-spinner" style={{ margin: '0 auto 1rem' }} />
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-create-request">
      <div className="fb-page-header">
        <div>
          <h1>{existingRequestId ? 'Edit Food Request' : 'Find Food'}</h1>
          <p className="fb-page-header__subtitle">
            {existingRequestId
              ? 'Update your food requirement details'
              : 'Request surplus food for your organization'}
          </p>
        </div>
      </div>

      <div className="fb-create-donation__card">
        <form onSubmit={handleSubmit}>
          {error && <div className="fb-form-alert fb-form-alert--error">{error}</div>}

          {existingRequestId && (
            <div className="fb-form-alert" style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#92400e',
              fontSize: '0.875rem',
            }}>
              ✏️ You are editing your existing food request. Changes will update your current active request.
            </div>
          )}

          <div className="fb-form-section">
            <h3 className="fb-form-section__title">Food Requirement</h3>
            <div className="fb-form-grid">
              <div className="fb-form-group">
                <label>Food Type *</label>
                <select
                  name="foodType"
                  value={form.foodType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select food type</option>
                  {FOOD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fb-form-group">
                <label>Dietary Information</label>
                <input
                  type="text"
                  name="dietaryInformation"
                  placeholder="e.g. Vegetarian, No Nuts"
                  value={form.dietaryInformation}
                  onChange={handleChange}
                />
              </div>

              <div className="fb-form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="120"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="fb-form-group">
                <label>Unit *</label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fb-form-group fb-form-group--full">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the food requirement or any additional notes"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="fb-create-donation__submit">
            <button
              type="submit"
              className="fb-btn fb-btn--primary fb-btn--lg"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : existingRequestId
                ? 'Update & Find Food'
                : 'Find Available Food'}
            </button>
            <button
              type="button"
              className="fb-btn fb-btn--ghost"
              onClick={() =>
                existingRequestId
                  ? navigate(`/receiver/availability?requestId=${existingRequestId}`)
                  : navigate('/receiver/dashboard')
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;

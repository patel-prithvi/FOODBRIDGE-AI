import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById, completePickup } from '../../services/donationService';
import StatusTimeline from '../../components/donation/StatusTimeline';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { formatDate, formatTime, getCountdown } from '../../utils/helpers';

const Pickup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('');
  const [completing, setCompleting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = async () => {
    setLoading(true);
    const res = await getDonationById(id);
    setLoading(false);
    if (res.success) setDonation(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (!donation?.pickupEnd) return;
    const interval = setInterval(() => setCountdown(getCountdown(donation.pickupEnd)), 1000);
    return () => clearInterval(interval);
  }, [donation]);

  const handleComplete = async () => {
    setCompleting(true);
    const res = await completePickup(id);
    setCompleting(false);
    if (res.success) {
      setDonation((prev) => ({ ...prev, status: 'COMPLETED' }));
      setToast({ message: '🎉 Pickup completed! Thank you for making an impact.', type: 'success' });
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  if (loading) return <Loader text="Loading pickup details..." />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!donation) return null;

  const isCompleted = donation.status === 'COMPLETED';

  return (
    <div className="fb-pickup">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="fb-page-header">
        <div>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate(-1)}>← Back</button>
          <h1>{isCompleted ? '✅ Pickup Completed!' : '📦 Pickup Details'}</h1>
        </div>
      </div>

      <div className="fb-pickup__grid">
        <div className="fb-detail-card">
          <h3>Donation Summary</h3>
          <div className="fb-detail-row"><span>Food</span><strong>{donation.foodType}</strong></div>
          <div className="fb-detail-row"><span>Quantity</span><strong>{donation.quantity} {donation.unit}</strong></div>
          {donation.dietaryInfo && (
            <div className="fb-detail-row"><span>Dietary</span><strong>{donation.dietaryInfo}</strong></div>
          )}
        </div>

        <div className="fb-detail-card">
          <h3>Pickup Location & Timing</h3>
          <div className="fb-detail-row">
            <span>Address</span>
            <strong>{donation.location?.address}, {donation.location?.city}</strong>
          </div>
          <div className="fb-detail-row">
            <span>Window</span>
            <strong>{formatTime(donation.pickupStart)} – {formatTime(donation.pickupEnd)}</strong>
          </div>
          <div className="fb-detail-row">
            <span>Date</span>
            <strong>{formatDate(donation.pickupStart)}</strong>
          </div>
        </div>

        <div className="fb-detail-card">
          <h3>Status Timeline</h3>
          <StatusTimeline status={donation.status} />
        </div>
      </div>

      {!isCompleted && countdown && (
        <div className="fb-countdown">
          <div className="fb-countdown__time">{countdown}</div>
          <div className="fb-countdown__label">remaining in pickup window</div>
        </div>
      )}

      {!isCompleted && (
        <div className="fb-pickup__actions">
          <Button variant="primary" size="lg" loading={completing} onClick={handleComplete} fullWidth>
            ✓ Confirm Pickup Completed
          </Button>
        </div>
      )}

      {isCompleted && (
        <div className="fb-pickup__success">
          <div className="fb-pickup__success-icon">🎉</div>
          <h2>Donation Completed!</h2>
          <p>This donation has been successfully redistributed. Check your impact dashboard.</p>
          <Button variant="primary" onClick={() => navigate('/receiver/impact')}>
            View Impact Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pickup;

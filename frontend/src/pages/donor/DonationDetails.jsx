import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById, markPickedUp, completePickup } from '../../services/donationService';
import StatusTimeline from '../../components/donation/StatusTimeline';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Toast from '../../components/common/Toast';
import { formatDate, formatTime, priorityClass, statusLabel, getCountdown } from '../../utils/helpers';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Fetch donation details from MongoDB
  const fetchDonation = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    const res = await getDonationById(id);
    if (isInitial) setLoading(false);

    if (res.success && res.data) {
      setDonation(res.data);
    } else if (isInitial) {
      setError(res.error);
    }
  }, [id]);

  useEffect(() => {
    fetchDonation(true);

    // Auto-poll MongoDB every 3 seconds so Donor timeline updates in real-time when Receiver accepts or picks up
    const pollInterval = setInterval(() => {
      fetchDonation(false);
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [fetchDonation]);

  useEffect(() => {
    if (!donation?.pickupEnd) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(donation.pickupEnd));
    }, 1000);
    return () => clearInterval(interval);
  }, [donation]);

  const handleMarkPickedUp = async () => {
    setActionLoading(true);
    setDonation((prev) => ({ ...prev, status: 'PICKED_UP' }));
    const res = await markPickedUp(id);
    setActionLoading(false);
    if (res.success) {
      setToast({ message: '🚚 Marked as Picked Up!', type: 'success' });
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    setDonation((prev) => ({ ...prev, status: 'COMPLETED' }));
    const res = await completePickup(id);
    setActionLoading(false);
    if (res.success) {
      setToast({ message: '🎉 Donation Completed!', type: 'success' });
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  if (loading) return <Loader text="Loading donation details..." />;
  if (error) return <ErrorState description={error} onRetry={() => fetchDonation(true)} />;
  if (!donation) return null;

  const isAccepted = donation.status === 'ACCEPTED' || donation.status === 'MATCHED';
  const isPickedUp = donation.status === 'PICKED_UP';
  const isCompleted = donation.status === 'COMPLETED';

  return (
    <div className="fb-donation-details">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="fb-page-header">
        <div>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>{donation.foodType}</h1>
          <p className="fb-page-header__subtitle">Donation #{String(donation._id).slice(-6).toUpperCase()}</p>
        </div>
        <div className="fb-donation-details__badges">
          <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority}</Badge>
          <Badge variant={isCompleted ? 'success' : isPickedUp ? 'warning' : 'info'}>
            {statusLabel(donation.status)}
          </Badge>
        </div>
      </div>

      <div className="fb-donation-details__grid">
        {/* Left: Info */}
        <div className="fb-donation-details__left">
          <div className="fb-detail-card">
            <h3>Donation Information</h3>
            <div className="fb-detail-row"><span>Food Type</span><strong>{donation.foodType}</strong></div>
            <div className="fb-detail-row"><span>Quantity</span><strong>{donation.quantity} {donation.unit}</strong></div>
            {donation.dietaryInfo && (
              <div className="fb-detail-row"><span>Dietary Info</span><strong>{donation.dietaryInfo}</strong></div>
            )}
            <div className="fb-detail-row">
              <span>Pickup Window</span>
              <strong>{formatTime(donation.pickupStart)} – {formatTime(donation.pickupEnd)}</strong>
            </div>
            <div className="fb-detail-row">
              <span>Location</span>
              <strong>{donation.location?.address}, {donation.location?.city}</strong>
            </div>
            <div className="fb-detail-row"><span>Created</span><strong>{formatDate(donation.createdAt)}</strong></div>
          </div>

          {donation.matchedReceiver && (
            <div className="fb-detail-card fb-detail-card--green">
              <h3>Matched Receiver</h3>
              <div className="fb-detail-row">
                <span>Organization</span>
                <strong>{donation.matchedReceiver.organizationName}</strong>
              </div>
              {donation.matchedReceiver.contactPerson && (
                <div className="fb-detail-row">
                  <span>Contact</span>
                  <strong>{donation.matchedReceiver.contactPerson}</strong>
                </div>
              )}
              {donation.aiScore && (
                <div className="fb-detail-row">
                  <span>AI Match Score</span>
                  <strong>{donation.aiScore}%</strong>
                </div>
              )}
            </div>
          )}

          {/* Countdown */}
          {['AVAILABLE', 'MATCHED', 'ACCEPTED'].includes(donation.status) && countdown && (
            <div className="fb-countdown">
              <div className="fb-countdown__time">{countdown}</div>
              <div className="fb-countdown__label">remaining until pickup window closes</div>
            </div>
          )}

          {/* Action buttons based on status */}
          {donation.status === 'AVAILABLE' && (
            <button
              className="fb-btn fb-btn--primary fb-btn--full"
              onClick={() => navigate(`/donor/ai-matching/${donation._id}`)}
            >
              🎯 View AI Receiver Matches
            </button>
          )}

          {isAccepted && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{
                background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px',
                padding: '1rem', textAlign: 'center', marginBottom: '0.75rem',
              }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: '1rem' }}>
                  🎉 Receiver Accepted Your Offer!
                </p>
                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Receiver is scheduled to pick up the food.
                </p>
              </div>
              <button
                className="fb-btn fb-btn--primary fb-btn--full"
                onClick={handleMarkPickedUp}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : '📦 Mark as Picked Up'}
              </button>
            </div>
          )}

          {isPickedUp && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{
                background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '12px',
                padding: '1rem', textAlign: 'center', marginBottom: '0.75rem',
              }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#c2410c', fontSize: '1rem' }}>
                  🚚 Food Picked Up!
                </p>
                <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Confirm completion once food redistribution is complete.
                </p>
              </div>
              <button
                className="fb-btn fb-btn--primary fb-btn--full"
                onClick={handleComplete}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : '✅ Mark as Completed'}
              </button>
            </div>
          )}

          {isCompleted && (
            <div style={{
              background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px',
              padding: '1rem', textAlign: 'center', marginTop: '0.75rem',
            }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#16a34a', fontSize: '1.1rem' }}>
                🎉 Donation Completed & Fulfilled!
              </p>
            </div>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="fb-donation-details__right">
          <div className="fb-detail-card">
            <h3>Status Timeline</h3>
            <StatusTimeline status={donation.status} />
          </div>

          {donation.aiRisk && (
            <div className="fb-detail-card">
              <h3>AI Risk Assessment</h3>
              <div className="fb-ai-mini">
                <div className={`fb-ai-mini__score fb-ai-mini__score--${priorityClass(donation.aiPriority)}`}>
                  {donation.aiRisk}%
                </div>
                <div>
                  <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority} RISK</Badge>
                  <p className="fb-muted">AI-assessed surplus urgency score</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;

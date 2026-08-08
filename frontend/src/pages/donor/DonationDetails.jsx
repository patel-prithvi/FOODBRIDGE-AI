import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById } from '../../services/donationService';
import StatusTimeline from '../../components/donation/StatusTimeline';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { formatDate, formatTime, priorityClass, statusLabel, getCountdown } from '../../utils/helpers';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('');

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
    const interval = setInterval(() => {
      setCountdown(getCountdown(donation.pickupEnd));
    }, 1000);
    return () => clearInterval(interval);
  }, [donation]);

  if (loading) return <Loader text="Loading donation details..." />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!donation) return null;

  return (
    <div className="fb-donation-details">
      <div className="fb-page-header">
        <div>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>{donation.foodType}</h1>
          <p className="fb-page-header__subtitle">Donation #{donation._id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="fb-donation-details__badges">
          <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority}</Badge>
          <Badge variant="info">{statusLabel(donation.status)}</Badge>
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

          {/* AI match action */}
          {donation.status === 'AVAILABLE' && (
            <button
              className="fb-btn fb-btn--primary fb-btn--full"
              onClick={() => navigate(`/donor/ai-matching/${donation._id}`)}
            >
              🎯 View AI Receiver Matches
            </button>
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

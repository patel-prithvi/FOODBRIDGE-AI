import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById, acceptDonation } from '../../services/donationService';
import StatusTimeline from '../../components/donation/StatusTimeline';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Toast from '../../components/common/Toast';
import { formatDate, formatTime, priorityClass, statusLabel, getCountdown } from '../../utils/helpers';

const ReceiverDonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [accepting, setAccepting] = useState(false);
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

  const handleAccept = async () => {
    setAccepting(true);
    const res = await acceptDonation(id);
    setAccepting(false);
    setShowModal(false);

    if (res.success) {
      setToast({ message: '✓ Donation accepted successfully!', type: 'success' });
      setDonation((prev) => ({ ...prev, status: 'ACCEPTED' }));
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  if (loading) return <Loader text="Loading donation details..." />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!donation) return null;

  const canAccept = donation.status === 'AVAILABLE' || donation.status === 'MATCHED';

  return (
    <div className="fb-donation-details">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Accept this donation?"
        footer={
          <div className="fb-modal__footer-btns">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" loading={accepting} onClick={handleAccept}>
              Accept Donation
            </Button>
          </div>
        }
      >
        <div className="fb-accept-modal">
          <p className="fb-accept-modal__food">
            <strong>{donation.foodType}</strong> · {donation.quantity} {donation.unit}
          </p>
          {donation.pickupStart && (
            <p className="fb-accept-modal__pickup">
              📅 Pickup: {formatTime(donation.pickupStart)} – {formatTime(donation.pickupEnd)}
            </p>
          )}
          <p className="fb-accept-modal__loc">📍 {donation.location?.address}, {donation.location?.city}</p>
          {donation.aiScore && (
            <p className="fb-accept-modal__ai">🤖 AI Match Score: <strong>{donation.aiScore}%</strong></p>
          )}
        </div>
      </Modal>

      <div className="fb-page-header">
        <div>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate(-1)}>← Back</button>
          <h1>{donation.foodType}</h1>
          <p className="fb-page-header__subtitle">Donation #{donation._id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="fb-donation-details__badges">
          <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority}</Badge>
          <Badge variant="info">{statusLabel(donation.status)}</Badge>
        </div>
      </div>

      <div className="fb-donation-details__grid">
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

          {donation.aiScore && (
            <div className="fb-detail-card">
              <h3>AI Match Score</h3>
              <div className="fb-ai-mini">
                <div className={`fb-ai-mini__score fb-ai-mini__score--${priorityClass(donation.aiPriority)}`}>
                  {donation.aiScore}%
                </div>
                <div>
                  <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority} PRIORITY</Badge>
                  <p className="fb-muted">AI-assessed match between your profile and this donation</p>
                </div>
              </div>
            </div>
          )}

          {countdown && canAccept && (
            <div className="fb-countdown">
              <div className="fb-countdown__time">{countdown}</div>
              <div className="fb-countdown__label">remaining in pickup window</div>
            </div>
          )}

          {canAccept && (
            <Button variant="primary" fullWidth onClick={() => setShowModal(true)}>
              ✓ Accept This Donation
            </Button>
          )}

          {donation.status === 'ACCEPTED' && (
            <Button variant="primary" fullWidth onClick={() => navigate(`/receiver/pickup/${id}`)}>
              📦 View Pickup Details
            </Button>
          )}
        </div>

        <div className="fb-donation-details__right">
          <div className="fb-detail-card">
            <h3>Status Timeline</h3>
            <StatusTimeline status={donation.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDonationDetails;

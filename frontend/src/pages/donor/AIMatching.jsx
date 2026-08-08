import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById, selectReceiver } from '../../services/donationService';
import { getMatchedReceivers } from '../../services/aiService';
import MatchCard from '../../components/ai/MatchCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Toast from '../../components/common/Toast';

// ─── Confirmation Modal ───────────────────────────────────────
const ConfirmModal = ({ donation, receiver, onConfirm, onCancel, confirming }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  }}>
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '2rem',
      maxWidth: '520px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      animation: 'fadeIn 0.2s ease',
    }}>
      <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', color: '#0f172a' }}>
        ✅ Confirm Receiver Selection
      </h2>
      <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
        Review details before sending this offer to the receiver
      </p>

      {/* Donation info */}
      <div style={{
        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
        padding: '1rem 1.25rem', marginBottom: '1rem',
      }}>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🍱 Your Donation</p>
        <p style={{ margin: '0.3rem 0 0', fontWeight: 600, color: '#0f172a', fontSize: '1rem' }}>
          {donation?.foodType} · {donation?.quantity} {donation?.unit}
        </p>
        {donation?.dietaryInfo && (
          <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Dietary: {donation.dietaryInfo}</p>
        )}
        {donation?.location?.city && (
          <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>📍 {donation.location.address || ''} {donation.location.city}</p>
        )}
        {donation?.pickupStart && (
          <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            ⏰ Pickup: {new Date(donation.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' – '}
            {new Date(donation.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Receiver info */}
      <div style={{
        background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px',
        padding: '1rem 1.25rem', marginBottom: '1.5rem',
      }}>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏢 Selected Receiver</p>
        <p style={{ margin: '0.3rem 0 0', fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
          {receiver?.organizationName}
        </p>
        {receiver?.contactPerson && (
          <p style={{ margin: '0.1rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Contact: {receiver.contactPerson}</p>
        )}
        {receiver?.location?.city && (
          <p style={{ margin: '0.1rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>📍 {receiver.location.city}</p>
        )}
        {receiver?.capacity && (
          <p style={{ margin: '0.1rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Capacity: {receiver.capacity} {donation?.unit}</p>
        )}
        {receiver?.foodRequest && (
          <p style={{ margin: '0.25rem 0 0', color: '#15803d', fontSize: '0.85rem', fontWeight: 600 }}>
            📋 They need: {receiver.foodRequest.quantity} {receiver.foodRequest.unit} of {receiver.foodRequest.foodType}
          </p>
        )}
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            background: '#dcfce7', color: '#166534', borderRadius: '20px',
            padding: '0.2rem 0.65rem', fontSize: '0.78rem', fontWeight: 700,
          }}>
            {receiver?.matchScore}% AI Match
          </span>
          {receiver?.verificationStatus === 'VERIFIED' && (
            <span style={{
              background: '#eff6ff', color: '#1d4ed8', borderRadius: '20px',
              padding: '0.2rem 0.65rem', fontSize: '0.78rem', fontWeight: 700,
            }}>✓ Verified</span>
          )}
        </div>
      </div>

      <p style={{ margin: '0 0 1.25rem', color: '#475569', fontSize: '0.875rem', lineHeight: '1.5' }}>
        Once you confirm, this receiver will see your donation and can <strong>Accept or Decline</strong>.
        The donation will be removed from the available pool until a decision is made.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          style={{
            flex: 1, padding: '0.8rem', background: confirming ? '#e2e8f0' : '#f97316',
            color: confirming ? '#94a3b8' : '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.95rem', cursor: confirming ? 'not-allowed' : 'pointer',
          }}
          onClick={onConfirm}
          disabled={confirming}
        >
          {confirming ? '⏳ Sending Offer...' : '📨 Confirm & Send Offer'}
        </button>
        <button
          style={{
            padding: '0.8rem 1.25rem', background: 'transparent', color: '#64748b',
            border: '1.5px solid #e2e8f0', borderRadius: '10px',
            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          }}
          onClick={onCancel}
          disabled={confirming}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─── Awaiting State ──────────────────────────────────────────
const AwaitingConfirmation = ({ donation, receiver, onCheckStatus, checking }) => (
  <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '520px', margin: '0 auto' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
    <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Offer Sent!</h2>
    <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
      Your offer has been sent to <strong>{receiver?.organizationName}</strong>.<br />
      Waiting for their confirmation...
    </p>

    <div style={{
      background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px',
      padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left',
    }}>
      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{donation?.foodType} · {donation?.quantity} {donation?.unit}</p>
      <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>→ {receiver?.organizationName}</p>
      <p style={{ margin: '0.5rem 0 0' }}>
        <span style={{
          background: '#fef3c7', color: '#92400e', borderRadius: '20px',
          padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 700,
        }}>Awaiting Receiver Response</span>
      </p>
    </div>

    <button
      style={{
        background: '#f97316', color: '#fff', border: 'none', borderRadius: '10px',
        padding: '0.75rem 1.75rem', fontWeight: 700, cursor: checking ? 'not-allowed' : 'pointer',
        opacity: checking ? 0.7 : 1,
      }}
      onClick={onCheckStatus}
      disabled={checking}
    >
      {checking ? '🔄 Checking...' : '🔄 Check Status'}
    </button>
    <p style={{ marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.8rem' }}>
      The receiver will see this offer on their dashboard
    </p>
  </div>
);

// ─── Confirmed State ─────────────────────────────────────────
const ConfirmedSuccess = ({ donation, receiver, navigate }) => (
  <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '520px', margin: '0 auto' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
    <h2 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Receiver Accepted!</h2>
    <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
      <strong>{receiver?.organizationName}</strong> has accepted your donation.<br />
      This donation is now <strong>matched</strong> and closed from the pool.
    </p>
    <div style={{
      background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px',
      padding: '1.25rem', marginBottom: '1.5rem',
    }}>
      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{donation?.foodType} · {donation?.quantity} {donation?.unit}</p>
      <p style={{ margin: '0.35rem 0 0' }}>
        <span style={{
          background: '#dcfce7', color: '#166534', borderRadius: '20px',
          padding: '0.25rem 0.75rem', fontSize: '0.85rem', fontWeight: 700,
        }}>✅ MATCHED</span>
      </p>
    </div>
    <button
      style={{
        background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px',
        padding: '0.8rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
      }}
      onClick={() => navigate('/donor/donations')}
    >
      View My Donations
    </button>
  </div>
);

// ─── Main AIMatching Component ────────────────────────────────
const AIMatching = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [donationStatus, setDonationStatus] = useState('AVAILABLE');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [donRes, matchRes] = await Promise.all([
      getDonationById(id),
      getMatchedReceivers(id),
    ]);
    setLoading(false);

    if (donRes.success && donRes.data) {
      setDonation(donRes.data);
      setDonationStatus(donRes.data.status);
      // If this donation is already PENDING or MATCHED, restore that state
      if (donRes.data.status === 'PENDING_ACCEPTANCE') {
        setOfferSent(true);
        setSelected(donRes.data.matchedReceiver);
      } else if (donRes.data.status === 'MATCHED') {
        setOfferSent(true);
        setDonationStatus('MATCHED');
        setSelected(donRes.data.matchedReceiver);
      }
    }

    if (matchRes.success) setReceivers(matchRes.data);
    else setError(matchRes.error);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleSelect = (receiver) => {
    setSelected(receiver);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);

    const res = await selectReceiver(id, selected._id, selected);
    setConfirming(false);

    if (res.success) {
      setShowModal(false);
      setOfferSent(true);
      setDonationStatus('PENDING_ACCEPTANCE');
      setToast({ message: `Offer sent to ${selected.organizationName}!`, type: 'success' });
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    const res = await getDonationById(id);
    setCheckingStatus(false);

    if (res.success && res.data) {
      setDonation(res.data);
      setDonationStatus(res.data.status);
      if (res.data.status === 'MATCHED') {
        setToast({ message: `${selected?.organizationName || 'Receiver'} accepted your offer! 🎉`, type: 'success' });
      } else if (res.data.status === 'AVAILABLE') {
        // Receiver declined
        setOfferSent(false);
        setSelected(null);
        setDonationStatus('AVAILABLE');
        setToast({ message: 'Receiver declined the offer. Please select another receiver.', type: 'error' });
        load();
      }
    }
  };

  if (loading) return <Loader text="🤖 AI is finding the best receivers..." />;

  // Receiver accepted — show success confirmation
  if (donationStatus === 'MATCHED') {
    return (
      <div className="fb-ai-matching">
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <ConfirmedSuccess donation={donation} receiver={selected || donation?.matchedReceiver} navigate={navigate} />
      </div>
    );
  }

  // Offer sent — waiting for receiver
  if (offerSent && donationStatus === 'PENDING_ACCEPTANCE') {
    return (
      <div className="fb-ai-matching">
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
        <AwaitingConfirmation
          donation={donation}
          receiver={selected}
          onCheckStatus={handleCheckStatus}
          checking={checkingStatus}
        />
      </div>
    );
  }

  return (
    <div className="fb-ai-matching">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Confirmation Modal */}
      {showModal && selected && (
        <ConfirmModal
          donation={donation}
          receiver={selected}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          confirming={confirming}
        />
      )}

      <div className="fb-page-header">
        <div>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate(-1)}>← Back</button>
          <h1>🎯 AI Recommended Receivers</h1>
          {donation && (
            <p className="fb-page-header__subtitle">
              For: {donation.foodType} · {donation.quantity} {donation.unit}
            </p>
          )}
        </div>
      </div>

      {error && <ErrorState description={error} onRetry={load} />}

      {!error && receivers.length === 0 && (
        <div className="fb-ai-matching__unavailable">
          <p>🤖 No eligible receivers found. Check again once receivers submit food requests.</p>
          <button className="fb-btn fb-btn--outline" onClick={load}>Retry</button>
        </div>
      )}

      {receivers.length > 0 && (
        <>
          <div className="fb-ai-matching__summary">
            <p>Found <strong>{receivers.length}</strong> compatible receivers ranked by AI match score</p>
          </div>

          <div className="fb-match-list">
            {receivers.map((r, idx) => (
              <MatchCard
                key={r._id}
                receiver={r}
                rank={idx}
                selected={selected?._id === r._id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AIMatching;

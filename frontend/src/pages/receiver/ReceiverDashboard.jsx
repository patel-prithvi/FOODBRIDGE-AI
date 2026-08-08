import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableDonations, getPendingOffers, acceptDonation, declineDonation } from '../../services/donationService';
import DonationCard from '../../components/donation/DonationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Badge from '../../components/common/Badge';
import Toast from '../../components/common/Toast';

const StatCard = ({ icon, value, label, color }) => (
  <div className={`fb-stat-card fb-stat-card--${color}`}>
    <div className="fb-stat-card__icon">{icon}</div>
    <div className="fb-stat-card__value">{value}</div>
    <div className="fb-stat-card__label">{label}</div>
  </div>
);

// ─── Pending Offer Card ───────────────────────────────────────
const PendingOfferCard = ({ donation, onAccept, onDecline, processing }) => {
  const donor = donation.donorId;
  return (
    <div style={{
      background: '#fff',
      border: '2px solid #f97316',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 20px rgba(249,115,22,0.12)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.5px', color: '#f97316', display: 'block', marginBottom: '0.2rem',
          }}>
            📨 Food Offer — Waiting for Your Response
          </span>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
            {donation.foodType}
          </h3>
          <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            {donation.quantity} {donation.unit}
            {donation.dietaryInfo && ` · ${donation.dietaryInfo}`}
          </p>
        </div>
        <span style={{
          background: '#fef3c7', color: '#92400e', borderRadius: '20px',
          padding: '0.2rem 0.75rem', fontSize: '0.8rem', fontWeight: 700,
        }}>
          ⏳ Awaiting Your Decision
        </span>
      </div>

      {/* Donation Details */}
      <div style={{
        background: '#f8fafc', borderRadius: '10px', padding: '0.75rem 1rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#475569',
      }}>
        {donation.location?.city && (
          <span>📍 {donation.location.address ? `${donation.location.address}, ` : ''}{donation.location.city}</span>
        )}
        {donation.pickupStart && (
          <span>⏰ Pickup: {new Date(donation.pickupStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {' – '}{new Date(donation.pickupEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {donation.aiRisk && (
          <span>🤖 AI Risk: <strong>{donation.aiRisk}%</strong></span>
        )}
        {donor?.organizationName && (
          <span>🏢 From: <strong>{donor.organizationName}</strong></span>
        )}
      </div>

      {/* AI Priority Badge */}
      {donation.aiPriority && (
        <div style={{ marginBottom: '1rem' }}>
          <Badge variant={donation.aiPriority === 'CRITICAL' ? 'critical' : donation.aiPriority === 'HIGH' ? 'warning' : 'info'}>
            {donation.aiPriority} PRIORITY
          </Badge>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          style={{
            flex: 1, padding: '0.7rem', background: processing ? '#e2e8f0' : '#16a34a',
            color: processing ? '#94a3b8' : '#fff', border: 'none', borderRadius: '10px',
            fontWeight: 700, fontSize: '0.9rem', cursor: processing ? 'not-allowed' : 'pointer',
          }}
          onClick={() => onAccept(donation._id)}
          disabled={processing}
        >
          ✅ Accept
        </button>
        <button
          style={{
            flex: 1, padding: '0.7rem', background: 'transparent',
            color: processing ? '#94a3b8' : '#dc2626',
            border: `1.5px solid ${processing ? '#e2e8f0' : '#fca5a5'}`,
            borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
            cursor: processing ? 'not-allowed' : 'pointer',
          }}
          onClick={() => onDecline(donation._id)}
          disabled={processing}
        >
          ❌ Decline
        </button>
      </div>
    </div>
  );
};

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [pendingOffers, setPendingOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = async () => {
    setLoading(true);
    const [availRes, pendingRes] = await Promise.all([
      getAvailableDonations(),
      getPendingOffers(),
    ]);
    setLoading(false);

    if (availRes.success) setDonations(availRes.data);
    else setError(availRes.error);

    if (pendingRes.success) setPendingOffers(pendingRes.data || []);
  };

  useEffect(() => { load(); }, []);

  const handleAccept = async (donationId) => {
    setProcessing(true);
    const res = await acceptDonation(donationId);
    setProcessing(false);

    if (res.success) {
      setToast({ message: '🎉 Donation accepted! The donor has been notified.', type: 'success' });
      setPendingOffers((prev) => prev.filter((d) => d._id !== donationId));
    } else {
      setToast({ message: res.error || 'Failed to accept donation.', type: 'error' });
    }
  };

  const handleDecline = async (donationId) => {
    setProcessing(true);
    const res = await declineDonation(donationId);
    setProcessing(false);

    if (res.success) {
      setToast({ message: 'Donation declined. It has been returned to the available pool.', type: 'error' });
      setPendingOffers((prev) => prev.filter((d) => d._id !== donationId));
      // Refresh available donations since this one is back in the pool
      const availRes = await getAvailableDonations();
      if (availRes.success) setDonations(availRes.data);
    } else {
      setToast({ message: res.error || 'Failed to decline donation.', type: 'error' });
    }
  };

  const aiRecommended = donations.filter((d) => d.aiScore >= 85);

  return (
    <div className="fb-dashboard">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="fb-dashboard__header">
        <div>
          <h1>Welcome, {user?.organizationName} 🏢</h1>
          <p className="fb-dashboard__subtitle">
            {pendingOffers.length > 0
              ? `📨 You have ${pendingOffers.length} pending food offer${pendingOffers.length > 1 ? 's' : ''} waiting for your response!`
              : aiRecommended.length > 0
              ? `🤖 AI has ${aiRecommended.length} high-priority recommendations for you!`
              : 'Browse available food donations near you'}
          </p>
        </div>
        <button className="fb-btn fb-btn--primary" onClick={() => navigate('/receiver/request')}>
          🔍 Find Food
        </button>
      </div>

      <div className="fb-stats-grid">
        <StatCard icon="📨" value={pendingOffers.length} label="Pending Offers" color="orange" />
        <StatCard icon="🍱" value={donations.length} label="Available Donations" color="green" />
        <StatCard icon="🤖" value={aiRecommended.length} label="AI Recommendations" color="blue" />
        <StatCard icon="💚" value={0} label="Completed" color="purple" />
      </div>

      {/* ── Pending Food Offers (from donors) ── */}
      {loading ? null : pendingOffers.length > 0 && (
        <div className="fb-dashboard__section">
          <h2 className="fb-dashboard__section-title">
            📨 Pending Food Offers
            <span style={{
              marginLeft: '0.75rem', background: '#f97316', color: '#fff',
              borderRadius: '20px', padding: '0.1rem 0.6rem', fontSize: '0.8rem', fontWeight: 700,
            }}>{pendingOffers.length}</span>
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
            A donor has selected you for a food donation. Accept to confirm or decline if you cannot take it.
          </p>
          {pendingOffers.map((d) => (
            <PendingOfferCard
              key={d._id}
              donation={d}
              onAccept={handleAccept}
              onDecline={handleDecline}
              processing={processing}
            />
          ))}
        </div>
      )}

      {/* ── AI Recommendations ── */}
      {aiRecommended.length > 0 && (
        <div className="fb-dashboard__section">
          <h2 className="fb-dashboard__section-title">🤖 AI Recommended For You</h2>
          <div className="fb-ai-rec-list">
            {aiRecommended.slice(0, 3).map((d) => (
              <div key={d._id} className="fb-ai-rec-item">
                <div className="fb-ai-rec-item__info">
                  <h3>{d.foodType}</h3>
                  <p>{d.quantity} {d.unit} · {d.location?.city}</p>
                  <Badge variant="critical">{d.aiPriority}</Badge>
                </div>
                <div className="fb-ai-rec-item__score">
                  <div className="fb-ai-rec-item__score-value">{d.aiScore}%</div>
                  <div className="fb-ai-rec-item__score-label">AI Match</div>
                </div>
                <div className="fb-ai-rec-item__actions">
                  <button
                    className="fb-btn fb-btn--primary fb-btn--sm"
                    onClick={() => navigate(`/receiver/food/${d._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── All Available ── */}
      <div className="fb-dashboard__section">
        <div className="fb-dashboard__section-head">
          <h2 className="fb-dashboard__section-title">Available Donations</h2>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate('/receiver/food')}>
            View All →
          </button>
        </div>

        {loading && <Loader text="Loading available food..." />}
        {!loading && error && <ErrorState description={error} onRetry={load} />}
        {!loading && !error && donations.length === 0 && (
          <EmptyState icon="🍱" title="No food available right now" description="Check back soon for new donations" />
        )}
        {!loading && !error && donations.length > 0 && (
          <div className="fb-donations-grid">
            {donations.slice(0, 4).map((d) => (
              <DonationCard key={d._id} donation={d} linkBase="/receiver/food" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverDashboard;

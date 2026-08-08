import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyDonations } from '../../services/donationService';
import DonationCard from '../../components/donation/DonationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Badge from '../../components/common/Badge';

const StatCard = ({ icon, value, label, color }) => (
  <div className={`fb-stat-card fb-stat-card--${color}`}>
    <div className="fb-stat-card__icon">{icon}</div>
    <div className="fb-stat-card__value">{value}</div>
    <div className="fb-stat-card__label">{label}</div>
  </div>
);

const URGENT_MOCK = [
  { id: 1, quantity: 120, unit: 'meals', mins: 38, priority: 'CRITICAL', color: 'critical' },
  { id: 2, quantity: 80, unit: 'meals', mins: 60, priority: 'HIGH', color: 'high' },
  { id: 3, quantity: 45, unit: 'meals', mins: 180, priority: 'MEDIUM', color: 'medium' },
];

const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Morning';
    if (h < 17) return 'Afternoon';
    return 'Evening';
  };

  const load = async () => {
    setLoading(true);
    setError('');
    const res = await getMyDonations();
    setLoading(false);
    if (res.success) setDonations(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, []);

  const completed = donations.filter((d) => d.status === 'COMPLETED');
  const active = donations.filter((d) => !['COMPLETED', 'EXPIRED'].includes(d.status));

  return (
    <div className="fb-dashboard">
      {/* Header */}
      <div className="fb-dashboard__header">
        <div>
          <h1>Good {getHour()} 👋</h1>
          <p className="fb-dashboard__subtitle">
            Ready to turn surplus into impact, <strong>{user?.organizationName}</strong>?
          </p>
        </div>
        <button
          className="fb-btn fb-btn--primary"
          onClick={() => navigate('/donor/donations/create')}
        >
          + Create Donation
        </button>
      </div>

      {/* Stats */}
      <div className="fb-stats-grid">
        <StatCard icon="🍽️" value={completed.reduce((acc, d) => acc + d.quantity, 0)} label="Food Saved (meals)" color="green" />
        <StatCard icon="✅" value={completed.length} label="Completed Donations" color="blue" />
        <StatCard icon="🔄" value={active.length} label="Active Donations" color="orange" />
        <StatCard icon="📦" value={donations.length} label="Total Donations" color="purple" />
      </div>

      {/* Urgent AI Queue */}
      <div className="fb-dashboard__section">
        <h2 className="fb-dashboard__section-title">⚡ Urgent Donations</h2>
        <div className="fb-urgent-queue">
          {URGENT_MOCK.map((u) => (
            <div key={u.id} className={`fb-urgent-item fb-urgent-item--${u.color}`}>
              <Badge variant={u.color}>{u.priority}</Badge>
              <span className="fb-urgent-item__qty">{u.quantity} {u.unit}</span>
              <span className="fb-urgent-item__time">⏱ {u.mins < 60 ? `${u.mins} min` : `${Math.round(u.mins / 60)} hr`} remaining</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="fb-dashboard__section">
        <div className="fb-dashboard__section-head">
          <h2 className="fb-dashboard__section-title">Recent Donations</h2>
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={() => navigate('/donor/donations')}>
            View All →
          </button>
        </div>

        {loading && <Loader text="Loading donations..." />}
        {!loading && error && <ErrorState description={error} onRetry={load} />}
        {!loading && !error && donations.length === 0 && (
          <EmptyState
            icon="🍱"
            title="No donations yet"
            description="Create your first surplus donation to get started"
            actionLabel="Create Donation"
            onAction={() => navigate('/donor/donations/create')}
          />
        )}
        {!loading && !error && donations.length > 0 && (
          <div className="fb-donations-grid">
            {donations.slice(0, 4).map((d) => (
              <DonationCard key={d._id} donation={d} linkBase="/donor/donations" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;

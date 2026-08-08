import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableDonations } from '../../services/donationService';
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

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await getAvailableDonations();
    setLoading(false);
    if (res.success) setDonations(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, []);

  const aiRecommended = donations.filter((d) => d.aiScore >= 85);

  return (
    <div className="fb-dashboard">
      <div className="fb-dashboard__header">
        <div>
          <h1>Welcome, {user?.organizationName} 🏢</h1>
          <p className="fb-dashboard__subtitle">
            {aiRecommended.length > 0
              ? `🤖 AI has ${aiRecommended.length} high-priority recommendations for you!`
              : 'Browse available food donations near you'}
          </p>
        </div>
        <button className="fb-btn fb-btn--primary" onClick={() => navigate('/receiver/food')}>
          🔍 Find Food
        </button>
      </div>

      <div className="fb-stats-grid">
        <StatCard icon="🍱" value={donations.length} label="Available Donations" color="orange" />
        <StatCard icon="🤖" value={aiRecommended.length} label="AI Recommendations" color="green" />
        <StatCard icon="✅" value={0} label="Accepted (session)" color="blue" />
        <StatCard icon="💚" value={0} label="Completed (session)" color="purple" />
      </div>

      {/* AI Recommendations */}
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
                    className="fb-btn fb-btn--outline fb-btn--sm"
                    onClick={() => navigate(`/receiver/food/${d._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="fb-btn fb-btn--primary fb-btn--sm"
                    onClick={() => navigate(`/receiver/food/${d._id}`)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All available */}
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

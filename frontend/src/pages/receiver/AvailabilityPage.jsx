import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getFoodRequestById, getActiveRequest } from '../../services/requestService';
import { getAvailableDonations } from '../../services/donationService';
import DonationCard from '../../components/donation/DonationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const AvailabilityPage = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const navigate = useNavigate();

  const [activeRequest, setActiveRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch request by ID from URL, or fall back to user's active request
      let reqData = null;
      if (requestId) {
        const reqRes = await getFoodRequestById(requestId);
        if (reqRes.success) reqData = reqRes.data;
      }

      if (!reqData) {
        // No requestId in URL or lookup failed — try fetching the user's active request
        const activeRes = await getActiveRequest();
        if (activeRes.success && activeRes.data) {
          reqData = activeRes.data;
          // Sync URL without causing navigation
          window.history.replaceState(null, '', `/receiver/availability?requestId=${reqData._id}`);
        }
      }

      setActiveRequest(reqData);

      // 2. Fetch available donations
      const donRes = await getAvailableDonations();
      if (!donRes.success) {
        setError(donRes.error || 'Unable to load available food.');
        setLoading(false);
        return;
      }

      let allDonations = donRes.data || [];

      // 3. Filter strictly by active request foodType (exact match)
      if (reqData && reqData.foodType) {
        allDonations = allDonations.filter(
          (d) => d.foodType?.trim().toLowerCase() === reqData.foodType?.trim().toLowerCase()
        );
        allDonations.sort((a, b) => b.quantity - a.quantity);
      }

      setDonations(allDonations);
    } catch (err) {
      console.error('[AvailabilityPage Error]:', err);
      setError('Unable to load available food.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [requestId]);

  return (
    <div className="fb-find-food">
      <div className="fb-page-header">
        <div>
          <h1>Available Food</h1>
          <p className="fb-page-header__subtitle">
            Find surplus food that matches your request
          </p>
        </div>
      </div>

      {/* Active Request Details Banner */}
      {activeRequest && (
        <div className="fb-request-banner" style={{
          background: 'var(--cream, #fffbf5)',
          border: '1.5px solid var(--orange-border, rgba(249, 115, 22, 0.35))',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--orange, #f97316)',
              display: 'block',
              marginBottom: '0.2rem'
            }}>
              📋 Active Food Request
            </span>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--dark, #0f172a)' }}>
              {activeRequest.foodType} · {activeRequest.quantity} {activeRequest.unit}
            </h3>
            {activeRequest.dietaryInformation && (
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: 'var(--text-muted, #64748b)' }}>
                Dietary: {activeRequest.dietaryInformation}
              </p>
            )}
          </div>
          <button
            className="fb-btn fb-btn--outline fb-btn--sm"
            onClick={() => navigate('/receiver/request?edit=true')}
          >
            ✏️ Edit Request
          </button>
        </div>
      )}

      {/* Content States */}
      {loading && <Loader text="Finding available food..." />}

      {!loading && error && (
        <ErrorState
          description={error}
          onRetry={loadData}
        />
      )}

      {!loading && !error && donations.length === 0 && (
        <EmptyState
          icon="🍱"
          title="No matching food is currently available."
          description={
            activeRequest
              ? `No ${activeRequest.foodType} donations available right now. Try editing your request or check back later.`
              : 'Try checking again later or start a food request.'
          }
          actionLabel="Change Request"
          onAction={() => navigate('/receiver/request?edit=true')}
        />
      )}

      {!loading && !error && donations.length > 0 && (
        <div className="fb-donations-grid">
          {donations.map((d) => (
            <DonationCard
              key={d._id}
              donation={d}
              linkBase="/receiver/food"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;

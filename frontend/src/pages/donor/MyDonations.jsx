import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyDonations } from '../../services/donationService';
import DonationCard from '../../components/donation/DonationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const FILTERS = ['All', 'AVAILABLE', 'MATCHED', 'ACCEPTED', 'COMPLETED', 'EXPIRED'];

const MyDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    const res = await getMyDonations();
    setLoading(false);
    if (res.success) setDonations(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, []);

  const filtered = donations.filter((d) => {
    const matchesFilter = filter === 'All' || d.status === filter;
    const matchesSearch = !search || d.foodType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fb-my-donations">
      <div className="fb-page-header">
        <div>
          <h1>My Donations</h1>
          <p className="fb-page-header__subtitle">Manage and track all your surplus food donations</p>
        </div>
        <button className="fb-btn fb-btn--primary" onClick={() => navigate('/donor/donations/create')}>
          + Create Donation
        </button>
      </div>

      {/* Filter bar */}
      <div className="fb-filter-bar">
        <div className="fb-filter-bar__tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`fb-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>
        <input
          className="fb-filter-bar__search"
          placeholder="Search by food type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <Loader text="Loading donations..." />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="🍱"
          title={filter === 'All' ? 'No donations yet' : `No ${filter.toLowerCase()} donations`}
          description="Create a donation to get started"
          actionLabel="Create Donation"
          onAction={() => navigate('/donor/donations/create')}
        />
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="fb-donations-grid">
          {filtered.map((d) => (
            <DonationCard key={d._id} donation={d} linkBase="/donor/donations" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;

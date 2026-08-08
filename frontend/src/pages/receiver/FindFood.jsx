import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableDonations } from '../../services/donationService';
import DonationCard from '../../components/donation/DonationCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

const CATEGORIES = ['All', 'Vegetarian Meals', 'Non-Vegetarian Meals', 'Bakery Items', 'Fresh Produce', 'Dairy Products', 'Grains & Cereals', 'Fruits'];
const PRIORITIES = ['All', 'CRITICAL', 'HIGH', 'MEDIUM'];

const FindFood = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');

  const load = async () => {
    setLoading(true);
    const res = await getAvailableDonations();
    setLoading(false);
    if (res.success) setDonations(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, []);

  const filtered = donations.filter((d) => {
    const matchSearch = !search || d.foodType.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || d.foodType === category;
    const matchPri = priority === 'All' || d.aiPriority === priority;
    return matchSearch && matchCat && matchPri;
  });

  return (
    <div className="fb-find-food">
      <div className="fb-page-header">
        <h1>Find Food</h1>
        <p className="fb-page-header__subtitle">Browse available surplus donations near you</p>
      </div>

      {/* Search & Filters */}
      <div className="fb-filter-bar">
        <input
          className="fb-filter-bar__search fb-filter-bar__search--wide"
          placeholder="Search food type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="fb-filter-bar__row">
          <div className="fb-filter-bar__tabs">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                className={`fb-filter-tab ${priority === p ? 'active' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <select
            className="fb-filter-bar__select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading && <Loader text="Finding available food..." />}
      {!loading && error && <ErrorState description={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon="🍱" title="No food found" description="Try adjusting your filters" />
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="fb-donations-grid">
          {filtered.map((d) => (
            <DonationCard key={d._id} donation={d} linkBase="/receiver/food" />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindFood;

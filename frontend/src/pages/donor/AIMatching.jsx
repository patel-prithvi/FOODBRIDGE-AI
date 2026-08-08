import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDonationById, selectReceiver } from '../../services/donationService';
import { getMatchedReceivers } from '../../services/aiService';
import MatchCard from '../../components/ai/MatchCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import Toast from '../../components/common/Toast';

const AIMatching = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const load = async () => {
    setLoading(true);
    setError('');
    const [donRes, matchRes] = await Promise.all([
      getDonationById(id),
      getMatchedReceivers(id),
    ]);
    setLoading(false);

    if (donRes.success) setDonation(donRes.data);
    if (matchRes.success) setReceivers(matchRes.data);
    else setError(matchRes.error);
  };

  useEffect(() => { load(); }, [id]);

  const handleSelect = async (receiver) => {
    setSelected(receiver);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    const res = await selectReceiver(id, selected._id);
    setConfirming(false);

    if (res.success) {
      setToast({ message: `${selected.organizationName} selected as receiver!`, type: 'success' });
      setTimeout(() => navigate(`/donor/donations/${id}`), 1800);
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  if (loading) return <Loader text="🤖 AI is finding the best receivers..." />;

  return (
    <div className="fb-ai-matching">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

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
          <p>🤖 AI analysis is temporarily unavailable. Please try again.</p>
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

          {selected && (
            <div className="fb-ai-matching__confirm">
              <div className="fb-ai-matching__confirm-text">
                <strong>{selected.organizationName}</strong> selected ({selected.matchScore}% match)
              </div>
              <button
                className="fb-btn fb-btn--primary fb-btn--lg"
                onClick={handleConfirm}
                disabled={confirming}
              >
                {confirming ? 'Confirming...' : '✓ Confirm Selection'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIMatching;

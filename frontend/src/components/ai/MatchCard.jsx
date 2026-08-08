import React from 'react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const MatchFactor = ({ label, score }) => (
  <div className="fb-match-factor">
    <span className="fb-match-factor__label">{label}</span>
    <div className="fb-match-factor__bar">
      <div className="fb-match-factor__fill" style={{ width: `${score}%` }} />
    </div>
    <span className="fb-match-factor__score">{score}%</span>
  </div>
);

const MatchCard = ({ receiver, rank, onSelect, selected }) => {
  const {
    organizationName,
    matchScore,
    matchFactors,
    matchExplanation,
    location,
    verificationStatus,
    foodRequest,
  } = receiver;

  return (
    <div className={`fb-match-card ${selected ? 'fb-match-card--selected' : ''} ${rank === 0 ? 'fb-match-card--top' : ''}`}>
      <div className="fb-match-card__header">
        <div className="fb-match-card__info">
          {rank === 0 && <span className="fb-match-card__top-badge">🏆 Top Match</span>}
          <h3 className="fb-match-card__name">{organizationName}</h3>
          <p className="fb-match-card__loc">📍 {location?.city}</p>
        </div>
        <div className="fb-match-card__score-wrap">
          <div className="fb-match-card__score">{matchScore}%</div>
          <div className="fb-match-card__score-label">AI Match</div>
        </div>
      </div>

      {verificationStatus === 'VERIFIED' && (
        <Badge variant="success" className="fb-match-card__verified">✓ Verified</Badge>
      )}

      {/* Receiver's actual food request — what they need and how much */}
      {foodRequest && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '0.6rem 1rem',
          margin: '0.75rem 0',
          fontSize: '0.85rem',
        }}>
          <span style={{ fontWeight: 700, color: '#15803d', marginRight: '0.4rem' }}>
            📋 Their Need:
          </span>
          <span style={{ color: '#166534' }}>
            {foodRequest.quantity} {foodRequest.unit} of {foodRequest.foodType}
            {foodRequest.dietaryInformation && ` · ${foodRequest.dietaryInformation}`}
          </span>
          {foodRequest.exactFoodTypeMatch && (
            <span style={{
              marginLeft: '0.5rem',
              background: '#dcfce7',
              color: '#166534',
              borderRadius: '4px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              ✓ Exact Match
            </span>
          )}
        </div>
      )}

      {matchFactors && (
        <div className="fb-match-card__factors">
          <MatchFactor label="Capacity" score={matchFactors.capacity} />
          <MatchFactor label="Dietary Compatibility" score={matchFactors.dietaryCompatibility} />
          <MatchFactor label="Distance" score={matchFactors.distance} />
          <MatchFactor label="Pickup Timing" score={matchFactors.pickupTiming} />
          <MatchFactor label="Verification" score={matchFactors.verification} />
        </div>
      )}

      {matchExplanation && (
        <div className="fb-match-card__explanation">
          <p className="fb-match-card__why-label">WHY THIS MATCH?</p>
          <p className="fb-match-card__why-text">{matchExplanation}</p>
        </div>
      )}

      <div className="fb-match-card__actions">
        <Button
          variant={selected ? 'secondary' : 'primary'}
          onClick={() => onSelect(receiver)}
        >
          {selected ? '✓ Selected' : 'Select Receiver'}
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;

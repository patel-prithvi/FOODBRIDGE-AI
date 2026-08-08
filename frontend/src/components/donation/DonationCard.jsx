import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatDate, formatTime, priorityClass, statusLabel, statusVariant } from '../../utils/helpers';

const DonationCard = ({ donation, linkBase = '/donor/donations' }) => {
  const navigate = useNavigate();

  return (
    <div className="fb-donation-card" onClick={() => navigate(`${linkBase}/${donation._id}`)}>
      <div className="fb-donation-card__top">
        <div className="fb-donation-card__info">
          <h3 className="fb-donation-card__food">{donation.foodType}</h3>
          <p className="fb-donation-card__qty">
            {donation.quantity} {donation.unit}
          </p>
        </div>
        <div className="fb-donation-card__badges">
          <Badge variant={priorityClass(donation.aiPriority)}>{donation.aiPriority}</Badge>
          <Badge variant={statusVariant(donation.status)}>{statusLabel(donation.status)}</Badge>
        </div>
      </div>

      <div className="fb-donation-card__meta">
        <span className="fb-donation-card__date">📅 {formatDate(donation.createdAt)}</span>
        {donation.pickupStart && (
          <span className="fb-donation-card__pickup">
            🕐 {formatTime(donation.pickupStart)} – {formatTime(donation.pickupEnd)}
          </span>
        )}
        <span className="fb-donation-card__loc">
          📍 {donation.location?.city}
        </span>
      </div>

      {donation.aiScore && (
        <div className="fb-donation-card__ai">
          <span className="fb-donation-card__ai-label">🤖 AI Risk</span>
          <div className="fb-donation-card__ai-bar">
            <div
              className={`fb-donation-card__ai-fill ${priorityClass(donation.aiPriority)}`}
              style={{ width: `${donation.aiRisk}%` }}
            />
          </div>
          <span className="fb-donation-card__ai-score">{donation.aiRisk}%</span>
        </div>
      )}

      {donation.matchedReceiver && (
        <div className="fb-donation-card__receiver">
          ✓ Matched: <strong>{donation.matchedReceiver.organizationName}</strong>
        </div>
      )}
    </div>
  );
};

export default DonationCard;

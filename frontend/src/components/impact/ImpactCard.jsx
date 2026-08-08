import React from 'react';

const ImpactCard = ({ icon, value, label, color = 'orange' }) => (
  <div className={`fb-impact-card fb-impact-card--${color}`}>
    <div className="fb-impact-card__icon">{icon}</div>
    <div className="fb-impact-card__value">{value}</div>
    <div className="fb-impact-card__label">{label}</div>
  </div>
);

export default ImpactCard;

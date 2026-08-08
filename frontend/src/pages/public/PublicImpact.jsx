import React from 'react';
import { mockImpactStats } from '../../data/mockData';
import ImpactCard from '../../components/impact/ImpactCard';

const PublicImpact = () => {
  const stats = mockImpactStats;
  return (
    <div className="fb-public-impact">
      <div className="fb-section__inner">
        <h1 className="fb-section__title">Community Impact</h1>
        <p className="fb-section__sub">Real results from the FoodBridge AI network</p>

        <div className="fb-impact-cards-grid">
          <ImpactCard icon="🍽️" value={stats.mealsRedistributed.toLocaleString()} label="Meals Redistributed" color="orange" />
          <ImpactCard icon="⚖️" value={`${stats.foodSavedKg} KG`} label="Food Saved" color="green" />
          <ImpactCard icon="✅" value={stats.donationsCompleted} label="Donations Completed" color="blue" />
          <ImpactCard icon="🏢" value={stats.activeReceivers} label="Active Receivers" color="purple" />
        </div>
      </div>
    </div>
  );
};

export default PublicImpact;

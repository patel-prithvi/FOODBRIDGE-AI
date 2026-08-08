import React from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    step: '01',
    icon: '🍱',
    title: 'Donor Creates Surplus Listing',
    desc: 'A restaurant, hotel, or caterer logs their surplus food — type, quantity, pickup window, and location.',
  },
  {
    step: '02',
    icon: '🤖',
    title: 'AI Analyzes Risk & Priority',
    desc: 'Our AI engine evaluates surplus risk based on quantity, time sensitivity, and perishability to assign urgency.',
  },
  {
    step: '03',
    icon: '🎯',
    title: 'AI Matches with Best Receiver',
    desc: 'The system scores nearby receivers by capacity, dietary compatibility, distance, and pickup timing.',
  },
  {
    step: '04',
    icon: '🏢',
    title: 'Receiver Accepts Donation',
    desc: 'An NGO, shelter, or community kitchen reviews and accepts the matched donation.',
  },
  {
    step: '05',
    icon: '🚚',
    title: 'Pickup Scheduled',
    desc: 'The receiver arrives at the pickup location within the window. Donor confirms handover.',
  },
  {
    step: '06',
    icon: '💚',
    title: 'Impact Recorded',
    desc: 'Meals saved, food redistributed, and environmental impact are logged on both dashboards.',
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <div className="fb-how">
      <div className="fb-how__hero">
        <h1>How FoodBridge AI Works</h1>
        <p>A simple, intelligent flow from surplus to impact</p>
      </div>

      <div className="fb-how__steps">
        {steps.map((s) => (
          <div key={s.step} className="fb-how__step">
            <div className="fb-how__step-num">{s.step}</div>
            <div className="fb-how__step-icon">{s.icon}</div>
            <div className="fb-how__step-content">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="fb-how__cta">
        <button className="fb-btn fb-btn--primary fb-btn--lg" onClick={() => navigate('/register')}>
          Get Started Free
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;

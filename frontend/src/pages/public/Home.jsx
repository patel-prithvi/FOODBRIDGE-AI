import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockPublicDonations } from '../../data/mockData';
import Badge from '../../components/common/Badge';
import { priorityClass } from '../../utils/helpers';

const FOOD_CATEGORIES = [
  { icon: '🍱', label: 'Meals' },
  { icon: '🥐', label: 'Bakery' },
  { icon: '🥦', label: 'Produce' },
  { icon: '🥛', label: 'Dairy' },
  { icon: '🌾', label: 'Grains' },
  { icon: '🍎', label: 'Fruits' },
];

const AI_STEPS = [
  { icon: '🍽️', label: 'Surplus' },
  { icon: '🤖', label: 'AI Analysis' },
  { icon: '🔴', label: 'Priority' },
  { icon: '🎯', label: 'Matching' },
  { icon: '🏢', label: 'Receiver' },
  { icon: '🚚', label: 'Pickup' },
  { icon: '💚', label: 'Impact' },
];

const COMMUNITY_TYPES = [
  '🍽️ Restaurants', '🏨 Hotels', '🛎️ Hostels',
  '🏫 Cafeterias', '🎪 Events', '🤝 NGOs',
  '🏠 Shelters', '👨‍🍳 Community Kitchens',
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDonateCTA = () => {
    if (user?.role === 'DONOR') navigate('/donor/donations/create');
    else navigate('/register');
  };

  const handleFindFoodCTA = () => {
    if (user?.role === 'RECEIVER') navigate('/receiver/food');
    else navigate('/register');
  };

  return (
    <div className="fb-home">
      {/* ── HERO ── */}
      <section className="fb-hero">
        <div className="fb-hero__inner">
          <span className="fb-hero__badge">🍊 AI-Powered Food Redistribution Platform</span>
          <h1 className="fb-hero__title">
            Turn Surplus Food<br />
            <span className="fb-hero__title-accent">Into Impact</span>
          </h1>
          <p className="fb-hero__desc">
            FoodBridge AI predicts surplus urgency and connects donors with
            the right receivers — before food goes to waste.
          </p>
          <div className="fb-hero__ctas">
            <button className="fb-btn fb-btn--primary fb-btn--lg" onClick={handleDonateCTA}>
              🍽️ Donate Surplus
            </button>
            <button className="fb-btn fb-btn--outline fb-btn--lg" onClick={handleFindFoodCTA}>
              🔍 Find Food
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOD CATEGORIES ── */}
      <section className="fb-section fb-section--cream">
        <div className="fb-section__inner">
          <h2 className="fb-section__title">What Can You Redistribute?</h2>
          <p className="fb-section__sub">From fresh produce to cooked meals — every food type matters</p>
          <div className="fb-categories-grid">
            {FOOD_CATEGORIES.map((cat) => (
              <div key={cat.label} className="fb-category-chip">
                <span className="fb-category-chip__icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENT FOOD ── */}
      <section className="fb-section">
        <div className="fb-section__inner">
          <h2 className="fb-section__title">⚡ Urgent Food Near You</h2>
          <p className="fb-section__sub">These donations need a receiver right now</p>
          <div className="fb-urgent-grid">
            {mockPublicDonations.map((d) => (
              <div key={d._id} className="fb-urgent-card">
                <div className="fb-urgent-card__top">
                  <span className="fb-urgent-card__food">{d.foodType}</span>
                  <Badge variant={priorityClass('CRITICAL')}>{d.priority}</Badge>
                </div>
                <div className="fb-urgent-card__qty">{d.quantity} {d.unit}</div>
                <div className="fb-urgent-card__meta">
                  <span>📍 {d.distance}</span>
                  <span>⏱ {d.minutesLeft} min left</span>
                </div>
                <div className="fb-urgent-card__ai">
                  🤖 <strong>{d.aiScore}%</strong> AI Match Score
                </div>
                <button
                  className="fb-btn fb-btn--primary fb-btn--sm fb-btn--full"
                  onClick={handleFindFoodCTA}
                >
                  View & Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI WORKFLOW ── */}
      <section className="fb-section fb-section--dark">
        <div className="fb-section__inner">
          <h2 className="fb-section__title fb-section__title--light">How FoodBridge AI Works</h2>
          <p className="fb-section__sub fb-section__sub--light">
            AI-driven workflow from surplus to impact in minutes
          </p>
          <div className="fb-workflow">
            {AI_STEPS.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="fb-workflow__step">
                  <div className="fb-workflow__step-icon">{step.icon}</div>
                  <div className="fb-workflow__step-label">{step.label}</div>
                </div>
                {i < AI_STEPS.length - 1 && <div className="fb-workflow__arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="fb-section fb-section--cream">
        <div className="fb-section__inner">
          <h2 className="fb-section__title">Our Community Network</h2>
          <p className="fb-section__sub">Connecting every link in the food redistribution chain</p>
          <div className="fb-community-grid">
            {COMMUNITY_TYPES.map((type) => (
              <div key={type} className="fb-community-chip">{type}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="fb-section">
        <div className="fb-section__inner">
          <h2 className="fb-section__title">Real Impact, Real Numbers</h2>
          <div className="fb-impact-stats">
            <div className="fb-impact-stat">
              <div className="fb-impact-stat__value">1,248</div>
              <div className="fb-impact-stat__label">Meals Redistributed</div>
            </div>
            <div className="fb-impact-stat">
              <div className="fb-impact-stat__value">426 KG</div>
              <div className="fb-impact-stat__label">Food Saved</div>
            </div>
            <div className="fb-impact-stat">
              <div className="fb-impact-stat__value">87</div>
              <div className="fb-impact-stat__label">Donations Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="fb-section fb-section--orange">
        <div className="fb-section__inner fb-final-cta">
          <h2>Ready to Make a Difference?</h2>
          <p>Join the FoodBridge AI network and help eliminate food waste today.</p>
          <div className="fb-hero__ctas">
            <button className="fb-btn fb-btn--white fb-btn--lg" onClick={handleDonateCTA}>
              Start Donating
            </button>
            <button className="fb-btn fb-btn--outline-white fb-btn--lg" onClick={handleFindFoodCTA}>
              Find Available Food
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

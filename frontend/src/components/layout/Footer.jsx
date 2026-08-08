import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="fb-footer">
    <div className="fb-footer__inner">
      <div className="fb-footer__brand">
        <span className="fb-footer__brand-icon">🌉</span>
        <span className="fb-footer__brand-name">FoodBridge <strong>AI</strong></span>
        <p className="fb-footer__tagline">Turn Surplus Food Into Impact</p>
      </div>

      <div className="fb-footer__links">
        <div className="fb-footer__col">
          <h4>Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/impact">Public Impact</Link>
        </div>
        <div className="fb-footer__col">
          <h4>Donors</h4>
          <Link to="/donor/dashboard">Dashboard</Link>
          <Link to="/donor/donations/create">Donate Food</Link>
        </div>
        <div className="fb-footer__col">
          <h4>Receivers</h4>
          <Link to="/receiver/dashboard">Dashboard</Link>
          <Link to="/receiver/food">Find Food</Link>
        </div>
      </div>
    </div>
    <div className="fb-footer__bottom">
      <span>© 2026 FoodBridge AI · Powered by MERN + AI</span>
    </div>
  </footer>
);

export default Footer;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const donorLinks = [
    { to: '/donor/dashboard', label: 'Dashboard' },
    { to: '/donor/donations/create', label: 'Donate Food' },
    { to: '/donor/donations', label: 'My Donations' },
    { to: '/donor/impact', label: 'Impact' },
  ];

  const receiverLinks = [
    { to: '/receiver/dashboard', label: 'Dashboard' },
    { to: '/receiver/request', label: 'Find Food' },
    { to: '/receiver/recommended', label: 'AI Picks' },
    { to: '/receiver/impact', label: 'Impact' },
  ];

  const navLinks = user?.role === 'DONOR' ? donorLinks : user?.role === 'RECEIVER' ? receiverLinks : [];

  return (
    <nav className="fb-navbar">
      <div className="fb-navbar__inner">
        {/* Brand */}
        <Link to="/" className="fb-navbar__brand">
          <span className="fb-navbar__brand-icon">🌉</span>
          <span>FoodBridge <strong>AI</strong></span>
        </Link>

        {/* Desktop nav links */}
        {user && (
          <div className="fb-navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`fb-navbar__link ${location.pathname.startsWith(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="fb-navbar__right">
          {user ? (
            <>
              <span className={`fb-navbar__role-tag ${user.role === 'DONOR' ? 'donor' : 'receiver'}`}>
                {user.role === 'DONOR' ? '🏪' : '🏢'} {user.role}
              </span>
              <span className="fb-navbar__org">{user.organizationName}</span>
              <button className="fb-navbar__logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="fb-navbar__auth-btns">
              <Link to="/login" className="fb-navbar__link">Sign In</Link>
              <Link to="/register" className="fb-navbar__cta">Get Started</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="fb-navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fb-navbar__mobile-menu">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="fb-navbar__mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button className="fb-navbar__mobile-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="fb-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="fb-navbar__mobile-link" onClick={() => setMenuOpen(false)}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

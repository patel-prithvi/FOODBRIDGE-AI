import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RoleSelector } from './components/RoleSelector';
import { DonorRegisterForm } from './components/DonorRegisterForm';
import { ReceiverRegisterForm } from './components/ReceiverRegisterForm';
import { LoginForm } from './components/LoginForm';
import { DonorDashboardPlaceholder } from './components/DonorDashboardPlaceholder';
import { ReceiverDashboardPlaceholder } from './components/ReceiverDashboardPlaceholder';
import {
  registerUser,
  loginUser,
  fetchCurrentUser,
  logoutUser,
  checkHealth
} from './services/api';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('register'); // 'register' | 'login'
  const [selectedRole, setSelectedRole] = useState('DONOR'); // 'DONOR' | 'RECEIVER'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [systemHealth, setSystemHealth] = useState(null);

  // Auto-restore session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('foodbridge_token');
    const cachedUser = localStorage.getItem('foodbridge_user');

    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch (e) {
        // Invalid cached user format
      }
    }

    if (token) {
      fetchCurrentUser().then((res) => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      });
    }

    // Also check backend health
    checkHealth().then((res) => {
      if (res.success) {
        setSystemHealth(res.data);
      }
    });
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setAuthError('');
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setAuthError('');

    const result = await registerUser(formData);
    setLoading(false);

    if (result.success && result.data?.user) {
      setCurrentUser(result.data.user);
    } else {
      setAuthError(result.error || 'Registration failed');
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setAuthError('');

    const result = await loginUser(credentials);
    setLoading(false);

    if (result.success && result.data?.user) {
      setCurrentUser(result.data.user);
    } else {
      setAuthError(result.error || 'Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setAuthView('login');
  };

  const handleNavigate = (view) => {
    setAuthView(view);
    setAuthError('');
  };

  return (
    <div className="app-main-layout">
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={authView}
      />

      {/* Main Content Area */}
      <main className="content-container">
        {currentUser ? (
          /* PROTECTED ROLE-BASED DASHBOARD ROUTE PLACEHOLDERS */
          currentUser.role === 'DONOR' ? (
            <DonorDashboardPlaceholder user={currentUser} onLogout={handleLogout} />
          ) : currentUser.role === 'RECEIVER' ? (
            <ReceiverDashboardPlaceholder user={currentUser} onLogout={handleLogout} />
          ) : (
            <div className="alert-box error">Unauthorized user role</div>
          )
        ) : (
          /* AUTHENTICATION VIEW */
          <div className="auth-wrapper">
            <div className="auth-hero">
              <span className="hero-badge">🍊 Food Surplus Redistribution Platform</span>
              <h1>Connect Food With Those Who Need It</h1>
              <p className="hero-description">
                FoodBridge AI brings together restaurants, caterers, and food banks to eliminate waste and deliver fresh meals efficiently.
              </p>
            </div>

            <div className="auth-card-container">
              {authView === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  error={authError}
                  onSwitchToRegister={() => setAuthView('register')}
                />
              ) : (
                <div className="registration-flow">
                  {/* PHASE 3: Role Selection */}
                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelectRole={handleRoleSelect}
                  />

                  {/* Role Specific Registration Form */}
                  {selectedRole === 'DONOR' ? (
                    <DonorRegisterForm
                      onSubmit={handleRegister}
                      loading={loading}
                      error={authError}
                      onChangeRole={() => setAuthView('register')}
                    />
                  ) : (
                    <ReceiverRegisterForm
                      onSubmit={handleRegister}
                      loading={loading}
                      error={authError}
                      onChangeRole={() => setAuthView('register')}
                    />
                  )}

                  <div className="form-footer-switch text-center">
                    <span>Already registered? </span>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => setAuthView('login')}
                    >
                      Sign In to Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* System Status Footer */}
      <footer className="footer-system-bar">
        <div className="footer-content">
          <span>FoodBridge AI • MERN Authentication System (Phase 1)</span>
          <span className="system-pill">
            Backend & DB Status:{' '}
            <strong
              className={
                systemHealth?.database?.isConnected ? 'text-success' : 'text-error'
              }
            >
              {systemHealth?.database?.isConnected ? 'Connected ✓' : 'Connecting...'}
            </strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

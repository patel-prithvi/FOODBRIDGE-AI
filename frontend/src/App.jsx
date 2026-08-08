import { useState, useEffect } from 'react';
import { checkHealth } from './services/api';
import './App.css';

function App() {
  const [healthState, setHealthState] = useState({
    loading: true,
    backendConnected: false,
    databaseConnected: false,
    message: '',
    databaseInfo: null,
    error: null,
    lastChecked: null,
  });

  const verifyConnection = async () => {
    setHealthState((prev) => ({ ...prev, loading: true, error: null }));
    const result = await checkHealth();

    if (result.success && result.data) {
      const isDbOk = result.data.database?.isConnected || false;
      setHealthState({
        loading: false,
        backendConnected: true,
        databaseConnected: isDbOk,
        message: result.data.message || 'API operational',
        databaseInfo: result.data.database || null,
        error: null,
        lastChecked: new Date().toLocaleTimeString(),
      });
    } else {
      setHealthState({
        loading: false,
        backendConnected: false,
        databaseConnected: false,
        message: '',
        databaseInfo: null,
        error: result.error || 'Failed to reach backend',
        lastChecked: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    verifyConnection();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-badge">🌉 FoodBridge AI</div>
        <h1>MERN Stack Foundation Test</h1>
        <p className="subtitle">Verification Dashboard for Hackathon Core Setup</p>
      </header>

      <main className="status-grid">
        {/* Frontend Status Card */}
        <div className="status-card active">
          <div className="card-header">
            <span className="card-icon">⚡</span>
            <h3>React Frontend</h3>
          </div>
          <div className="card-body">
            <div className="status-indicator success">
              <span className="dot"></span> Running (Vite)
            </div>
            <p className="info-text">Port: 5173</p>
          </div>
        </div>

        {/* Backend Status Card */}
        <div className={`status-card ${healthState.backendConnected ? 'active' : 'error'}`}>
          <div className="card-header">
            <span className="card-icon">🚀</span>
            <h3>Express Backend</h3>
          </div>
          <div className="card-body">
            {healthState.loading ? (
              <div className="status-indicator loading">
                <span className="spinner"></span> Testing connection...
              </div>
            ) : healthState.backendConnected ? (
              <div className="status-indicator success">
                <span className="dot"></span> Connected ✓
              </div>
            ) : (
              <div className="status-indicator fail">
                <span className="dot red"></span> Disconnected ✗
              </div>
            )}
            <p className="info-text">Target: http://localhost:5000</p>
          </div>
        </div>

        {/* Database Status Card */}
        <div className={`status-card ${healthState.databaseConnected ? 'active' : 'error'}`}>
          <div className="card-header">
            <span className="card-icon">🍃</span>
            <h3>MongoDB Database</h3>
          </div>
          <div className="card-body">
            {healthState.loading ? (
              <div className="status-indicator loading">
                <span className="spinner"></span> Checking Mongoose...
              </div>
            ) : healthState.databaseConnected ? (
              <div className="status-indicator success">
                <span className="dot"></span> Connected ✓
              </div>
            ) : (
              <div className="status-indicator fail">
                <span className="dot red"></span> Disconnected ✗
              </div>
            )}
            <p className="info-text">
              Database: {healthState.databaseInfo?.name || 'foodbridge_db'}
            </p>
          </div>
        </div>
      </main>

      {/* Details Box */}
      <section className="details-panel">
        <div className="panel-header">
          <h2>Health Endpoint Output (GET /api/health)</h2>
          <button onClick={verifyConnection} className="refresh-btn" disabled={healthState.loading}>
            {healthState.loading ? 'Checking...' : '🔄 Re-test Connection'}
          </button>
        </div>

        <div className="panel-content">
          {healthState.error && (
            <div className="alert-box error">
              <strong>Connection Error:</strong> {healthState.error}
            </div>
          )}

          {!healthState.loading && healthState.backendConnected && (
            <div className="json-display">
              <pre>
                {JSON.stringify(
                  {
                    backendMessage: healthState.message,
                    databaseStatus: healthState.databaseInfo?.status,
                    databaseConnected: healthState.databaseConnected,
                    lastCheckTimestamp: healthState.lastChecked,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </section>

      <footer className="app-footer">
        FoodBridge AI • React → Express → MongoDB Connection Verified
      </footer>
    </div>
  );
}

export default App;

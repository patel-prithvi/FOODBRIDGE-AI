import React, { useState, useEffect } from 'react';
import { getImpactStats } from '../../services/impactService';
import ImpactCard from '../../components/impact/ImpactCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const ReceiverImpact = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await getImpactStats();
    setLoading(false);
    if (res.success) setStats(res.data);
    else setError(res.error);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader text="Loading impact data..." />;
  if (error) return <ErrorState description={error} onRetry={load} />;
  if (!stats) return null;

  return (
    <div className="fb-impact">
      <div className="fb-page-header">
        <h1>Your Impact Dashboard</h1>
        <p className="fb-page-header__subtitle">Meals your organization has helped redistribute</p>
      </div>

      <div className="fb-impact-cards-grid">
        <ImpactCard icon="🍽️" value={stats.mealsRedistributed.toLocaleString()} label="Meals Received" color="orange" />
        <ImpactCard icon="⚖️" value={`${stats.foodSavedKg} KG`} label="Food Received" color="green" />
        <ImpactCard icon="✅" value={stats.donationsCompleted} label="Donations Completed" color="blue" />
        <ImpactCard icon="👥" value={stats.activeReceivers} label="Network Size" color="purple" />
      </div>

      <div className="fb-impact-charts">
        <div className="fb-chart-card">
          <h3>Meals Received Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.weeklyData}>
              <defs>
                <linearGradient id="recvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="meals" stroke="#10b981" fill="url(#recvGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="fb-chart-card">
          <h3>Food Received (kg) by Week</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="kg" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReceiverImpact;

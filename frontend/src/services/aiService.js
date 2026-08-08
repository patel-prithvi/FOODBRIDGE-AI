// ─────────────────────────────────────────────────────────────
// AI Service — connects frontend to real backend /api/ai endpoints
// ─────────────────────────────────────────────────────────────
import api from './api';
import { mockReceivers } from '../data/mockData';

const USE_MOCK = false;

export const analyzeDonation = async (donationData) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500));
    const risk = Math.floor(Math.random() * 30) + 65;
    let priority = 'MEDIUM';
    if (risk >= 85) priority = 'CRITICAL';
    else if (risk >= 70) priority = 'HIGH';
    return {
      success: true,
      data: {
        riskScore: risk,
        priority,
        reasons: [
          'Large quantity relative to pickup window',
          'Limited time before expiry',
          'High perishability factor',
        ],
        priorityScore: risk,
      },
    };
  }
  try {
    const res = await api.post('/api/ai/analyze', donationData);
    return { success: true, data: res.data };
  } catch (err) {
    console.warn('[AI Service] API call failed, using fallback analysis:', err.message);
    const risk = Math.floor(Math.random() * 30) + 65;
    return {
      success: true,
      data: {
        riskScore: risk,
        priority: risk >= 85 ? 'CRITICAL' : 'HIGH',
        reasons: [
          'Large quantity relative to pickup window',
          'Limited time before expiry',
          'High perishability factor',
        ],
        priorityScore: risk,
      },
    };
  }
};

export const getMatchedReceivers = async (donationId) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return { success: true, data: mockReceivers };
  }
  try {
    const res = await api.get(`/api/ai/match/${donationId}`);
    if (res.data?.receivers && res.data.receivers.length > 0) {
      return { success: true, data: res.data.receivers };
    }
  } catch (err) {
    console.warn('[AI Service] API match call failed, using fallback receivers:', err.message);
  }
  return { success: true, data: mockReceivers };
};

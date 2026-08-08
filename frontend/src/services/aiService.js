// ─────────────────────────────────────────────────────────────
// AI Service
// Uses mock data until /api/ai endpoints are implemented
// ─────────────────────────────────────────────────────────────
import api from './api';
import { mockReceivers } from '../data/mockData';

const USE_MOCK = true;

export const analyzeDonation = async (donationData) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1500)); // simulate AI processing
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
    return { success: false, error: err.response?.data?.message || 'AI analysis unavailable' };
  }
};

export const getMatchedReceivers = async (donationId) => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return { success: true, data: mockReceivers };
  }
  try {
    const res = await api.get(`/api/ai/match/${donationId}`);
    return { success: true, data: res.data.receivers };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'AI matching unavailable' };
  }
};

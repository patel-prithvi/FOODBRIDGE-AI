// ─────────────────────────────────────────────────────────────
// Impact Service
// Uses mock data until /api/impact endpoints are implemented
// ─────────────────────────────────────────────────────────────
import api from './api';
import { mockImpactStats } from '../data/mockData';

const USE_MOCK = true;

export const getImpactStats = async () => {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, data: mockImpactStats };
  }
  try {
    const res = await api.get('/api/impact');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to load impact data' };
  }
};

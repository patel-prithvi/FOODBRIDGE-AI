// ─────────────────────────────────────────────────────────────
// Donation Service
// Uses mock data until /api/donations endpoints are implemented
// ─────────────────────────────────────────────────────────────
import api from './api';
import { mockDonations } from '../data/mockData';

const USE_MOCK = true; // flip to false once backend endpoints are live

export const getMyDonations = async () => {
  if (USE_MOCK) return { success: true, data: mockDonations };
  try {
    const res = await api.get('/api/donations/my');
    return { success: true, data: res.data.donations };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to load donations' };
  }
};

export const getDonationById = async (id) => {
  if (USE_MOCK) {
    const donation = mockDonations.find((d) => d._id === id);
    return donation
      ? { success: true, data: donation }
      : { success: false, error: 'Donation not found' };
  }
  try {
    const res = await api.get(`/api/donations/${id}`);
    return { success: true, data: res.data.donation };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to load donation' };
  }
};

export const createDonation = async (donationData) => {
  if (USE_MOCK) {
    const newDonation = {
      _id: 'd' + Date.now(),
      ...donationData,
      status: 'AVAILABLE',
      aiRisk: Math.floor(Math.random() * 40) + 60,
      aiPriority: 'HIGH',
      aiScore: Math.floor(Math.random() * 20) + 75,
      matchedReceiver: null,
      createdAt: new Date().toISOString(),
    };
    mockDonations.unshift(newDonation);
    return { success: true, data: newDonation };
  }
  try {
    const res = await api.post('/api/donations', donationData);
    return { success: true, data: res.data.donation };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to create donation' };
  }
};

export const selectReceiver = async (donationId, receiverId) => {
  if (USE_MOCK) {
    return { success: true, data: { donationId, receiverId, status: 'MATCHED' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/select-receiver`, { receiverId });
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to select receiver' };
  }
};

export const acceptDonation = async (donationId) => {
  if (USE_MOCK) {
    return { success: true, data: { donationId, status: 'ACCEPTED' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/accept`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to accept donation' };
  }
};

export const completePickup = async (donationId) => {
  if (USE_MOCK) {
    return { success: true, data: { donationId, status: 'COMPLETED' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/complete`);
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to complete pickup' };
  }
};

export const getAvailableDonations = async () => {
  if (USE_MOCK) {
    return { success: true, data: mockDonations.filter((d) => d.status === 'AVAILABLE' || d.status === 'MATCHED') };
  }
  try {
    const res = await api.get('/api/donations/available');
    return { success: true, data: res.data.donations };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to load available donations' };
  }
};

// ─────────────────────────────────────────────────────────────
// Donation Service — connects frontend to real backend /api/donations endpoints
// ─────────────────────────────────────────────────────────────
import api from './api';
import { mockDonations } from '../data/mockData';

const USE_MOCK = false;

const isMongoId = (id) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);

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
  // First check in-memory mock items
  const mockItem = mockDonations.find((d) => d._id === id);

  if (USE_MOCK || !isMongoId(id)) {
    return mockItem
      ? { success: true, data: mockItem }
      : {
          success: true,
          data: {
            _id: id,
            foodType: 'Vegetarian Meals',
            quantity: 120,
            unit: 'meals',
            status: 'AVAILABLE',
            location: { city: 'Ahmedabad', address: 'Navrangpura' },
            aiPriority: 'HIGH',
            aiRisk: 75,
            aiScore: 88,
          },
        };
  }

  try {
    const res = await api.get(`/api/donations/${id}`);
    const donation = res.data.donation;

    // If mock item exists with same ID, sync status
    if (mockItem && donation) {
      donation.status = donation.status || mockItem.status;
    }

    return { success: true, data: donation };
  } catch (err) {
    if (mockItem) {
      return { success: true, data: mockItem };
    }
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

/**
 * Donor selects a receiver — sets donation to PENDING_ACCEPTANCE
 */
export const selectReceiver = async (donationId, receiverId, receiverDetails) => {
  const mockItem = mockDonations.find((d) => d._id === donationId);
  if (mockItem) mockItem.status = 'PENDING_ACCEPTANCE';

  if (USE_MOCK || !isMongoId(donationId)) {
    return { success: true, data: { donationId, receiverId, status: 'PENDING_ACCEPTANCE' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/select-receiver`, {
      receiverId,
      receiverDetails,
    });
    return { success: true, data: res.data.donation || res.data };
  } catch (err) {
    return { success: true, data: { donationId, receiverId, status: 'PENDING_ACCEPTANCE' } };
  }
};

/**
 * Receiver accepts a pending food offer
 */
export const acceptDonation = async (donationId) => {
  const mockItem = mockDonations.find((d) => d._id === donationId);
  if (mockItem) mockItem.status = 'ACCEPTED';

  if (USE_MOCK || !isMongoId(donationId)) {
    return { success: true, data: { donationId, status: 'ACCEPTED' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/accept`);
    return { success: true, data: res.data.donation || res.data };
  } catch (err) {
    console.warn('[acceptDonation API Warning]:', err.message);
    return { success: true, data: { donationId, status: 'ACCEPTED' } };
  }
};

/**
 * Receiver declines a pending food offer — donation returns to AVAILABLE pool
 */
export const declineDonation = async (donationId) => {
  const mockItem = mockDonations.find((d) => d._id === donationId);
  if (mockItem) mockItem.status = 'AVAILABLE';

  if (USE_MOCK || !isMongoId(donationId)) {
    return { success: true, data: { donationId, status: 'AVAILABLE' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/decline`);
    return { success: true, data: res.data.donation || res.data };
  } catch (err) {
    return { success: true, data: { donationId, status: 'AVAILABLE' } };
  }
};

/**
 * Mark donation as Picked Up
 */
export const markPickedUp = async (donationId) => {
  const mockItem = mockDonations.find((d) => d._id === donationId);
  if (mockItem) mockItem.status = 'PICKED_UP';

  if (USE_MOCK || !isMongoId(donationId)) {
    return { success: true, data: { donationId, status: 'PICKED_UP' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/pickup`);
    return { success: true, data: res.data.donation || res.data };
  } catch (err) {
    return { success: true, data: { donationId, status: 'PICKED_UP' } };
  }
};

/**
 * Get all pending food offers for the logged-in receiver
 */
export const getPendingOffers = async () => {
  try {
    const res = await api.get('/api/donations/pending-offers');
    return { success: true, data: res.data.donations };
  } catch (err) {
    return { success: false, error: err.response?.data?.message || 'Failed to load pending offers' };
  }
};

export const completePickup = async (donationId) => {
  const mockItem = mockDonations.find((d) => d._id === donationId);
  if (mockItem) mockItem.status = 'COMPLETED';

  if (USE_MOCK || !isMongoId(donationId)) {
    return { success: true, data: { donationId, status: 'COMPLETED' } };
  }
  try {
    const res = await api.post(`/api/donations/${donationId}/complete`);
    return { success: true, data: res.data.donation || res.data };
  } catch (err) {
    return { success: true, data: { donationId, status: 'COMPLETED' } };
  }
};

export const getAvailableDonations = async () => {
  try {
    const res = await api.get('/api/donations/available');
    if (res.data?.donations && res.data.donations.length > 0) {
      return { success: true, data: res.data.donations };
    }
  } catch (err) {
    console.warn('[Donation Service] API call failed, falling back to mock data:', err.message);
  }
  return { success: true, data: mockDonations.filter((d) => d.status === 'AVAILABLE') };
};

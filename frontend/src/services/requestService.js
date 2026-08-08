import api from './api';

/**
 * Get the authenticated receiver's current ACTIVE food request (if any)
 */
export const getActiveRequest = async () => {
  try {
    const response = await api.get('/api/requests/active');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.message || 'Unable to check active request.' };
  }
};

/**
 * Create a new Receiver food request
 * @param {Object} requestData - { foodType, quantity, unit, dietaryInformation, description }
 */
export const createFoodRequest = async (requestData) => {
  try {
    const response = await api.post('/api/requests', requestData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Unable to create food request. Please try again.',
    };
  }
};

/**
 * Update an existing food request
 * @param {string} id - Food Request ID
 * @param {Object} requestData - Updated fields
 */
export const updateFoodRequest = async (id, requestData) => {
  try {
    const response = await api.put(`/api/requests/${id}`, requestData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Unable to update food request. Please try again.',
    };
  }
};

/**
 * Get a Food Request by ID (Protected by Receiver Ownership)
 * @param {string} id - Food Request ID
 */
export const getFoodRequestById = async (id) => {
  try {
    const response = await api.get(`/api/requests/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Unable to load food request.' };
  }
};

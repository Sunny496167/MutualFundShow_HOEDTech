// src/api/mutualFundApi.js
const API_BASE_URL =  'http://localhost:5000/api';

// Search mutual funds
export const searchMutualFunds = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mutual-funds/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search mutual funds');
    }

    const data = await response.json();
    return data.funds || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Get mutual fund details
export const getMutualFundDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mutual-funds/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get mutual fund details');
    }

    const data = await response.json();
    return data.fund;
  } catch (error) {
    console.error('Get fund details error:', error);
    throw error;
  }
};

// Get saved funds
export const getSavedFunds = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get saved funds');
    }

    const data = await response.json();
    return data.savedFunds || [];
  } catch (error) {
    console.error('Get saved funds error:', error);
    throw error;
  }
};

// Save a fund
export const saveFund = async (fundId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fundId }),
    });

    if (!response.ok) {
      throw new Error('Failed to save fund');
    }

    const data = await response.json();
    return data.savedFund;
  } catch (error) {
    console.error('Save fund error:', error);
    throw error;
  }
};

// Delete saved fund
export const deleteSavedFund = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete saved fund');
    }
  } catch (error) {
    console.error('Delete saved fund error:', error);
    throw error;
  }
};

// Get saved fund by ID
export const getSavedFundById = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get saved fund');
    }

    const data = await response.json();
    return data.savedFund;
  } catch (error) {
    console.error('Get saved fund error:', error);
    throw error;
  }
};
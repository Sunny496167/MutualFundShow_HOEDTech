// src/api/mutualFundApi.js - Fixed API functions with proper template literals
const API_BASE_URL = 'http://localhost:5000/api';

// Search mutual funds - Fixed URL with proper template literals
export const searchMutualFunds = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mutual-funds/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search mutual funds: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data; // Return the array directly
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Get mutual fund details - Fixed response handling
export const getMutualFundDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mutual-funds/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get mutual fund details: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data; // Return the data directly
  } catch (error) {
    console.error('Get fund details error:', error);
    throw error;
  }
};

// Get saved funds - Fixed response handling
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
      const errorText = await response.text();
      throw new Error(`Failed to get saved funds: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.data; // Return data.data based on your backend response
  } catch (error) {
    console.error('Get saved funds error:', error);
    throw error;
  }
};

// Save a fund - Fixed to match backend requirements
export const saveFund = async (fundData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(fundData), // Send full fund data, not just ID
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save fund: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.data; // Return data.data
  } catch (error) {
    console.error('Save fund error:', error);
    throw error;
  }
};

// Delete saved fund - Fixed response handling
export const deleteSavedFund = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/saved-funds/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete saved fund: ${response.status} ${errorText}`);
    }

    return true; // Success
  } catch (error) {
    console.error('Delete saved fund error:', error);
    throw error;
  }
};

// Get saved fund by ID - Fixed response handling
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
      const errorText = await response.text();
      throw new Error(`Failed to get saved fund: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data; // Return the data directly
  } catch (error) {
    console.error('Get saved fund error:', error);
    throw error;
  }
};
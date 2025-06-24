// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchMutualFunds } from '../../api/mutualFundApi';

const initialState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  hasSearched: false,
};

// Async thunk for searching mutual funds
export const searchFunds = createAsyncThunk(
  'search/searchFunds',
  async (query, { rejectWithValue }) => {
    try {
      // Add validation for empty query
      if (!query || query.trim().length === 0) {
        throw new Error('Search query cannot be empty');
      }
      
      const results = await searchMutualFunds(query.trim());
      return results;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search funds');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
      // Clear results when query changes
      if (!action.payload) {
        state.results = [];
        state.hasSearched = false;
      }
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
      state.hasSearched = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add this to clear results without clearing query
    clearResults: (state) => {
      state.results = [];
      state.hasSearched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFunds.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object responses
        state.results = Array.isArray(action.payload) ? action.payload : [];
        state.hasSearched = true;
        state.error = null;
      })
      .addCase(searchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasSearched = true;
        state.results = []; // Clear results on error
      });
  },
});

export const { setQuery, clearSearch, clearError, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
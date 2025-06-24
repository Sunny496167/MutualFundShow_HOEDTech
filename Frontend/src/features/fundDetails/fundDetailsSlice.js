// src/features/fundDetails/fundDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMutualFundDetails, saveFund } from '../../api/mutualFundApi';

const initialState = {
  currentFund: null,
  loading: false,
  error: null,
  saving: false,
  saveError: null,
};

// Async thunk for getting fund details
export const fetchFundDetails = createAsyncThunk(
  'fundDetails/fetchFundDetails',
  async (fundId, { rejectWithValue }) => {
    try {
      const fund = await getMutualFundDetails(fundId);
      return fund;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch fund details');
    }
  }
);

// Async thunk for saving a fund
export const saveFundToWatchlist = createAsyncThunk(
  'fundDetails/saveFund',
  async (fundId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const savedFund = await saveFund(fundId, token);
      return savedFund;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save fund');
    }
  }
);

const fundDetailsSlice = createSlice({
  name: 'fundDetails',
  initialState,
  reducers: {
    clearFundDetails: (state) => {
      state.currentFund = null;
      state.error = null;
      state.saveError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch fund details
      .addCase(fetchFundDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFund = action.payload;
        state.error = null;
      })
      .addCase(fetchFundDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save fund
      .addCase(saveFundToWatchlist.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveFundToWatchlist.fulfilled, (state) => {
        state.saving = false;
        state.saveError = null;
      })
      .addCase(saveFundToWatchlist.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      });
  },
});

export const { clearFundDetails, clearErrors } = fundDetailsSlice.actions;
export default fundDetailsSlice.reducer;
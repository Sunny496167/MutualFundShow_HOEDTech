// src/features/savedFunds/savedFundsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSavedFunds, deleteSavedFund, getSavedFundById } from '../../api/mutualFundApi';

const initialState = {
  savedFunds: [],
  loading: false,
  error: null,
  deleting: null, // ID of fund being deleted
  deleteError: null,
};

// Async thunk for fetching saved funds
export const fetchSavedFunds = createAsyncThunk(
  'savedFunds/fetchSavedFunds',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const savedFunds = await getSavedFunds(token);
      return savedFunds;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch saved funds');
    }
  }
);

// Async thunk for deleting a saved fund
export const removeSavedFund = createAsyncThunk(
  'savedFunds/removeSavedFund',
  async (fundId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      await deleteSavedFund(fundId, token);
      return fundId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete saved fund');
    }
  }
);

// Async thunk for fetching a single saved fund
export const fetchSavedFundById = createAsyncThunk(
  'savedFunds/fetchSavedFundById',
  async (fundId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const savedFund = await getSavedFundById(fundId, token);
      return savedFund;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch saved fund');
    }
  }
);

const savedFundsSlice = createSlice({
  name: 'savedFunds',
  initialState,
  reducers: {
    clearSavedFunds: (state) => {
      state.savedFunds = [];
      state.error = null;
      state.deleteError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch saved funds
      .addCase(fetchSavedFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.savedFunds = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete saved fund
      .addCase(removeSavedFund.pending, (state, action) => {
        state.deleting = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(removeSavedFund.fulfilled, (state, action) => {
        state.deleting = null;
        state.savedFunds = state.savedFunds.filter(fund => fund.id !== action.payload);
        state.deleteError = null;
      })
      .addCase(removeSavedFund.rejected, (state, action) => {
        state.deleting = null;
        state.deleteError = action.payload;
      })
      // Fetch single saved fund
      .addCase(fetchSavedFundById.fulfilled, (state, action) => {
        const existingIndex = state.savedFunds.findIndex(fund => fund.id === action.payload.id);
        if (existingIndex >= 0) {
          state.savedFunds[existingIndex] = action.payload;
        } else {
          state.savedFunds.push(action.payload);
        }
      });
  },
});

export const { clearSavedFunds, clearErrors } = savedFundsSlice.actions;
export default savedFundsSlice.reducer;
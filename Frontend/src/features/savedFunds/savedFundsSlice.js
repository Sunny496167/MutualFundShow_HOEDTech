// src/features/savedFunds/savedFundsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSavedFunds, deleteSavedFund, getSavedFundById, saveFund } from '../../api/mutualFundApi';

const initialState = {
  savedFunds: [],
  loading: false,
  error: null,
  deleting: null,
  deleteError: null,
  saving: false,
  saveError: null,
};

// Enhanced async thunk for fetching saved funds
export const fetchSavedFunds = createAsyncThunk(
  'savedFunds/fetchSavedFunds',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      console.log('fetchSavedFunds - token check:', { 
        reduxToken: !!state.auth.token, 
        localStorageToken: !!localStorage.getItem('token'),
        isAuthenticated: state.auth.isAuthenticated 
      });
      
      if (!token) {
        throw new Error('Authentication required - no token found');
      }
      
      const savedFunds = await getSavedFunds(token);
      return savedFunds;
    } catch (error) {
      console.error('fetchSavedFunds error:', error);
      return rejectWithValue(error.message || 'Failed to fetch saved funds');
    }
  }
);

// Enhanced async thunk for deleting a saved fund
export const removeSavedFund = createAsyncThunk(
  'savedFunds/removeSavedFund',
  async (fundId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required - no token found');
      }
      
      await deleteSavedFund(fundId, token);
      return fundId;
    } catch (error) {
      console.error('removeSavedFund error:', error);
      return rejectWithValue(error.message || 'Failed to delete saved fund');
    }
  }
);

// Enhanced async thunk for fetching a single saved fund
export const fetchSavedFundById = createAsyncThunk(
  'savedFunds/fetchSavedFundById',
  async (fundId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required - no token found');
      }
      
      const savedFund = await getSavedFundById(fundId, token);
      return savedFund;
    } catch (error) {
      console.error('fetchSavedFundById error:', error);
      return rejectWithValue(error.message || 'Failed to fetch saved fund');
    }
  }
);

// Enhanced async thunk for saving fund
export const saveFundToWatchlist = createAsyncThunk(
  'savedFunds/saveFund',
  async (fundData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required - no token found');
      }
      
      // Prepare fund data according to your backend schema
      const fundToSave = {
        schemeName: fundData.schemeName || fundData.scheme_name,
        schemeCode: fundData.schemeCode || fundData.scheme_code,
        fundType: fundData.fundType || 'OTHER',
        category: fundData.category || fundData.scheme_category || 'Unknown',
        amc: fundData.amc || fundData.fund_house || 'Unknown',
        notes: fundData.notes || ''
      };
      
      const savedFund = await saveFund(fundToSave, token);
      return savedFund;
    } catch (error) {
      console.error('saveFundToWatchlist error:', error);
      return rejectWithValue(error.message || 'Failed to save fund');
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
      state.saveError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.deleteError = null;
      state.saveError = null;
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
        console.error('fetchSavedFunds rejected:', action.payload);
      })
      
      // Delete saved fund
      .addCase(removeSavedFund.pending, (state, action) => {
        state.deleting = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(removeSavedFund.fulfilled, (state, action) => {
        state.deleting = null;
        // Filter using _id (MongoDB document ID)
        state.savedFunds = state.savedFunds.filter(fund => fund._id !== action.payload);
        state.deleteError = null;
      })
      .addCase(removeSavedFund.rejected, (state, action) => {
        state.deleting = null;
        state.deleteError = action.payload;
      })
      
      // Save fund to watchlist
      .addCase(saveFundToWatchlist.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveFundToWatchlist.fulfilled, (state, action) => {
        state.saving = false;
        // Add the new saved fund to the list
        state.savedFunds.push(action.payload);
        state.saveError = null;
      })
      .addCase(saveFundToWatchlist.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      })
      
      // Fetch single saved fund
      .addCase(fetchSavedFundById.fulfilled, (state, action) => {
        const existingIndex = state.savedFunds.findIndex(fund => fund._id === action.payload._id);
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
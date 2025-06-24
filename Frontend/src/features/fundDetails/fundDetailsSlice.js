// src/features/fundDetails/fundDetailsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMutualFundDetails, saveFund } from '../../api/mutualFundApi';

const initialState = {
  currentFund: null,
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  saveSuccess: false,
};

// Async thunk for fetching fund details
export const fetchFundDetails = createAsyncThunk(
  'fundDetails/fetchFundDetails',
  async (fundId, { rejectWithValue }) => {
    try {
      if (!fundId) {
        throw new Error('Fund ID is required');
      }

      const fund = await getMutualFundDetails(fundId);
      
      if (!fund) {
        throw new Error('Fund not found');
      }

      return fund;
    } catch (error) {
      console.error('Error fetching fund details:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch fund details. Please try again.'
      );
    }
  }
);

// Async thunk for saving fund to watchlist
export const saveFundToWatchlist = createAsyncThunk(
  'fundDetails/saveFundToWatchlist',
  async (fundData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Please login to save funds to watchlist');
      }

      if (!fundData) {
        throw new Error('Fund data is required');
      }

      // Prepare fund data according to backend schema
      // Adjust these mappings based on your actual fund data structure
      const fundToSave = {
        // Primary identifiers
        schemeName: fundData.name || fundData.schemeName || 'Unknown Fund',
        schemeCode: fundData.id || fundData.schemeCode || fundData.code,
        
        // Fund details
        fundType: mapFundType(fundData.category) || 'OTHER',
        category: fundData.category || fundData.scheme_category || 'Other',
        amc: fundData.amc || fundData.fundHouse || fundData.fund_house || 'Unknown',
        
        // Financial data
        nav: fundData.nav || null,
        aum: fundData.aum || null,
        expenseRatio: fundData.expenseRatio || null,
        
        // Performance data
        returns1Y: fundData.returns1Y || null,
        returns3Y: fundData.returns3Y || null,
        returns5Y: fundData.returns5Y || null,
        
        // Additional info
        riskLevel: fundData.riskLevel || null,
        fundManager: fundData.fundManager || null,
        launchDate: fundData.launchDate || null,
        
        // User notes
        notes: fundData.notes || ''
      };

      console.log('Saving fund to watchlist:', fundToSave);
      
      const savedFund = await saveFund(fundToSave, token);
      return savedFund;
    } catch (error) {
      console.error('Error saving fund to watchlist:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to save fund to watchlist. Please try again.'
      );
    }
  }
);

// Helper function to map fund categories to fund types
function mapFundType(category) {
  if (!category) return 'OTHER';
  
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('equity') || categoryLower.includes('stock')) {
    return 'EQUITY';
  } else if (categoryLower.includes('debt') || categoryLower.includes('bond')) {
    return 'DEBT';
  } else if (categoryLower.includes('hybrid') || categoryLower.includes('balanced')) {
    return 'HYBRID';
  } else if (categoryLower.includes('money market') || categoryLower.includes('liquid')) {
    return 'MONEY_MARKET';
  } else if (categoryLower.includes('index')) {
    return 'INDEX';
  } else if (categoryLower.includes('etf')) {
    return 'ETF';
  } else if (categoryLower.includes('elss') || categoryLower.includes('tax')) {
    return 'ELSS';
  } else if (categoryLower.includes('international') || categoryLower.includes('global')) {
    return 'INTERNATIONAL';
  } else if (categoryLower.includes('sectoral') || categoryLower.includes('thematic')) {
    return 'SECTORAL';
  }
  
  return 'OTHER';
}

const fundDetailsSlice = createSlice({
  name: 'fundDetails',
  initialState,
  reducers: {
    // Clear fund details
    clearFundDetails: (state) => {
      state.currentFund = null;
      state.error = null;
      state.saveError = null;
      state.saveSuccess = false;
    },
    
    // Clear all errors
    clearErrors: (state) => {
      state.error = null;
      state.saveError = null;
      state.saveSuccess = false;
    },
    
    // Clear only save states
    clearSaveStates: (state) => {
      state.saving = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
    
    // Reset entire state
    resetFundDetailsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch fund details cases
      .addCase(fetchFundDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentFund = null;
      })
      .addCase(fetchFundDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFund = action.payload;
        state.error = null;
      })
      .addCase(fetchFundDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentFund = null;
      })
      
      // Save fund to watchlist cases
      .addCase(saveFundToWatchlist.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(saveFundToWatchlist.fulfilled, (state, action) => {
        state.saving = false;
        state.saveError = null;
        state.saveSuccess = true;
        // Optionally update currentFund with saved data
        if (action.payload && state.currentFund) {
          state.currentFund = { ...state.currentFund, ...action.payload };
        }
      })
      .addCase(saveFundToWatchlist.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
        state.saveSuccess = false;
      });
  },
});

// Export actions
export const { 
  clearFundDetails, 
  clearErrors, 
  clearSaveStates, 
  resetFundDetailsState 
} = fundDetailsSlice.actions;

// Export selectors
export const selectCurrentFund = (state) => state.fundDetails.currentFund;
export const selectFundDetailsLoading = (state) => state.fundDetails.loading;
export const selectFundDetailsError = (state) => state.fundDetails.error;
export const selectSavingFund = (state) => state.fundDetails.saving;
export const selectSaveError = (state) => state.fundDetails.saveError;
export const selectSaveSuccess = (state) => state.fundDetails.saveSuccess;

// Export reducer
export default fundDetailsSlice.reducer;
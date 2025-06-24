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
      const results = await searchMutualFunds(query);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.hasSearched = true;
        state.error = null;
      })
      .addCase(searchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasSearched = true;
      });
  },
});

export const { setQuery, clearSearch, clearError } = searchSlice.actions;
export default searchSlice.reducer;
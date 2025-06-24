// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';
import fundDetailsReducer from '../features/fundDetails/fundDetailsSlice';
import savedFundsReducer from '../features/savedFunds/savedFundsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    fundDetails: fundDetailsReducer,
    savedFunds: savedFundsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
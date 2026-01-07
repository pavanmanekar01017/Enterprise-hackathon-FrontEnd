// ============================================
// Redux Store Configuration
// Centralized state management with RTK
// ============================================

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import ticketsReducer from './slices/ticketsSlice';

// Combine all reducers
const rootReducer = combineReducers({
  // RTK Query API reducer
  [apiSlice.reducerPath]: apiSlice.reducer,
  // Feature slices
  auth: authReducer,
  ui: uiReducer,
  tickets: ticketsReducer,
});

// Configure store with middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});

// Setup listeners for RTK Query (refetch on focus, reconnect)
setupListeners(store.dispatch);

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

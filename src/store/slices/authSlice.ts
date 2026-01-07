// ============================================
// Authentication State Slice
// Manages user session and token state
// ============================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthResponse, User } from '../../types';
import { AUTH_CONFIG } from '../../config/constants';

// Helper to load state from localStorage
const loadAuthState = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem('itsd_user');
    const expiresAt = localStorage.getItem('itsd_token_expires');
    
    if (token && userStr) {
      const user = JSON.parse(userStr) as User;
      const tokenExpiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
      
      // Check if token is expired
      if (tokenExpiresAt && Date.now() > tokenExpiresAt) {
        // Token expired, clear storage
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
        localStorage.removeItem('itsd_user');
        localStorage.removeItem('itsd_token_expires');
        return {};
      }
      
      return {
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        tokenExpiresAt,
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
  }
  return {};
};

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokenExpiresAt: null,
  ...loadAuthState(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { user, token, refreshToken, expiresIn } = action.payload;
      const tokenExpiresAt = Date.now() + expiresIn * 1000;
      
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.tokenExpiresAt = tokenExpiresAt;
      
      // Persist to localStorage
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem('itsd_user', JSON.stringify(user));
      localStorage.setItem('itsd_token_expires', tokenExpiresAt.toString());
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.tokenExpiresAt = null;
      
      // Clear localStorage
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem('itsd_user');
      localStorage.removeItem('itsd_token_expires');
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('itsd_user', JSON.stringify(state.user));
      }
    },
    
    refreshTokenSuccess: (state, action: PayloadAction<{ token: string; expiresIn: number }>) => {
      const { token, expiresIn } = action.payload;
      const tokenExpiresAt = Date.now() + expiresIn * 1000;
      
      state.token = token;
      state.tokenExpiresAt = tokenExpiresAt;
      
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      localStorage.setItem('itsd_token_expires', tokenExpiresAt.toString());
    },
  },
});

// Export actions
export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  updateUser,
  refreshTokenSuccess,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;

export default authSlice.reducer;

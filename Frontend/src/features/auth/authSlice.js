import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";

const initialState = {
    user: null,
    isAuthenticated: authApi.isAuthenticated(),
    isLoading: false,
    error: null,
    registrationSuccess: false,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authApi.getUserProfile();
            return user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authApi.requestPasswordReset(email);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await authApi.resetPassword(data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token, { rejectWithValue }) => {
        try {
            const response = await authApi.verifyEmail(token);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegistrationSuccess: (state) => {
            state.registrationSuccess = false;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
            if (!action.payload) {
                state.user = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
        // login
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user || null;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // register
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.registrationSuccess = false;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.registrationSuccess = true;
            state.error = null;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.registrationSuccess = false;
        })
        // logout
        .addCase(logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
        })
        // fetchUserProfile
        .addCase(fetchUserProfile.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        // requestPasswordReset
        .addCase(requestPasswordReset.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(requestPasswordReset.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(requestPasswordReset.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // resetPassword
        .addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        // verifyEmail
        .addCase(verifyEmail.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
        })
        .addCase(verifyEmail.rejected, (state, action) => { 
            state.isLoading = false;
            state.error = action.payload;
        })
    },
});

export const { clearError, clearRegistrationSuccess, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
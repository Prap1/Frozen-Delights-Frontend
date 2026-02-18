import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/* ===================== LOGIN ===================== */
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/auth/login',
                { email, password },
                { withCredentials: true }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== REGISTER INITIATE ===================== */
export const registerInitiate = createAsyncThunk(
    'auth/registerInitiate',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register-initiate', {
                username,
                email,
                password,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== REGISTER VERIFY (AUTO LOGIN) ===================== */
export const registerVerify = createAsyncThunk(
    'auth/registerVerify',
    async ({ username, email, otp }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                '/auth/register-verify',
                { username, email, otp },
                { withCredentials: true }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== CHECK AUTH (ON REFRESH) ===================== */
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me', {
                withCredentials: true,
            });
            return response.data.user;
        } catch (err) {
            return rejectWithValue(null);
        }
    }
);

/* ===================== LOGOUT ===================== */
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout', {}, { withCredentials: true });
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== FORGOT PASSWORD ===================== */
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== RESET PASSWORD ===================== */
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/reset-password', {
                email,
                otp,
                newPassword,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== UPDATE PASSWORD ===================== */
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/update-password', passwordData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== UPDATE PROFILE ===================== */
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/profile/update', userData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ===================== INITIAL STATE ===================== */
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

/* ===================== SLICE ===================== */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- LOGIN ---------- */
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })

            /* ---------- REGISTER INITIATE ---------- */
            .addCase(registerInitiate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerInitiate.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerInitiate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration initiation failed';
            })

            /* ---------- REGISTER VERIFY (AUTO LOGIN) ---------- */
            .addCase(registerVerify.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerVerify.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(registerVerify.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || 'Registration verification failed';
            })

            /* ---------- CHECK AUTH ---------- */
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            /* ---------- LOGOUT ---------- */
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })

            /* ---------- FORGOT PASSWORD ---------- */
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Forgot password failed';
            })

            /* ---------- RESET PASSWORD ---------- */
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Reset password failed';
            })

            /* ---------- UPDATE PROFILE ---------- */
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload.user };
                state.isAuthenticated = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Profile update failed';
            })

            /* ---------- UPDATE PASSWORD ---------- */
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Password update failed';
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

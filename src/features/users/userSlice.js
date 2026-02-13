import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Users (Admin)
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/users'); // Assuming /api/users returns all users
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Delete User (Admin)
export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/users/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Update User Role (Admin)
export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/users/${id}`, { role });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearUserMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.message = "User deleted successfully";
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user._id === action.payload.user._id);
                if (index !== -1) {
                    state.users[index] = action.payload.user;
                }
                state.message = "User updated successfully";
            });
    },
});

export const { clearUserMessage } = userSlice.actions;
export default userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/orders/admin/all');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Delete Order (Admin)
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/orders/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Update Order Status (Admin)
export const updateOrder = createAsyncThunk(
    'orders/update',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/orders/admin/${id}`, { status });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        totalAmount: 0,
        loading: false,
        updateLoading: false,
        isUpdated: false,
        error: null,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        resetUpdateStatus: (state) => {
            state.isUpdated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload);
            })
            .addCase(updateOrder.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.isUpdated = true;
                const index = state.orders.findIndex(order => order._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearErrors, resetUpdateStatus } = orderSlice.actions;
export default orderSlice.reducer;

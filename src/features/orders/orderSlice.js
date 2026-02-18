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

// Fetch Vendor Orders
export const fetchVendorOrders = createAsyncThunk(
    'orders/fetchVendorOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/orders/vendor/orders');
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

// Request Return
export const requestReturn = createAsyncThunk(
    'orders/requestReturn',
    async ({ id, returnData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const response = await api.post(`/orders/${id}/return`, returnData, config);
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
        vendorOrders: [], // Added for vendor dashboard
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
            // Fetch All Orders
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

            // Fetch Vendor Orders
            .addCase(fetchVendorOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVendorOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.vendorOrders = action.payload.orders;
            })
            .addCase(fetchVendorOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Order
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload);
                state.vendorOrders = state.vendorOrders.filter((order) => order._id !== action.payload);
            })

            // Update Order
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
                const vendorIndex = state.vendorOrders.findIndex(order => order._id === action.payload.order._id);
                if (vendorIndex !== -1) {
                    state.vendorOrders[vendorIndex] = action.payload.order;
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

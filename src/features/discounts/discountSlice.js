import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Discounts (Admin)
export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/discounts');
            return response.data.discounts;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch discounts');
        }
    }
);

// Fetch Vendor Discounts
export const fetchVendorDiscounts = createAsyncThunk(
    'discounts/fetchVendorDiscounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/discounts/vendor');
            return response.data.discounts;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch discounts');
        }
    }
);

// Create Discount
export const createDiscount = createAsyncThunk(
    'discounts/create',
    async (discountData, { rejectWithValue }) => {
        try {
            const response = await api.post('/discounts', discountData);
            return response.data.discount;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create discount');
        }
    }
);

// Update Discount
export const updateDiscount = createAsyncThunk(
    'discounts/update',
    async ({ id, discountData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/discounts/${id}`, discountData);
            return response.data.discount;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update discount');
        }
    }
);

// Delete Discount
export const deleteDiscount = createAsyncThunk(
    'discounts/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/discounts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete discount');
        }
    }
);

const discountSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        loading: false,
        error: null,
        message: null,
        success: false
    },
    reducers: {
        clearDiscountMessage: (state) => {
            state.message = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchDiscounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = action.payload;
            })
            .addCase(fetchDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Vendor
            .addCase(fetchVendorDiscounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVendorDiscounts.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = action.payload;
            })
            .addCase(fetchVendorDiscounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts.push(action.payload);
                state.success = true;
                state.message = 'Discount created successfully';
            })
            .addCase(createDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Discount updated successfully';
                state.discounts = state.discounts.map(d =>
                    d._id === action.payload._id ? action.payload : d
                );
            })
            .addCase(updateDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteDiscount.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = state.discounts.filter(d => d._id !== action.payload);
                state.success = true;
                state.message = 'Discount deleted successfully';
            })
            .addCase(deleteDiscount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearDiscountMessage } = discountSlice.actions;
export default discountSlice.reducer;

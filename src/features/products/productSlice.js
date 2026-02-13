import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Products
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Create Product (Admin)
export const createProduct = createAsyncThunk(
    'products/create',
    async (productData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await api.post('/products/new', productData, config);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Delete Product (Admin)
export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        product: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.items.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;

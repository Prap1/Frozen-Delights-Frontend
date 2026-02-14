import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Products
export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async ({ keyword = '', currentPage = 1, price = [0, 100000], category, ratings = 0 } = {}, { rejectWithValue }) => {
        try {
            let link = `/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;

            if (ratings > 0) {
                link += `&ratings[gte]=${ratings}`;
            }

            if (category) {
                link += `&category=${category}`;
            }

            const response = await api.get(link);
            return response.data;
        } catch (err) {
            console.error("Fetch Products Error:", err.response?.data);
            return rejectWithValue(err.response?.data);
        }
    }
);

// Fetch All Products (Admin)
export const fetchAdminProducts = createAsyncThunk(
    'products/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/products/admin');
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

// Fetch Product Details
export const fetchProductDetails = createAsyncThunk(
    'products/fetchDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`);
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
            // let axios/api instance handle the content-type (multipart if FormData, json otherwise)
            const response = await api.post('/products/new', productData);
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
        productsCount: 0,
        resultPerPage: 0,
        filteredProductsCount: 0,
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
                state.items = [];
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
                state.productsCount = action.payload.productsCount;
                state.resultPerPage = action.payload.resultPerPage;
                state.filteredProductsCount = action.payload.filteredProductsCount;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
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
            })
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.items = [];
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;

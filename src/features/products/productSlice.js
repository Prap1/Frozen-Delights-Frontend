import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Products (Public)
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
            return response.data; // Note: Ensure backend returns { product: ... } or check if slice expects just product
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
                headers: { 'Content-Type': 'multipart/form-data' }, // Often needed for file uploads in product creation
                withCredentials: true
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

// Create Review (User)
export const createReview = createAsyncThunk(
    'products/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };
            const response = await api.post(`/reviews`, reviewData, config);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],           // List of products (public or admin)
        productsCount: 0,
        resultPerPage: 0,
        filteredProductsCount: 0,
        product: null,       // Single product details
        loading: false,
        error: null,
        success: false,      // For Create/Delete/Review actions
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        resetProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        resetReviewSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products (Public)
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

            // Fetch Products (Admin)
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
            })

            // Fetch Details
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product; // Ensure payload structure matches
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Product
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

            // Delete Product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                // success is tricky here as it might trigger create success? Assume handled by component.
                state.items = state.items.filter((item) => item._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Review
            .addCase(createReview.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearErrors, resetProductState, resetReviewSuccess } = productSlice.actions;
export default productSlice.reducer;

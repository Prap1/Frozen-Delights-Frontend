import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Categories
export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories');
            return response.data.categories;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

// Create Category
export const createCategory = createAsyncThunk(
    'categories/create',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await api.post('/categories', categoryData);
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create category');
        }
    }
);

// Update Category
export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, categoryData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/categories/${id}`, categoryData);
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update category');
        }
    }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/categories/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        message: null,
        success: false
    },
    reducers: {
        clearCategoryMessage: (state) => {
            state.message = null;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
                state.success = true;
                state.message = 'Category created successfully';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.success = true;
                state.message = 'Category updated successfully';
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(c => c._id !== action.payload);
                state.success = true;
                state.message = 'Category deleted successfully';
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCategoryMessage } = categorySlice.actions;
export default categorySlice.reducer;

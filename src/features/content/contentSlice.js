import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// --- BANNERS ---

export const fetchBanners = createAsyncThunk(
    'content/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/content/banners');
            return response.data.banners;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch banners');
        }
    }
);

export const fetchAllBanners = createAsyncThunk(
    'content/fetchAllBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/content/admin/banners');
            return response.data.banners;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch banners');
        }
    }
);

export const createBanner = createAsyncThunk(
    'content/createBanner',
    async (bannerData, { rejectWithValue }) => {
        try {
            const response = await api.post('/content/admin/banners', bannerData);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create banner');
        }
    }
);

export const updateBanner = createAsyncThunk(
    'content/updateBanner',
    async ({ id, bannerData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/content/admin/banners/${id}`, bannerData);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update banner');
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'content/deleteBanner',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/content/admin/banners/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete banner');
        }
    }
);

// --- CONTENT ---

export const fetchContent = createAsyncThunk(
    'content/fetchContent',
    async (type, { rejectWithValue }) => {
        try {
            const query = type ? `?type=${type}` : '';
            const response = await api.get(`/content/items${query}`);
            return response.data.content;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch content');
        }
    }
);

export const fetchAllContent = createAsyncThunk(
    'content/fetchAllContent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/content/admin/items');
            return response.data.content;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch content');
        }
    }
);

export const createContent = createAsyncThunk(
    'content/createContent',
    async (contentData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            const response = await api.post('/content/admin/items', contentData, config);
            return response.data.content;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create content');
        }
    }
);

export const updateContent = createAsyncThunk(
    'content/updateContent',
    async ({ id, contentData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            const response = await api.put(`/content/admin/items/${id}`, contentData, config);
            return response.data.content;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update content');
        }
    }
);

export const deleteContent = createAsyncThunk(
    'content/deleteContent',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/content/admin/items/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete content');
        }
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        banners: [],
        contentItems: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetContentState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Banners
            .addCase(fetchBanners.pending, (state) => { state.loading = true; })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllBanners.pending, (state) => { state.loading = true; })
            .addCase(fetchAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            // Create/Update/Delete Banner
            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.banners.push(action.payload);
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.banners.findIndex(b => b._id === action.payload._id);
                if (index !== -1) state.banners[index] = action.payload;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.banners = state.banners.filter(b => b._id !== action.payload);
            })

            // Content
            .addCase(fetchContent.pending, (state) => { state.loading = true; })
            .addCase(fetchContent.fulfilled, (state, action) => {
                state.loading = false;
                state.contentItems = action.payload;
            })
            .addCase(fetchAllContent.pending, (state) => { state.loading = true; })
            .addCase(fetchAllContent.fulfilled, (state, action) => {
                state.loading = false;
                state.contentItems = action.payload;
            })
            // Create/Update/Delete Content
            .addCase(createContent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.contentItems.push(action.payload);
            })
            .addCase(updateContent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const index = state.contentItems.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.contentItems[index] = action.payload;
            })
            .addCase(deleteContent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.contentItems = state.contentItems.filter(c => c._id !== action.payload);
            });
    }
});

export const { resetContentState } = contentSlice.actions;
export default contentSlice.reducer;

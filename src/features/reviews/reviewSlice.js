import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch All Reviews (Admin)
export const fetchAllReviews = createAsyncThunk(
    'reviews/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/reviews/admin/all');
            return response.data.reviews;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

// Delete Review (Admin)
export const deleteReview = createAsyncThunk(
    'reviews/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetReviewState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchAllReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews = state.reviews.filter((review) => review._id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;

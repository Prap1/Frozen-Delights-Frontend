import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    compareItems: localStorage.getItem('compareItems')
        ? JSON.parse(localStorage.getItem('compareItems'))
        : [],
};

const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {
        addToCompare: (state, action) => {
            const item = action.payload;
            const isItemExist = state.compareItems.find((i) => i._id === item._id);

            if (isItemExist) {
                return;
            }

            if (state.compareItems.length >= 4) {
                alert("You can compare up to 4 products only!");
                return;
            }

            state.compareItems.push(item);
            localStorage.setItem('compareItems', JSON.stringify(state.compareItems));
        },
        removeFromCompare: (state, action) => {
            state.compareItems = state.compareItems.filter((i) => i._id !== action.payload);
            localStorage.setItem('compareItems', JSON.stringify(state.compareItems));
        },
    },
});

export const { addToCompare, removeFromCompare } = compareSlice.actions;
export default compareSlice.reducer;

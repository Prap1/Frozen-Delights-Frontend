import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    shippingInfo: localStorage.getItem('shippingInfo')
        ? JSON.parse(localStorage.getItem('shippingInfo'))
        : {},
    discount: sessionStorage.getItem('discount')
        ? JSON.parse(sessionStorage.getItem('discount'))
        : null,
    paymentMethod: 'Card', // Default to Card
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );

            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                );
            } else {
                state.cartItems.push(item);
            }

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (i) => i.product !== action.payload
            );

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cartItems');
        },
        applyDiscount: (state, action) => {
            state.discount = action.payload;
            sessionStorage.setItem('discount', JSON.stringify(state.discount));
        },
        removeDiscount: (state) => {
            state.discount = null;
            sessionStorage.removeItem('discount');
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingInfo,
    savePaymentMethod,
    clearCart,
    applyDiscount,
    removeDiscount
} = cartSlice.actions;

export default cartSlice.reducer;

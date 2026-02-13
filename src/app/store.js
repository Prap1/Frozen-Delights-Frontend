import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// import cartReducer from '../features/cart/cartSlice'; // We might need to refactor Cart too, or keep it in Context for now? User specifically asked for Auth/Navbar.
// Let's create authSlice first.

import productsReducer from '../features/products/productSlice';
import ordersReducer from '../features/orders/orderSlice';
import usersReducer from '../features/users/userSlice';
import categoriesReducer from '../features/categories/categorySlice';
import discountsReducer from '../features/discounts/discountSlice';
import reviewsReducer from '../features/reviews/reviewSlice';
import contentReducer from '../features/content/contentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        orders: ordersReducer,
        users: usersReducer,
        categories: categoriesReducer,
        discounts: discountsReducer,
        reviews: reviewsReducer,
        content: contentReducer,
    },
});

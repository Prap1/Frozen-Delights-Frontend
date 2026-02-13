import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(
        localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    );
    const [shippingInfo, setShippingInfo] = useState(
        localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    );

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }, [shippingInfo]);

    const addItemToCart = (item) => {
        const isItemExist = cartItems.find((i) => i.product === item.product);

        if (isItemExist) {
            setCartItems(
                cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                )
            );
        } else {
            setCartItems([...cartItems, item]);
        }
    };

    const removeItemFromCart = (id) => {
        setCartItems(cartItems.filter((i) => i.product !== id));
    };

    const saveShippingInfo = (data) => {
        setShippingInfo(data);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, shippingInfo, addItemToCart, removeItemFromCart, saveShippingInfo, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, applyDiscount } from '../../features/cart/cartSlice';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const [couponCode, setCouponCode] = useState('');

    const increaseQuantity = (item) => {
        if (item.Stock <= item.quantity) return;
        const newQty = item.quantity + 1;
        dispatch(addToCart({ ...item, quantity: newQty }));
    };

    const decreaseQuantity = (item) => {
        if (1 >= item.quantity) return;
        const newQty = item.quantity - 1;
        dispatch(addToCart({ ...item, quantity: newQty }));
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping');
    };

    const total = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const applyCoupon = async () => {
        try {
            const { data } = await api.post('/discounts/validate', {
                code: couponCode,
                cartTotal: total
            });

            if (data.success) {
                dispatch(applyDiscount(data.discount));
                toast.success(`Coupon ${data.discount.code} applied! Saved ₹${data.discount.amount}`);
            }
        } catch (error) {
            dispatch(applyDiscount(null));
            toast.error(error.response?.data?.message || 'Invalid Coupon Code');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
                <Link to="/products" className="mt-4 text-blue-600 hover:text-blue-500">View Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li key={item.product} className="px-4 py-4 sm:px-6 flex items-center">
                                <div className="flex-shrink-0 h-16 w-16">
                                    <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                                </div>
                                <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <div>
                                        <Link to={`/product/${item.product}`} className="text-lg font-medium text-blue-600 hover:text-blue-500">{item.name}</Link>
                                        <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                                        {item.Stock < 1 && <p className="text-red-500 font-bold text-sm mt-1">Out of Stock</p>}
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex items-center">
                                        <button onClick={() => decreaseQuantity(item)} className="px-2 py-1 bg-gray-200 rounded-md">-</button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item)} className="px-2 py-1 bg-gray-200 rounded-md">+</button>
                                        <button onClick={() => removeFromCartHandler(item.product)} className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex w-full sm:w-auto gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
                                />
                                <button
                                    onClick={applyCoupon}
                                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                >
                                    Apply
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <div className="text-lg font-medium text-gray-900">
                                    Total: <span className="text-blue-600">₹{total}</span>
                                </div>
                                <button onClick={checkoutHandler} className="w-full sm:w-auto bg-blue-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

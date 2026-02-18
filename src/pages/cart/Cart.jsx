import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, applyDiscount, removeDiscount } from '../../features/cart/cartSlice';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, discount } = useSelector((state) => state.cart);
    const [couponCode, setCouponCode] = useState('');

    // Check for out of stock items
    const hasOutOfStockItems = cartItems.some(item => item.stock < 1 || item.quantity > item.stock);

    const increaseQuantity = (item) => {
        if (item.stock <= item.quantity) return;
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
        if (hasOutOfStockItems) {
            toast.error('Please remove out of stock items or adjust quantities to proceed');
            return;
        }
        navigate('/login?redirect=shipping');
    };

    // Calculate Totals
    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    // Assuming tax is included or 0 for now as per previous logic, but to match design we can show 0
    const tax = 0;
    const discountAmount = discount ? discount.amount : 0;
    const finalTotal = subtotal + tax - discountAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        try {
            const { data } = await api.post('/discounts/validate', {
                code: couponCode,
                cartTotal: subtotal,
                cartItems
            });

            if (data.success) {
                dispatch(applyDiscount(data.discount));
                toast.success(`Coupon ${data.discount.code} applied! Saved ₹${data.discount.amount}`);
                setCouponCode('');
            }
        } catch (error) {
            dispatch(applyDiscount(null));
            toast.error(error.response?.data?.message || 'Invalid Coupon Code');
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeDiscount());
        toast.info('Coupon removed');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-['Poppins']">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any treats yet.</p>
                    <Link to="/products" className="px-8 py-3 bg-[#E65555] text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-all hover:shadow-xl hover:-translate-y-1">
                        View Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                </h1>

                {/* Table Header (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Cart Items */}
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.product} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-6 last:border-0 relative">
                            {/* Item Details */}
                            <div className="md:col-span-6 flex items-center">
                                <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
                                </div>
                                <div className="ml-6">
                                    <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-[#E65555] transition-colors">
                                        {item.name}
                                    </Link>
                                    <div className="mt-1">
                                        {item.stock < 1 ? (
                                            <span className="text-red-600 font-bold text-sm">Out of Stock</span>
                                        ) : item.quantity > item.stock ? (
                                            <span className="text-red-600 font-bold text-sm">Insufficient Stock (Only {item.stock} left)</span>
                                        ) : (
                                            <span className="text-[#E65555] font-medium text-sm">
                                                {item.stock < 5 ? `Only ${item.stock} left!` : 'In Stock'}
                                            </span>
                                        )}
                                    </div>
                                    {/* Mobile Only: Price & Total */}
                                    <div className="md:hidden mt-2 text-sm text-gray-500">
                                        <span className="font-semibold text-gray-900">₹{item.price}</span> x {item.quantity}
                                    </div>
                                </div>
                            </div>

                            {/* Price (Desktop) */}
                            <div className="hidden md:block md:col-span-2 text-center text-gray-700 font-medium">
                                ₹{item.price}
                            </div>

                            {/* Quantity */}
                            <div className="md:col-span-2 flex justify-center">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => decreaseQuantity(item)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        <FaMinus className="w-3 h-3" />
                                    </button>
                                    <span className="px-4 py-1.5 font-semibold text-gray-900 min-w-[3rem] text-center border-x border-gray-300">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increaseQuantity(item)}
                                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
                                        disabled={item.stock <= item.quantity}
                                    >
                                        <FaPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Total & Remove */}
                            <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                                <span className="text-lg font-bold text-gray-900">
                                    ₹{item.price * item.quantity}
                                </span>
                                <button
                                    onClick={() => removeFromCartHandler(item.product)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                    title="Remove Item"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section */}
                <div className="mt-12 flex flex-col md:flex-row justify-end border-t border-gray-200 pt-8">
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Sales Tax:</span>
                            <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
                        </div>

                        {discount && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <span>Discount ({discount.code}):</span>
                                    <button onClick={handleRemoveCoupon} className="text-xs text-red-500 hover:underline">Remove</button>
                                </div>
                                <span>-₹{discount.amount}</span>
                            </div>
                        )}

                        {/* Coupon Input */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            {!discount && (
                                <>
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Coupon Code"
                                        className="flex-1 appearance-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:border-transparent text-sm"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="text-sm border-b border-gray-600 hover:border-black text-gray-600 hover:text-black transition-colors"
                                    >
                                        Add Coupon
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                            <span>Grand total:</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>

                        {finalTotal >= 500 && (
                            <div className="text-right text-xs text-green-600 font-medium  mt-1">
                                Congrats, you're eligible for Free Shipping <span className="text-gray-900">🚚</span>
                            </div>
                        )}

                        {hasOutOfStockItems && (
                            <div className="text-right text-sm text-red-600 font-bold mt-2">
                                Warning: Your cart contains items that are out of stock or exceed available quantity.
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                onClick={checkoutHandler}
                                disabled={hasOutOfStockItems}
                                className={`w-full py-4 font-bold text-lg rounded-none transition-all shadow-lg uppercase tracking-wider ${hasOutOfStockItems
                                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                        : 'bg-black text-white hover:bg-gray-900'
                                    }`}
                            >
                                Check out
                            </button>
                            <Link to="/products" className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-900 underline">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const ConfirmOrder = () => {
    const { shippingInfo, cartItems, clearCart } = useContext(CartContext);
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    const tax = subtotal * 0.18;
    const totalPrice = subtotal + shippingCharges + tax;

    const proceedToPayment = async () => {
        const orderData = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCharges,
            totalPrice,
            paymentInfo: {
                id: 'sample_payment_id',
                status: 'succeeded',
                method: 'COD' // For now default to COD/Simple
            }
        };

        try {
            await api.post('/orders/new', orderData);
            clearCart();
            alert('Order Placed Successfully');
            navigate('/products');
        } catch (err) {
            console.error(err);
            alert('Failed to place order');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Shipping Info</h2>
                    <div className="space-y-2">
                        <p><span className="font-semibold">Name:</span> {user?.username}</p>
                        <p><span className="font-semibold">Phone:</span> {shippingInfo.phoneNo}</p>
                        <p><span className="font-semibold">Address:</span> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`}</p>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Your Cart Items:</h2>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center">
                                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded mr-4" />
                                    <span className="font-semibold text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-gray-600">
                                    {item.quantity} x ₹{item.price} = <b>₹{item.quantity * item.price}</b>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
                    <div className="space-y-4 border-b pb-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Charges:</span>
                            <span className="font-semibold">₹{shippingCharges}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">GST:</span>
                            <span className="font-semibold">₹{tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-xl font-bold text-gray-900 icon">
                        <span>Total:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={proceedToPayment}
                        className="w-full mt-8 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 font-bold"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrder;

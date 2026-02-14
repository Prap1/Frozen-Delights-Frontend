import { useSelector } from 'react-redux';
import CheckoutSteps from './CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
    const { shippingInfo, cartItems, discount } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    const shippingCharges = subtotal > 1000 ? 0 : 200; // Free shipping > 1000
    const tax = subtotal * 0.18; // 18% GST
    const discountAmount = discount ? discount.amount : 0;
    const totalPrice = subtotal + shippingCharges + tax - discountAmount;

    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            discount,
            totalPrice,
        };

        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/process/payment');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <CheckoutSteps activeStep={1} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Shipping & Cart Items */}
                    <div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Info</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{shippingInfo.name}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{shippingInfo.phoneNo}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{address}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Cart Items:</h3>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.product} className="px-4 py-4 sm:px-6 flex items-center">
                                        <div className="flex-shrink-0 h-16 w-16">
                                            <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    {item.Stock < 1 && <span className="text-red-500 text-sm ml-2">(Out of Stock)</span>}
                                                </h3>
                                                <p>{item.quantity} x ₹{item.price} = <b>₹{item.quantity * item.price}</b></p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-8 lg:mt-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200">
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹{subtotal}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹{shippingCharges}</dd>
                                    </div>
                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">GST (18%)</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₹{tax.toFixed(2)}</dd>
                                    </div>

                                    {discount && (
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-green-600">
                                            <dt className="text-sm font-medium">Discount ({discount.code})</dt>
                                            <dd className="mt-1 text-sm font-medium sm:mt-0 sm:col-span-2">- ₹{discount.amount}</dd>
                                        </div>
                                    )}

                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                                        <dt className="text-base font-bold text-gray-900">Total</dt>
                                        <dd className="mt-1 text-base font-bold text-gray-900 sm:mt-0 sm:col-span-2">₹{totalPrice.toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div className="px-4 py-5 sm:px-6">
                                <button
                                    onClick={proceedToPayment}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 result-focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrder;

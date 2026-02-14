import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import CheckoutSteps from './CheckoutSteps';
import { clearCart } from '../../features/cart/cartSlice';
import Swal from 'sweetalert2';

const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');

    useEffect(() => {
        if (paymentMethod === 'Card') {
            fetchSavedCards();
        }
    }, [paymentMethod]);

    const fetchSavedCards = async () => {
        try {
            const { data } = await api.get('/payment/saved-cards');
            setSavedCards(data.cards);
        } catch (error) {
            console.error(error);
        }
    };

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100), // Stripe expects cents
        shippingInfo,
    };

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        discount: orderInfo.discount,
        totalPrice: orderInfo.totalPrice,
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = true;

        try {
            if (paymentMethod === 'COD') {
                order.paymentInfo = {
                    id: 'COD',
                    status: 'succeeded',
                    method: 'COD'
                };
                const success = await createOrder(order);
                if (success) {
                    navigate('/success');
                }
                return;
            }

            // Card Payment
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await api.post('/payment/process', paymentData, config);
            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: shippingInfo.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country === 'India' ? 'IN' : shippingInfo.country,
                        },
                    },
                },
            });

            if (result.error) {
                payBtn.current.disabled = false;
                console.error("Payment Error:", result.error);
                Swal.fire('Payment Error', result.error.message, 'error');
                toast.error(result.error.message);
            } else {
                console.log("Payment Result:", result);
                if (result.paymentIntent.status === 'succeeded') {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                        method: 'Card'
                    };
                    const success = await createOrder(order);
                    if (success) {
                        navigate('/success');
                    }
                } else {
                    console.warn("Payment Status not succeeded:", result.paymentIntent.status);
                    Swal.fire('Payment Failed', `Status: ${result.paymentIntent.status}`, 'error');
                    toast.error(`Payment not completed. Status: ${result.paymentIntent.status}`);
                }
            }
        } catch (error) {
            payBtn.current.disabled = false;
            console.error("Payment Process Error:", error);
            toast.error(error.response?.data?.message || "Payment processing failed");
        }
    };

    const createOrder = async (order) => {
        try {
            await api.post('/orders/new', order);
            dispatch(clearCart());
            return true;
        } catch (error) {
            console.error("Create Order Error:", error);
            toast.error(error.response?.data?.message || "Order creation failed");
            return false;
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <CheckoutSteps activeStep={2} />
            <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Payment Info</h2>

                <div className="mb-6 flex justify-center space-x-4">
                    <button
                        onClick={() => setPaymentMethod('Card')}
                        className={`px-4 py-2 rounded-md ${paymentMethod === 'Card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Card
                    </button>
                    <button
                        onClick={() => setPaymentMethod('COD')}
                        className={`px-4 py-2 rounded-md ${paymentMethod === 'COD' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Cash on Delivery
                    </button>
                </div>

                <form onSubmit={submitHandler}>
                    {paymentMethod === 'Card' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                <div className="mt-1 p-3 border border-gray-300 rounded-md">
                                    <CardNumberElement className="outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <div className="mt-1 p-3 border border-gray-300 rounded-md">
                                    <CardExpiryElement className="outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CVC</label>
                                <div className="mt-1 p-3 border border-gray-300 rounded-md">
                                    <CardCvcElement className="outline-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        ref={payBtn}
                        className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {paymentMethod === 'Card' ? `Pay - ₹${orderInfo && orderInfo.totalPrice}` : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';
import Swal from 'sweetalert2';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Return State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returnDescription, setReturnDescription] = useState('');
    const [returnImages, setReturnImages] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.order);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleCancelOrder = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await api.put(`/orders/${id}/cancel`);

                await Swal.fire(
                    'Cancelled!',
                    'Your order has been cancelled.',
                    'success'
                );

                // Refresh order data
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data.order);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                Swal.fire(
                    'Error!',
                    error.response?.data?.message || 'Failed to cancel order',
                    'error'
                );
            }
        }
    }


    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        if (!returnReason) {
            Swal.fire('Error', 'Please select a reason for return', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('reason', returnReason);
        formData.append('description', returnDescription);
        Array.from(returnImages).forEach(file => {
            formData.append('images', file);
        });

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };

            await api.post(`/orders/${id}/return`, formData, config);

            setLoading(false);
            setReturnModalOpen(false);
            Swal.fire('Success', 'Return request submitted successfully', 'success');

            // Refresh order
            const { data } = await api.get(`/orders/${id}`);
            setOrder(data.order);

        } catch (error) {
            setLoading(false);
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit return request', 'error');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;
    if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

    // Stepper Logic
    const steps = [
        { label: 'Order Confirmed', date: order.createdAt },
        { label: 'Shipped', date: order.orderStatus === 'Shipped' || order.orderStatus === 'Out For Delivery' || order.orderStatus === 'Delivered' ? (order.shippedAt || 'In Progress') : null },
        { label: 'Out For Delivery', date: order.orderStatus === 'Out For Delivery' || order.orderStatus === 'Delivered' ? (order.outForDeliveryAt || 'In Progress') : null },
        { label: 'Delivered', date: order.deliveredAt }
    ];

    const getCurrentStepIndex = () => {
        if (order.orderStatus === 'Returned') return 4;
        if (order.orderStatus === 'Return Requested') return 3;
        if (order.orderStatus === 'Delivered') return 3;
        if (order.orderStatus === 'Out For Delivery') return 2;
        if (order.orderStatus === 'Shipped') return 1;
        if (order.orderStatus === 'Processing') return 0;
        return -1; // Cancelled or other
    };

    const currentStep = getCurrentStepIndex();
    const isCancelled = order.orderStatus === 'Cancelled';


    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Order Items & Status */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Order Items Card */}
                    {order.orderItems.map((item) => (
                        <div key={item.product} className="bg-white p-6 rounded shadow-sm relative">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img
                                        src={item.image.startsWith('http') ? item.image : `${api.defaults.baseURL.replace('/api', '')}/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Color: {item.color || 'Standard'} &bull; Seller: {item.vendor?.role === 'admin' ? 'Admin' : (item.vendor?.brandName || item.vendor?.username || 'Seller')}
                                    </p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">
                                        ₹{item.price} <span className="text-sm text-green-600 font-normal ml-2">{item.quantity} offer applied</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Order Status Stepper Card */}
                    <div className="bg-white p-6 rounded shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>

                        {isCancelled ? (
                            <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="font-bold">This order has been Cancelled</span>
                            </div>
                        ) : (
                            <div className="relative">
                                {steps.map((step, index) => (
                                    <div key={step.label} className="flex gap-4 pb-8 last:pb-0 relative">
                                        {/* Connecting Line */}
                                        {index !== steps.length - 1 && (
                                            <div className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                        )}

                                        {/* Dot */}
                                        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${index <= currentStep ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            {index <= currentStep && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <p className={`font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {step.date ? new Date(step.date).toDateString() : ''}
                                            </p>
                                            {/* Specialized message for active step */}
                                            {index === currentStep && currentStep < 3 && (
                                                <div className="mt-2 bg-blue-50 text-blue-800 text-xs px-3 py-2 rounded">
                                                    Your item is currently {step.label.toLowerCase()}.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Return Status Badges (Mobile/Desktop friendly placement if needed, or in Price details) */}
                    {(order.orderStatus === 'Return Requested' || order.orderStatus === 'Returned') && (
                        <div className={`p-4 rounded shadow-sm flex items-center gap-3 ${order.orderStatus === 'Returned' ? 'bg-orange-50 text-orange-800' : 'bg-yellow-50 text-yellow-800'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                            </svg>
                            <div>
                                <h4 className="font-bold">{order.orderStatus === 'Returned' ? 'Order Returned' : 'Return Requested'}</h4>
                                <p className="text-sm">
                                    {order.orderStatus === 'Returned'
                                        ? 'Your return has been processed and approved.'
                                        : 'We have received your return request. We will review it shortly.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Delivery & Price */}
                <div className="space-y-4">

                    {/* Shipping Details */}
                    <div className="bg-white p-6 rounded shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Delivery details</h3>
                        <div className="mb-4">
                            <div className="flex items-start gap-3 mb-2">
                                <div className="mt-1 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">{order.shippingInfo.name}</p>
                                    <p className="text-gray-600">
                                        {order.shippingInfo.address}, {order.shippingInfo.city}<br />
                                        {order.shippingInfo.state} - {order.shippingInfo.pinCode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold">{order.shippingInfo.phoneNo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="bg-white p-6 rounded shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Price details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Listing price</span>
                                <span>₹{order.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>₹{order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Charges</span>
                                <span className="text-green-600">{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span>
                            </div>
                            <div className="flex justify-between border-t border-dashed pt-3 mt-3 font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                        </div>
                        <div className="mt-4 bg-gray-50 p-3 rounded text-xs text-gray-500">
                            <div className="flex justify-between mb-1">
                                <span>Payment Mode</span>
                                <span className="font-medium text-gray-800">{order.paymentInfo.method || 'Online'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Status</span>
                                <span className={`font-medium ${order.paymentInfo.status === 'succeeded' ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.paymentInfo.status === 'succeeded' ? 'Paid' : 'Pending/Failed'}
                                </span>
                            </div>
                        </div>

                        {/* Cancel Order Button */}
                        {order.orderStatus === 'Processing' && (
                            <button
                                onClick={handleCancelOrder}
                                className="w-full mt-4 bg-red-50 text-red-600 border border-red-200 py-2 rounded font-medium hover:bg-red-100 transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}

                        {order.orderStatus === 'Delivered' && (
                            <button
                                onClick={() => setReturnModalOpen(true)}
                                className="w-full mt-4 bg-gray-900 text-white border border-gray-900 py-2 rounded font-medium hover:bg-gray-800 transition-colors"
                            >
                                Return Product
                            </button>
                        )}

                        {order.returnRequest && order.returnRequest.status === 'Pending' && (
                            <div className="w-full mt-4 bg-yellow-50 text-yellow-800 border border-yellow-200 py-2 rounded font-medium text-center text-sm">
                                Return Requested
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Return Modal */}
            {
                returnModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Request Return</h2>
                            <form onSubmit={handleReturnSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Reason for Return</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Damaged Product">Damaged Product</option>
                                        <option value="Wrong Item">Wrong Item</option>
                                        <option value="Quality Issue">Quality Issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Description</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows="3"
                                        placeholder="Please describe the issue..."
                                        value={returnDescription}
                                        onChange={(e) => setReturnDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-bold mb-2">Upload Proof Images</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setReturnImages(e.target.files)}
                                        className="w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Select multiple images if needed.</p>
                                </div>
                                <div className="flex justify-end gap-3 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setReturnModalOpen(false)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default OrderDetails;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBox, FaCalendar, FaUser, FaClipboardList } from 'react-icons/fa';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorOrders = async () => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/vendor/orders', config);
                setOrders(data.orders);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchVendorOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <FaClipboardList className="text-blue-600" />
                    Vendor Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Orders Yet</h3>
                        <p className="mt-2 text-gray-500">You haven't received any orders for your products yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-sm font-medium text-gray-500">#{order._id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 gap-4">
                                        <div className="flex items-center gap-1">
                                            <FaCalendar />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="font-semibold text-gray-900">
                                            ${order.totalPrice}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <FaUser className="text-gray-400" />
                                            Customer Details
                                        </h4>
                                        <p className="text-sm text-gray-600">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h4>
                                        <ul className="divide-y divide-gray-100">
                                            {order.orderItems.map((item) => (
                                                <li key={item.product} className="py-2 flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">${item.price * item.quantity}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/me');
                setOrders(data.orders);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-10">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {orders && orders.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <li key={order._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                    <Link to={`/order/${order._id}`} className="block">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-blue-600 truncate">
                                                Order ID: {order._id}
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Items: {order.orderItems.length}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Total: ₹{order.totalPrice}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    Ordered on {String(order.createdAt).substr(0, 10)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500">You have no orders yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;

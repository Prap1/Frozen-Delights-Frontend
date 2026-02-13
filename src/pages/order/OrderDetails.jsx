import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center py-10">Loading order details...</div>;
    if (!order) return <div className="text-center py-10">Order not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Order Details</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-blue-600">Order #{order._id}</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Shipping Info</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {order.user && order.user.name}, <br />
                                    {order.shippingInfo.phoneNo}, <br />
                                    {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pinCode}
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Payment</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={order.paymentInfo.status === 'succeeded' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                        {order.paymentInfo.status === 'succeeded' ? 'PAID' : 'NOT PAID'}
                                    </span>
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Order Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={order.orderStatus === 'Delivered' ? 'text-green-600 font-bold' : 'text-blue-600 font-bold'}>
                                        {order.orderStatus}
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {order.orderItems.map((item) => (
                            <li key={item.product} className="px-4 py-4 sm:px-6 flex items-center">
                                <div className="flex-shrink-0 h-16 w-16">
                                    <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.name} />
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3><Link to={`/product/${item.product}`}>{item.name}</Link></h3>
                                        <p>{item.quantity} x ₹{item.price} = <b>₹{item.quantity * item.price}</b></p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

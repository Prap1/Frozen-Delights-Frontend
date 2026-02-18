import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/ui/Loader';

const MyOrders = () => {
    const { user } = useSelector((state) => state.auth);
    const {products}=useSelector((state)=>state.products)
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [statusFilters, setStatusFilters] = useState([]);
    const [timeFilters, setTimeFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const statusOptions = ['On the way', 'Delivered', 'Cancelled', 'Returned'];
    const timeOptions = ['Last 30 days', '2024', '2023', 'Older'];

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch Orders when filters change
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (statusFilters.length > 0) params.append('status', statusFilters.join(','));
                if (timeFilters.length > 0) params.append('time', timeFilters.join(','));
                if (debouncedSearch) params.append('search', debouncedSearch);

                const { data } = await api.get(`/orders/me?${params.toString()}`);
                setOrders(data.orders);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [statusFilters, timeFilters, debouncedSearch]);

    const handleStatusFilterChange = (status) => {
        setStatusFilters(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    const handleTimeFilterChange = (time) => {
        setTimeFilters(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-1/4 bg-white p-4 shadow rounded-md h-fit">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-bold">Filters</h2>
                    </div>

                    {/* Order Status */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm">Order Status</h3>
                        <div className="space-y-2">
                            {statusOptions.map(status => (
                                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={statusFilters.includes(status)}
                                        onChange={() => handleStatusFilterChange(status)}
                                    />
                                    <span className="text-gray-600 text-sm">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Order Time */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm">Order Time</h3>
                        <div className="space-y-2">
                            {timeOptions.map(time => (
                                <label key={time} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={timeFilters.includes(time)}
                                        onChange={() => handleTimeFilterChange(time)}
                                    />
                                    <span className="text-gray-600 text-sm">{time}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Search Bar */}
                    <div className="flex mb-6">
                        <input
                            type="text"
                            placeholder="Search your orders here"
                            className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search Orders
                        </button>
                    </div>

                    {/* Orders List */}
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader /></div>
                    ) : (
                        <div className="space-y-4">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <OrderCard key={order._id} order={order} />
                                ))
                            ) : (
                                <div className="bg-white p-8 text-center rounded-md shadow">
                                    <p className="text-gray-500 text-lg">No orders found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const OrderCard = ({ order }) => {
    // Determine status color
    const getStatusColor = (status) => {
        if (status === 'Delivered') return 'text-green-600';
        if (status === 'Processing') return 'text-yellow-600';
        if (status === 'Cancelled') return 'text-red-600';
        return 'text-gray-600';
    };

    const getStatusIconColor = (status) => {
        if (status === 'Delivered') return 'bg-green-500';
        if (status === 'Processing') return 'bg-yellow-500';
        if (status === 'Cancelled') return 'bg-red-500';
        return 'bg-gray-500';
    };

    return (
        <div className="bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row gap-4">
            {/* Image Section (First Item) */}
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                {order.orderItems[0]?.image ? (
                    <img
                        src={order.orderItems[0].image.startsWith('http') ? order.orderItems[0].image : `${api.defaults.baseURL.replace('/api', '')}/${order.orderItems[0].image}`}
                        alt={order.orderItems[0].name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
            </div>

            {/* Details Section */}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-medium text-gray-900 text-lg">{order.orderItems[0]?.name}</h4>
                        {order.orderItems.length > 1 && (
                            <p className="text-sm text-gray-500">and {order.orderItems.length - 1} other item(s)</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Color: {order.orderItems[0]?.color || 'Standard'}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900">₹{order.totalPrice}</p>
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className="md:w-1/3 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${getStatusIconColor(order.orderStatus)}`}></span>
                        <span className={`font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus} {order.orderStatus === 'Delivered' ? `on ${new Date(order.deliveredAt || order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        {order.orderStatus === 'Delivered' ? 'Your item has been delivered' : 'Your item is being processed'}
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {order.orderStatus === 'Delivered' && (
                        <Link to={`/product/${order.orderItems[0].product}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                            ★ Rate & Review Product
                        </Link>
                    )}
                    <Link to={`/order/${order._id}`} className="text-gray-500 hover:text-gray-700 text-sm">
                        View Order Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;

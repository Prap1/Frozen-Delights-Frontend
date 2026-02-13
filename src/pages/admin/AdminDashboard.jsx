import { useEffect } from 'react';
import { FaShoppingCart, FaClipboardList, FaCheckCircle, FaDollarSign, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../features/orders/orderSlice';
import Loader from '../../components/ui/Loader';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { orders = [], totalAmount = 0, loading } = useSelector((state) => state.orders || {});

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    // Calculate stats from real orders
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Processing').length; // Adjust status string as per API
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

    // Revenue is coming from backend or calculated? 
    // orderSlice has totalAmount, let's use that or fallback
    const revenue = totalAmount;

    const stats = [
        { title: 'Total Orders', value: totalOrders, icon: <FaShoppingCart />, color: 'bg-blue-500' },
        { title: 'Pending Orders', value: pendingOrders, icon: <FaClipboardList />, color: 'bg-yellow-500' },
        { title: 'Completed Orders', value: completedOrders, icon: <FaCheckCircle />, color: 'bg-green-500' },
        { title: 'Total Revenue', value: `$${(revenue || 0).toFixed(2)}`, icon: <FaDollarSign />, color: 'bg-purple-500' },
    ];

    // Mock Reports for now unless backend provides specific report endpoints
    // In a real app, we'd process `orders` to generate these arrays
    const dailySales = [
        { date: '2026-02-12', orders: 15, revenue: 450.00 },
        { date: '2026-02-11', orders: 12, revenue: 380.50 },
    ];

    const monthlySales = [
        { month: 'February 2026', orders: 345, revenue: 12450.00 },
    ];

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            {/* Order Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center">
                        <div className={`p-4 rounded-full text-white ${stat.color} mr-4`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Sales Report */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                            <FaCalendarAlt />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Daily Sales Report</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dailySales.map((day, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{day.date}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{day.orders}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${day.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Sales Report */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
                            <FaChartLine />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Monthly Sales Report</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {monthlySales.map((month, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{month.month}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{month.orders}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${month.revenue.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

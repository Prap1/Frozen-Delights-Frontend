import { useEffect } from 'react';
import { FaShoppingCart, FaClipboardList, FaCheckCircle, FaDollarSign, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../features/orders/orderSlice';
import Loader from '../../components/ui/Loader';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { orders = [], totalAmount = 0, loading } = useSelector((state) => state.orders || {});

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const revenue = totalAmount;

    // Process Date for Line Chart (Daily Sales - Last 7 Days)
    const processDailySales = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const salesData = last7Days.map(date => {
            const dayOrders = orders.filter(o => o.createdAt.startsWith(date));
            const dayRevenue = dayOrders.reduce((acc, curr) => acc + curr.totalPrice, 0);
            return dayRevenue;
        });

        return { labels: last7Days, data: salesData };
    };

    const dailySalesData = processDailySales();

    const lineChartData = {
        labels: dailySalesData.labels,
        datasets: [
            {
                label: 'Daily Revenue',
                data: dailySalesData.data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const doughnutChartData = {
        labels: ['Processing', 'Delivered', 'Cancelled'],
        datasets: [
            {
                label: '# of Orders',
                data: [
                    orders.filter(o => o.orderStatus === 'Processing').length,
                    orders.filter(o => o.orderStatus === 'Delivered').length,
                    orders.filter(o => o.orderStatus === 'Cancelled').length,
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Calculate Top Selling Products
    const getTopProducts = () => {
        const productMap = {};
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (productMap[item.name]) {
                    productMap[item.name] += item.quantity;
                } else {
                    productMap[item.name] = item.quantity;
                }
            });
        });

        const sortedProducts = Object.entries(productMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return sortedProducts;
    };

    const topProducts = getTopProducts();

    const stats = [
        { title: 'Total Orders', value: totalOrders, icon: <FaShoppingCart />, color: 'bg-blue-500' },
        { title: 'Pending Orders', value: pendingOrders, icon: <FaClipboardList />, color: 'bg-yellow-500' },
        { title: 'Completed Orders', value: completedOrders, icon: <FaCheckCircle />, color: 'bg-green-500' },
        { title: 'Total Revenue', value: `$${(revenue || 0).toFixed(2)}`, icon: <FaDollarSign />, color: 'bg-purple-500' },
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
                {/* Daily Sales Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                            <FaChartLine />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Daily Sales Trend (Last 7 Days)</h2>
                    </div>
                    <Line data={lineChartData} />
                </div>

                {/* Order Status Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
                            <FaClipboardList />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Order Status Distribution</h2>
                    </div>
                    <div className="w-full max-w-xs mx-auto">
                        <Doughnut data={doughnutChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

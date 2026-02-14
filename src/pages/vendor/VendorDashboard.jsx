import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Keep for products
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorOrders } from '../../features/orders/orderSlice';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const VendorDashboard = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { vendorOrders, loading: ordersLoading } = useSelector((state) => state.orders);

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchVendorOrders());
    }, [dispatch]);

    useEffect(() => {
        const fetchVendorProducts = async () => {
            try {
                const { data } = await api.get('/products/vendor');
                setProducts(data.products);
                setProductsLoading(false);
            } catch (error) {
                console.error("Error fetching vendor products:", error);
                toast.error(error.response?.data?.message || 'Error fetching products');
                setProductsLoading(false);
            }
        };

        fetchVendorProducts();
    }, []);

    if (ordersLoading || productsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Process Data for Charts

    // 1. Sales Over Time (Line Chart)
    const processSalesData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const salesData = last7Days.map(date => {
            const dayOrders = vendorOrders.filter(o => o.createdAt.startsWith(date));
            // Calculate revenue from these orders? 
            // Note: vendorOrders might be full order objects. 
            // If vendor only gets paid for THEIR items, we should filter orderItems.
            // For simplicity, assuming backend returns orders where total is relevant or we sum item prices
            // Let's sum up price * qty for items belonging to this vendor
            const dayRevenue = dayOrders.reduce((acc, order) => {
                const vendorItems = order.orderItems.filter(item => item.product); // We might need to check product vendor, but backend 'getVendorOrders' hopefully filters or we just use total
                // Ideally backend returns vendor specific total.
                // Fallback: Use order.totalPrice if order is dedicated, or sum items if mixed.
                // Assuming simple case:
                return acc + order.totalPrice;
            }, 0);
            return dayRevenue;
        });

        return { labels: last7Days, data: salesData };
    };

    const salesData = processSalesData();

    const salesChartData = {
        labels: salesData.labels,
        datasets: [
            {
                label: 'My Sales (Last 7 Days)',
                data: salesData.data,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3,
            },
        ],
    };

    // 2. Product Stock Levels (Bar Chart)
    const stockChartData = {
        labels: products.map(p => p.name.substring(0, 15) + (p.name.length > 15 ? '...' : '')),
        datasets: [
            {
                label: 'Stock Level',
                data: products.map(p => p.Stock),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                    <Link
                        to="/vendor/product/new"
                        className="bg-green-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-green-700"
                    >
                        + Add New Product
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Store Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {user?.brandName ? `${user.brandName} - ` : ''} {user?.email}
                        </p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h3>
                        <Line data={salesChartData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Product Stock Levels</h3>
                        <Bar data={stockChartData} />
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">My Products</h2>

                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">You haven't added any products yet.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product._id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]?.url} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-blue-600 truncate">{product.name}</div>
                                                    <div className="text-sm text-gray-500">Stock: {product.Stock}</div>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    ${product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDashboard;

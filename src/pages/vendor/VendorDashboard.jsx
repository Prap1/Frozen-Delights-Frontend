import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const VendorDashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorProducts = async () => {
            try {
                const { data } = await api.get('/products/vendor');
                console.log("Vendor Products Fetched:", data);
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching vendor products:", error);
                toast.error(error.response?.data?.message || 'Error fetching products');
                setLoading(false);
            }
        };

        fetchVendorProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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

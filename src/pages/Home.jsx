import { Link } from 'react-router-dom';
import HeroCarousel from '../components/ui/HeroCarousel';
import { motion } from 'framer-motion';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { fetchContent } from '../features/content/contentSlice';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const { items: products, loading } = useSelector((state) => state.products);
    const { contentItems } = useSelector((state) => state.content);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchContent());
    }, [dispatch]);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    if (user?.role === 'admin') return null;

    if (loading) return <Loader />;

    // Use real products, fallback to empty array if undefined
    const featuredProducts = products || [];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Announcements */}
            {contentItems.filter(i => i.type === 'announcement').map((item) => (
                <div key={item._id} className="bg-blue-600 text-white text-center py-2 px-4 text-sm font-medium">
                    {item.content}
                </div>
            ))}

            {/* Hero Section */}
            <HeroCarousel />

            {/* Features Info - Dynamic or Fallback */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {contentItems.filter(i => i.type === 'feature').length > 0 ? (
                            contentItems.filter(i => i.type === 'feature').map((item) => (
                                <div key={item._id} className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        {item.icon || '✨'}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.content}</p>
                                </div>
                            ))
                        ) : (
                            // Fallback if no dynamic content
                            <>
                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        🍦
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Artisanal Flavors</h3>
                                    <p className="text-gray-600">Handcrafted in small batches using premium ingredients.</p>
                                </div>
                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        🚚
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Frozen Delivery</h3>
                                    <p className="text-gray-600">Delivered frozen to your doorstep in eco-friendly packaging.</p>
                                </div>
                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        ✨
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Happiness Guaranteed</h3>
                                    <p className="text-gray-600">If you're not smiling after the first bite, it's on us.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <div className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        New Arrivals
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Freshly churned for you.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...featuredProducts]
                        .sort((a, b) => {
                            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                            return dateB - dateA;
                        })
                        .slice(0, 4)
                        .map((product) => (
                            <motion.div
                                key={`new-${product._id}`}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl"
                            >
                                <div className="h-64 overflow-hidden relative group">
                                    <img
                                        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                        <span className="flex items-center text-yellow-400 text-sm font-bold">
                                            ★ {product.rating || 5.0}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price?.toFixed(2) || '0.00'}</p>
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="block w-full py-2 px-4 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>

            {/* Popular Items */}
            <div className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Popular Choices
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Loved by everyone.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...featuredProducts]
                        // Sort by rating desc, assuming rating field exists or use generic fallback
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 4)
                        .map((product) => (
                            <motion.div
                                key={`pop-${product._id}`}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all hover:shadow-xl"
                            >
                                <div className="h-64 overflow-hidden relative group">
                                    <img
                                        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                        <span className="flex items-center text-yellow-400 text-sm font-bold">
                                            ★ {product.rating || 5.0}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-4">₹{product.price?.toFixed(2) || '0.00'}</p>
                                    <Link
                                        to={`/product/${product._id}`}
                                        className="block w-full py-2 px-4 bg-gray-900 text-white text-center rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>

            <div className="mt-12 text-center">
                <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-md hover:shadow-lg transition-all"
                >
                    View All Products
                </Link>
            </div>
        </div>
    );
};

export default Home;

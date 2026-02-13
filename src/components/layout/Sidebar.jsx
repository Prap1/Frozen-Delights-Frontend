import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FaTachometerAlt,
    FaBoxOpen,
    FaTags,
    FaPercent,
    FaUsers,
    FaComment,
    FaEdit,
    FaClipboardList,
    FaTruck,
    FaStar
} from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const adminMenuItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/admin/products', name: 'Products', icon: <FaBoxOpen /> },
        { path: '/admin/categories', name: 'Categories', icon: <FaTags /> },
        { path: '/admin/discounts', name: 'Discounts', icon: <FaPercent /> },
        { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
        { path: '/admin/vendor-requests', name: 'Vendor Requests', icon: <FaUsers /> },
        { path: '/admin/reviews', name: 'Reviews', icon: <FaComment /> },
        { path: '/admin/content', name: 'Content', icon: <FaEdit /> },
    ];

    const vendorMenuItems = [
        { path: '/vendor/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/vendor/products', name: 'My Products', icon: <FaBoxOpen /> }, // Reuse or redirect to dashboard
        { path: '/vendor/orders', name: 'Orders', icon: <FaClipboardList /> },
        { path: '/vendor/pricing', name: 'Pricing & Offers', icon: <FaTags /> },
        { path: '/vendor/delivery', name: 'Delivery', icon: <FaTruck /> },
        { path: '/vendor/feedback', name: 'Feedback', icon: <FaStar /> },
    ];

    const menuItems = user?.role === 'admin' ? adminMenuItems : (user?.role === 'vendor' ? vendorMenuItems : []);

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen hidden md:block flex-shrink-0">
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-blue-400">
                    {user?.role === 'vendor' ? 'Vendor Panel' : 'Admin Panel'}
                </h2>
            </div>
            <nav className="mt-6">
                <ul>
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white border-l-4 border-blue-500' : ''
                                        }`}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import api from "../../services/api";
// import CartContext from "../../context/CartContext";

const Navbar = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const isAdmin = user?.role === 'admin';
    const isVendor = user?.role === 'vendor';

    const handleLogout = () => {
        dispatch(logout());
        setAccountOpen(false);
        navigate('/');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo & Desktop Nav */}
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Frozen Delights
                            </span>
                        </Link>
                        {!isAdmin && !isVendor && (
                            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                                <Link to="/" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                    Home
                                </Link>
                                <Link to="/products" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                    Our Menu
                                </Link>
                                <Link to="/about" className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                    About Us
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden lg:ml-6 lg:flex lg:items-center space-x-4">

                        {/* Compare */}
                        {!isAdmin && !isVendor && (
                            <Link to="/compare" className="relative p-2 text-gray-400 hover:text-blue-500 transition-colors group">
                                <span className="sr-only">Compare</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </Link>
                        )}

                        {/* Cart */}
                        {!isAdmin && !isVendor && (
                            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-blue-500 transition-colors group">
                                <span className="sr-only">View cart</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItems.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Account / Login */}
                        {isAuthenticated ? (
                            <div className="ml-3 relative">
                                <div>
                                    <button
                                        onClick={() => setAccountOpen(!accountOpen)}
                                        className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 items-center gap-2 px-3 py-1 border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage.startsWith('http') ? user.profileImage : `${api.defaults.baseURL.replace('/api', '')}/${user.profileImage}`}
                                                alt="Profile"
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <span className="hidden xl:block text-gray-700 font-medium">{user?.username}</span>
                                    </button>
                                </div>
                                {accountOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setAccountOpen(false)}>Your Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setAccountOpen(false)}>Orders</Link>
                                        {user?.role === 'user' && user?.vendorStatus !== 'approved' && (
                                            <Link to="/become-vendor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setAccountOpen(false)}>Become a Vendor</Link>
                                        )}
                                        {user?.role === 'vendor' && (
                                            <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setAccountOpen(false)}>Vendor Dashboard</Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Log in</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center lg:hidden">
                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenu ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="lg:hidden bg-white border-t border-gray-100">
                    <div className="pt-2 pb-3 space-y-1">
                        {!isAdmin && !isVendor && (
                            <>
                                <Link to="/" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
                                <Link to="/products" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Our Menu</Link>
                                <Link to="/about" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">About Us</Link>
                                <Link to="/cart" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                                    Cart ({cartItems.length})
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200">
                        {isAuthenticated ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage.startsWith('http') ? user.profileImage : `${api.defaults.baseURL.replace('/api', '')}/${user.profileImage}`}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.username}</div>
                                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="px-4 space-y-2">
                                <Link to="/login" className="block text-center w-full px-4 py-2 border border-blue-600 rounded-md shadow-sm text-blue-600 bg-white hover:bg-blue-50">Log in</Link>
                                <Link to="/register" className="block text-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">Sign up</Link>
                            </div>
                        )}
                        {isAuthenticated && (
                            <div className="mt-3 space-y-1">
                                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Your Profile</Link>
                                <Link to="/orders" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Orders</Link>
                                {user?.role === 'user' && user?.vendorStatus !== 'approved' && (
                                    <Link to="/become-vendor" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Become a Vendor</Link>
                                )}
                                {user?.role === 'vendor' && (
                                    <Link to="/vendor/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Vendor Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-100">Sign out</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

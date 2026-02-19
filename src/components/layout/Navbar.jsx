import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import api from "../../services/api";
import { FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
// import CartContext from "../../context/CartContext";

const Navbar = ({ toggleSidebar }) => {
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
        <nav className="bg-white sticky top-0 z-50 shadow-sm font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">

                    {/* Logo & Sidebar Toggle */}
                    <div className="flex items-center gap-1.5 md:gap-3">
                        {/* Sidebar Toggle for Mobile/Tablet (Admin/Vendor Only) */}
                        {(isAdmin || isVendor) && (
                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 text-gray-600 hover:text-primary focus:outline-none mr-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        )}

                        <Link to="/" className="flex-shrink-0 flex items-center gap-1.5 md:gap-3 group">
                            <img
                                src={logo}
                                alt="Frozen Delights Logo"
                                className="h-7 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
                                style={{ filter: 'hue-rotate(150deg) saturate(1.2)' }}
                            />
                            <span className="hidden md:block text-xs md:text-2xl font-bold text-gray-800 tracking-wider group-hover:text-[#E65555] transition-colors">
                                Frozen Delights
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu - Hidden for Admin & Vendor */}
                    {!isAdmin && !isVendor && (
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">
                                About Us
                            </Link>

                            {/* Pages Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-1 text-gray-700 hover:text-[#E65555] font-medium transition-colors focus:outline-none">
                                    Pages
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {/* Dropdown Content */}
                                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-xl py-2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 border border-gray-100">
                                    <Link to="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E65555] font-medium">Product</Link>
                                    <Link to="/helpcentre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E65555] font-medium">Faq</Link>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Cart Icon - Hidden form Admin & Vendor */}
                        {!isAdmin && !isVendor && (
                            <Link to="/cart" className="relative text-gray-700 hover:text-[#E65555] transition-colors p-1">
                                <FaShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#E65555] text-white text-[10px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-200 mx-1 md:hidden"></div>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage.startsWith('http') ? user.profileImage : `${api.defaults.baseURL.replace('/api', '')}/${user.profileImage}`}
                                            alt="Profile"
                                            className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 text-sm md:text-base">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </button>
                                {accountOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fade-in-down">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.username}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-primary font-medium" onClick={() => setAccountOpen(false)}>Your Profile</Link>
                                        {!isAdmin && (
                                            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-primary font-medium" onClick={() => setAccountOpen(false)}>Orders</Link>
                                        )}
                                        {user?.role === 'user' && user?.vendorStatus !== 'approved' && (
                                            <Link to="/become-vendor" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-primary font-medium" onClick={() => setAccountOpen(false)}>Become a Vendor</Link>
                                        )}
                                        {user?.role === 'vendor' && (
                                            <Link to="/vendor/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-primary font-medium" onClick={() => setAccountOpen(false)}>Vendor Dashboard</Link>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link to="/login" className="text-gray-700 hover:text-[#E65555] font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/contact" className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-[#E65555] hover:bg-red-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Contact Us
                                </Link>
                            </div>
                        )}


                        {/* Mobile menu button */}
                        {!isAdmin && !isVendor && (
                            <div className="lg:hidden">
                                <button
                                    onClick={() => setMobileMenu(!mobileMenu)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
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
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="lg:hidden bg-white border-t border-gray-100 py-4 shadow-inner">
                    <div className="px-4 space-y-3">
                        <Link to="/" className="block text-gray-700 hover:text-[#E65555] font-medium" onClick={() => setMobileMenu(false)}>Home</Link>
                        <Link to="/about" className="block text-gray-700 hover:text-[#E65555] font-medium" onClick={() => setMobileMenu(false)}>About Us</Link>
                        {!isAuthenticated && (
                            <Link to="/login" className="block text-gray-700 hover:text-[#E65555] font-medium" onClick={() => setMobileMenu(false)}>Login</Link>
                        )}
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pages</p>
                            {/* <Link to="/services" className="block pl-2 py-1 text-sm text-gray-600 hover:text-[#E65555]" onClick={() => setMobileMenu(false)}>Service</Link> */}
                            <Link to="/products" className="block pl-2 py-1 text-sm text-gray-600 hover:text-[#E65555]" onClick={() => setMobileMenu(false)}>Product</Link>
                            <Link to="/helpcentre" className="block pl-2 py-1 text-sm text-gray-600 hover:text-[#E65555]" onClick={() => setMobileMenu(false)}>Faq</Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="relative bg-[#FFF5F5] pt-20 mt-20 font-['Poppins']">
            {/* Wave Background */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 -translate-y-[98%] z-10">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-24 fill-[#FFF5F5]">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Frozen Delights
                        </span>
                        <p className="text-gray-600 text-sm mt-4 leading-relaxed mb-6">
                            Crafting moments of joy with premium frozen desserts.
                            Made with love and the finest ingredients.
                        </p>

                        {/* Social Icons */}
                        <div className="flex space-x-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-[#E65555] text-white flex items-center justify-center hover:bg-[#d14040] transition-colors">
                                <FaFacebookF size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[#E65555] text-white flex items-center justify-center hover:bg-[#d14040] transition-colors">
                                <FaTwitter size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-[#E65555] text-white flex items-center justify-center hover:bg-[#d14040] transition-colors">
                                <FaYoutube size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Shop</h3>
                        <ul className="space-y-3">
                            <li><Link to="/products" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">All Products</Link></li>
                            <li><Link to="/bestsellers" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">Best Sellers</Link></li>
                            <li><Link to="/new-arrivals" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">Contact Us</Link></li>
                            <li><Link to="/helpcentre" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">Help Centre</Link></li>
                            <li><Link to="/shipping-policy" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">Shipping Info</Link></li>
                            <li><Link to="/return-policy" className="text-[#E65555] hover:text-[#d14040] transition-colors font-medium">Returns Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter - Stay Cool */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Stay Cool</h3>
                        <p className="text-gray-600 text-sm mb-4">Subscribe for the latest flavors and exclusive offers.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full px-4 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:border-transparent bg-white text-gray-800 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-[#E65555] text-white font-medium rounded-lg hover:bg-[#d14040] transition-colors shadow-md hover:shadow-lg"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Frozen Delights. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-[#E65555] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#E65555] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

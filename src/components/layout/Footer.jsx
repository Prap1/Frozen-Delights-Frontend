import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Frozen Delights
                        </span>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            Crafting moments of joy with premium frozen desserts.
                            Made with love and the finest ingredients.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Shop</h3>
                        <ul className="space-y-3">
                            <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/best-sellers" className="text-gray-400 hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link to="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/gift-cards" className="text-gray-400 hover:text-white transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Stay Cool</h3>
                        <p className="text-gray-400 text-sm mb-4">Subscribe for the latest flavors and exclusive offers.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="flex-1 min-w-0 px-4 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Frozen Delights. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

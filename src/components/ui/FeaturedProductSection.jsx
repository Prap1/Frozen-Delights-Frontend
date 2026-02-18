import { motion } from 'framer-motion';

const products = [
    {
        id: 1,
        name: "Strawberry Ice Waffle",
        price: "5.99",
        image: "https://img.freepik.com/premium-photo/ice-cream-scoops-waffle-bowl-decorated-with-fruits-chocolate-isolated-white-background_124507-6105.jpg", // Placeholder
    },
    {
        id: 2,
        name: "Quadruple Delight",
        price: "5.99",
        image: "https://img.freepik.com/premium-photo/ice-cream-cones-isolated-white-background_124507-6571.jpg", // Placeholder
    },
    {
        id: 3,
        name: "Vanilla Caramel Sauce",
        price: "5.99",
        image: "https://img.freepik.com/premium-photo/bowl-vanilla-ice-cream-with-caramel-sauce-isolated-white-background_124507-6332.jpg", // Placeholder
    }
];

const FeaturedProductSection = ({ items }) => {
    // Use items if provided, otherwise fallback to empty array or static placeholder if desired.
    // However, the request implies using the provided items (popular products).
    const productsToDisplay = items && items.length > 0 ? items : [];

    if (productsToDisplay.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A]">
                        Our Featured <span className="text-[#E65555]">Product</span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {productsToDisplay.slice(0, 3).map((product, index) => (
                        <motion.div
                            key={product._id || product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative rounded-[40px] overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
                        >
                            {/* Card Background Container - ensuring the aspect ratio matches */}
                            <div className="bg-[#F8A8A8] relative h-[500px] flex flex-col items-center justify-end pb-12 overflow-hidden">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#F8A8A8]/20 to-[#E65555]/10"></div>

                                {/* Wave Background Pattern */}
                                <div className="absolute inset-0 opacity-40">
                                    <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full text-white fill-current opacity-20 transform scale-150">
                                        <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" style={{ stroke: 'none', fill: '#fff' }}></path>
                                    </svg>
                                    <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="absolute bottom-0 w-full h-1/2 text-[#E65555] fill-current opacity-20">
                                        <path d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z" style={{ stroke: 'none' }}></path>
                                    </svg>
                                </div>

                                {/* Circular Image Background */}
                                <div className="absolute top-12 w-64 h-64 bg-white rounded-full flex items-center justify-center p-4 shadow-sm z-10 overflow-hidden">
                                    <img
                                        src={product.images?.[0]?.url || product.image || "https://via.placeholder.com/300"}
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>

                                {/* Content */}
                                <div className="relative z-20 text-center mt-64 pt-40 px-4">
                                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm line-clamp-1">{product.name}</h3>
                                    <p className="text-4xl font-bold text-white mb-8 drop-shadow-sm">$ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>

                                    <button className="bg-white text-[#E65555] font-semibold text-sm py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:scale-105">
                                        Check It Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProductSection;

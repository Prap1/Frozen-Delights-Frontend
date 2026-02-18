import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const defaultVariants = [
    {
        id: 1,
        title: "Ice Cone",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        image: "https://cdn-icons-png.flaticon.com/512/938/938063.png", // Placeholder icon
        active: false
    },
    {
        id: 2,
        title: "Scoop Delish",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        image: "https://cdn-icons-png.flaticon.com/512/918/918234.png", // Placeholder icon
        active: true
    },
    {
        id: 3,
        title: "Berry Smoothie",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        image: "https://cdn-icons-png.flaticon.com/512/2405/2405451.png", // Placeholder icon
        active: false
    },
    {
        id: 4,
        title: "Smooth Serving",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        image: "https://cdn-icons-png.flaticon.com/512/1046/1046771.png", // Placeholder icon
        active: false
    }
];

const IceCreamVariantSection = () => {
    const { contentItems } = useSelector((state) => state.content);
    const dbVariants = contentItems.filter(item => item.type === 'variant' && item.isActive).map(item => ({
        id: item._id,
        title: item.title,
        description: item.content,
        image: item.icon || item.image || "https://cdn-icons-png.flaticon.com/512/938/938063.png",
        active: false // We can add logic for 'active' state if needed, currently defaulting to false or can be randomized
    }));

    // If active state needs to be managed or highlighted, we might just highlight the 2nd one like in static data for visual appeal
    if (dbVariants.length > 0 && dbVariants.length >= 2) {
        dbVariants[1].active = true;
    }

    const variants = dbVariants.length > 0 ? dbVariants : defaultVariants;

    return (
        <section className="py-16 bg-white font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Ice Cream <span className="text-[#E65555]">Variant</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {variants.map((variant, index) => (
                        <motion.div
                            key={variant.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative rounded-3xl p-8 transition-all duration-300 group hover:-translate-y-2 ${variant.active
                                ? 'bg-[#E65555] text-white shadow-xl shadow-red-200'
                                : 'bg-red-50 text-gray-900 hover:bg-red-100 hover:shadow-lg'
                                }`}
                        >
                            {/* Decorative Wave for Active Card */}
                            {variant.active && (
                                <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none opacity-20">
                                    <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full">
                                        <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#fff' }}></path>
                                    </svg>
                                </div>
                            )}

                            {/* Icon Wrapper */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl ${variant.active ? 'bg-white/20' : 'bg-white'
                                }`}>
                                <img src={variant.image} alt={variant.title} className="w-10 h-10 object-contain" />
                            </div>

                            <h3 className={`text-xl font-bold mb-3 ${variant.active ? 'text-white' : 'text-gray-900'}`}>
                                {variant.title}
                            </h3>

                            <p className={`text-sm leading-relaxed ${variant.active ? 'text-white/90' : 'text-gray-600'}`}>
                                {variant.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IceCreamVariantSection;

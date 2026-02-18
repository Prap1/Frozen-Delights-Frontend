import { motion } from 'framer-motion';

const features = [
    {
        id: 1,
        title: "Modern Innovation",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    },
    {
        id: 2,
        title: "Passionate Approach",
        description: "Pellentesque fermentum interdum orci at mattis. Duis sit amet mi eget turpis euismod placerat.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
        )
    },
    {
        id: 3,
        title: "Organic Product",
        description: "Aenean rhoncus justo volutpat, euismod urna at, volutpat tortor. Phasellus congue purus eu.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        )
    }
];

const WhyChooseUsSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white font-['Poppins'] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-4">
                            Why Choose Our <br />
                            <span className="text-[#E65555]">Products</span>
                        </h2>

                        <p className="text-gray-600 text-lg mb-10 max-w-lg">
                            Maecenas nibh lorem, imperdiet a sollicitudin rhoncus, commodo non erat. Suspendisse turpis tellus, pretium sit amet lacinia ut.
                        </p>

                        <div className="space-y-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#E65555]/30 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[#E65555] opacity-80 rounded-full"></div>
                                        <div className="relative z-10">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative lg:ml-auto"
                    >
                        <div className="relative w-full max-w-[500px] mx-auto">
                            {/* Decorative Blobs */}
                            <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] z-0 text-[#FCA5A5] opacity-50 fill-current" viewBox="0 0 200 200">
                                <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.5,31.4C58.8,41.4,46.7,48.6,35.1,53.8C23.5,59,12.4,62.2,-0.3,62.7C-13,63.2,-23.7,61,-35.6,56.5C-47.5,52,-60.6,45.2,-70.2,34.2C-79.8,23.2,-85.9,8,-82.6,-5.5C-79.3,-19,-66.6,-30.8,-55.1,-40.5C-43.6,-50.2,-33.3,-57.8,-21.8,-63.3C-10.3,-68.8,2.4,-72.2,16.6,-77.6L44.7,-76.4Z" transform="translate(100 100)" />
                            </svg>

                            {/* Dotted Pattern */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 opacity-80 z-0">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="2" className="text-gray-800 fill-current" />
                                    </pattern>
                                    <rect width="100" height="100" fill="url(#dots)" />
                                </svg>
                            </div>

                            {/* Striped Circle - Bottom Left */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 z-20">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                                    <circle cx="50" cy="50" r="50" className="text-yellow-400 fill-none stroke-current" strokeWidth="2" strokeDasharray="4 4" />
                                    {/* Simplified striped representation */}
                                    <circle cx="50" cy="50" r="40" className="text-yellow-400 opacity-20 fill-current" />
                                </svg>
                            </div>

                            {/* Main Image */}
                            <img
                                src="https://img.freepik.com/premium-photo/strawberry-ice-cream-waffle-cone-isolated-white-background_252965-212.jpg"
                                alt="Strawberry Soft Serve"
                                className="relative z-10 w-full h-auto drop-shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500"
                            />

                            {/* Geometric Shapes */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-gray-700 rotate-12 z-20"></div>
                            <div className="absolute top-1/2 -right-12 w-8 h-8 bg-[#FCA5A5] rounded-full z-20"></div>
                            <div className="absolute top-1/3 left-[-40px] w-0 h-0 border-l-[15px] border-l-transparent border-t-[25px] border-t-black border-r-[15px] border-r-transparent rotate-[-30deg] z-20">
                                <div className="absolute -top-[22px] -left-[10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[18px] border-t-white border-r-[10px] border-r-transparent"></div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUsSection;

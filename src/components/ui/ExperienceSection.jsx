import { motion } from 'framer-motion';

const features = [
    "Duis viverra tristique",
    "Nulla lobortis sodales",
    "Quisque mollis libero",
    "Proin facilisis mauris",
    "Fusce ligula tortor",
    "Nunc ligula massa"
];

const ExperienceSection = () => {
    return (
        <section className="relative py-20 lg:py-32 font-['Poppins'] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://img.freepik.com/free-photo/chef-preparing-food-kitchen_23-2148006733.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side Visuals */}
                    <div className="relative">
                        {/* Decorative Blob */}
                        <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-[140%] h-[140%] text-[#FCA5A5] fill-current opacity-80 z-0" viewBox="0 0 200 200">
                            <path d="M41.9,-51.7C54.2,-43.3,64.3,-32.1,69.5,-18.9C74.7,-5.7,75.1,9.5,69.1,22.1C63.1,34.7,50.7,44.7,37.6,52.3C24.5,59.9,10.7,65.1,-2.2,68.1C-15.1,71.1,-27.1,71.9,-37.8,65.3C-48.5,58.7,-57.9,44.7,-64.1,29.9C-70.3,15.1,-73.3,-0.5,-68.6,-13.9C-63.9,-27.3,-51.5,-38.5,-38.6,-46.6C-25.7,-54.7,-12.3,-59.7,0.9,-61C14.1,-62.2,29.6,-60.1,41.9,-51.7Z" transform="translate(100 100)" />
                        </svg>

                        {/* Dotted Pattern */}
                        <div className="absolute top-10 -left-10 w-32 h-32 z-0">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                                <pattern id="dots-exp" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="2" className="text-gray-800 fill-current" />
                                </pattern>
                                <rect width="100" height="100" fill="url(#dots-exp)" />
                            </svg>
                        </div>

                        {/* Striped Elements */}
                        <div className="absolute top-0 right-10 w-24 h-24 z-0">
                            <svg className="w-full h-full text-yellow-400" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                <path d="M10,90 L90,10" stroke="currentColor" strokeWidth="2" />
                                <path d="M20,100 L100,20" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>

                        {/* Geometric Decoration */}
                        <div className="absolute -top-10 left-10 w-10 h-10 border-2 border-red-500 rotate-45 z-20 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-red-500"></div>
                        </div>
                        <div className="absolute top-0 left-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-b-[20px] border-b-black border-r-[10px] border-r-transparent transform -translate-x-1/2 -translate-y-full z-20"></div>


                        {/* Main Image */}
                        <img
                            src="https://img.freepik.com/premium-photo/collection-ice-cream-scoops-cups-with-various-toppings-isolated-white-background_124507-6123.jpg" // Placeholder matching the vibe
                            alt="Taste Experience"
                            className="relative z-10 w-full max-w-sm mx-auto drop-shadow-2xl"
                        />
                    </div>

                    {/* Right Content Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white p-8 md:p-12 rounded-3xl shadow-xl z-10"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] leading-tight mb-2">
                            Taste It.
                        </h2>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#E65555] leading-tight mb-6">
                            Experience It.
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E65555] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ExperienceSection;

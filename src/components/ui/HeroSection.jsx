import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const HeroSection = () => {
    const { contentItems } = useSelector((state) => state.content);
    const heroContent = contentItems.find(item => item.type === 'hero' && item.isActive);

    const title = heroContent?.title || (
        <>
            <span className="text-[#E65555]">Poppin’</span> Fresh<br />
            Ice Cream Shop.
        </>
    );
    const subtitle = heroContent?.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.";
    const image = heroContent?.image || "https://kitpro.site/flato/wp-content/uploads/sites/141/2023/01/chocolate-ice-cream-in-waffle-basket-2021-08-26-16-31-46-utc-1.png";
    const ctaText = heroContent?.ctaText || "Try It Now";
    const link = heroContent?.link || "/products";

    return (
        <section className="relative bg-white overflow-hidden font-['Poppins'] py-16 lg:py-24">
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E65555]/5 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl opacity-50 pointer-events-none"></div>

            {/* Geometric Shapes */}
            <div className="absolute top-1/4 left-10 md:left-20 w-8 h-8 border-2 border-gray-800 rotate-12 opacity-20 animate-spin-slow pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-10 md:right-1/3 w-6 h-6 border-2 border-[#E65555] rotate-45 opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left z-10"
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                            {typeof title === 'string' ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
                        </h1>
                        <p className="text-lg md:text-xl text-text-light mb-8 max-w-lg mx-auto lg:mx-0">
                            {subtitle}
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link
                                to={link}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#E65555] rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {ctaText}
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="relative w-full max-w-lg mx-auto">
                            {/* Abstract blobs behind image */}
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] z-0 text-red-100 fill-current opacity-60">
                                <path fill="#FCA5A5" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.4,70.5,31.4C58.8,41.4,46.7,48.6,35.1,53.8C23.5,59,12.4,62.2,-0.3,62.7C-13,63.2,-23.7,61,-35.6,56.5C-47.5,52,-60.6,45.2,-70.2,34.2C-79.8,23.2,-85.9,8,-82.6,-5.5C-79.3,-19,-66.6,-30.8,-55.1,-40.5C-43.6,-50.2,-33.3,-57.8,-21.8,-63.3C-10.3,-68.8,2.4,-72.2,16.6,-77.6L44.7,-76.4Z" transform="translate(100 100) scale(1.1)" />
                            </svg>
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 w-[120%] h-[120%] z-0 text-yellow-100 fill-current opacity-60">
                                <path fill="#FDE047" d="M41.4,-71.3C52.6,-64.3,60.2,-50.8,68.2,-37.6C76.2,-24.4,84.6,-11.5,83.1,0.7C81.6,12.9,70.2,24.3,60.2,35.3C50.2,46.3,41.6,56.9,30.8,63.4C20,69.9,7,72.3,-5.6,71.1C-18.2,69.9,-30.4,65.1,-42.2,59.1C-54,53.1,-65.4,45.9,-72.1,35.4C-78.8,24.9,-80.8,11.1,-78.9,-2.2C-77,-15.5,-71.2,-28.3,-61.8,-37.8C-52.4,-47.3,-39.4,-53.5,-27,-59.1C-14.6,-64.7,-2.8,-69.7,8.8,-71.3L41.4,-71.3Z" transform="translate(100 100)" />
                            </svg>

                            {/* Main Ice Cream Image Placeholder */}
                            {/* In a real project, use the actual image asset. Here using a high-quality placeholder that looks similar */}
                            <img
                                src={image}
                                alt="Delicious Ice Cream in Waffle Bowl"
                                className="relative w-full h-auto drop-shadow-2xl z-10 transform hover:scale-105 transition-transform duration-500"
                            />

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-white p-4 rounded-xl shadow-lg z-20 hidden md:block"
                            >
                                <span className="text-2xl">🍓</span>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg z-20 hidden md:block"
                            >
                                <span className="text-2xl">🍫</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

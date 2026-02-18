import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HighlightSection = () => {
    const { contentItems } = useSelector((state) => state.content);
    const highlightContent = contentItems.find(item => item.type === 'highlight' && item.isActive);

    const title = highlightContent?.title || (
        <>
            Taking Ice Cream To <br className="hidden lg:block" />
            New <span className="text-[#E65555]">Heights</span>
        </>
    );
    const description = highlightContent?.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet elementum ante. Sed mattis sapien vel vestibulum lacinia. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce a fermentum leo. Integer sem nulla, pretium vel purus vel, venenatis vehicula turpis.";
    const image = highlightContent?.image || "https://kitpro.site/flato/wp-content/uploads/sites/141/2023/01/man-making-ice-cream-in-the-shop-2021-10-13-18-07-07-utc.png";
    const ctaText = highlightContent?.ctaText || "Learn More";
    const link = highlightContent?.link || "/about";

    return (
        <section className="relative py-16 lg:py-24 overflow-hidden font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Blob Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-0">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#FCA5A5] fill-current opacity-40">
                                <path d="M41.9,-51.7C54.2,-43.3,64.3,-32.1,69.5,-18.9C74.7,-5.7,75.1,9.5,69.1,22.1C63.1,34.7,50.7,44.7,37.6,52.3C24.5,59.9,10.7,65.1,-2.2,68.1C-15.1,71.1,-27.1,71.9,-37.8,65.3C-48.5,58.7,-57.9,44.7,-64.1,29.9C-70.3,15.1,-73.3,-0.5,-68.6,-13.9C-63.9,-27.3,-51.5,-38.5,-38.6,-46.6C-25.7,-54.7,-12.3,-59.7,0.9,-61C14.1,-62.2,29.6,-60.1,41.9,-51.7Z" transform="translate(100 100)" />
                            </svg>
                        </div>

                        {/* Main Image */}
                        <div className="relative z-10 rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto">
                            <img
                                src={image}
                                alt="Barista holding ice cream"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Decorations */}
                        {/* Wavy Line */}
                        <svg className="absolute top-10 -left-10 w-24 h-24 text-white z-20 stroke-current" fill="none" viewBox="0 0 100 100">
                            <path strokeWidth="3" d="M10,50 Q25,25 40,50 T70,50 T100,50" />
                        </svg>

                        {/* Dots Pattern - Bottom Left */}
                        <div className="absolute -bottom-10 -left-10 grid grid-cols-4 gap-2 z-0">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                            ))}
                        </div>

                        {/* Circle - Top Right */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#FCA5A5] rounded-full blur-sm opacity-60 transform translate-x-1/2 -translate-y-1/2 z-0"></div>

                        {/* Triangle outline - Top Left */}
                        <div className="absolute top-[-20px] left-10 w-8 h-8 border-2 border-gray-900 transform rotate-12 z-20">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                                <path d="M12 2L2 22h20L12 2z" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Right Content Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center lg:text-left"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                            {typeof title === 'string' ? <span dangerouslySetInnerHTML={{ __html: title }} /> : title}
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {description}
                        </p>

                        <Link to={link} className="px-8 py-3 bg-[#E65555] text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition-all hover:shadow-xl hover:-translate-y-1 inline-block">
                            {ctaText}
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HighlightSection;

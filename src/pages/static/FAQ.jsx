import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa"; // Changed icons to Plus/Minus
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchContent } from "../../features/content/contentSlice";
import Loader from "../../components/ui/Loader";

const FAQ = () => {
    const dispatch = useDispatch();
    const { contentItems, loading, error } = useSelector((state) => state.content);

    // Filter only FAQs
    const faqItems = contentItems.filter(item => item.type === 'faq' && item.isActive);

    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        dispatch(fetchContent('faq'));
    }, [dispatch]);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    if (loading) return <Loader />;
    if (error) return <div className="p-10 text-center text-red-600">Error loading FAQs: {error}</div>;

    return (
        <div className="min-h-screen bg-white font-['Poppins']">
            {/* Header Section */}
            <div className="relative pt-16 pb-24 flex flex-col items-center justify-center overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-[15%] w-24 h-24 rounded-full border-4 border-yellow-400 opacity-20 pointer-events-none"></div>
                {/* Yellow Circle decoration placeholder */}
                <svg className="absolute top-12 right-[20%] w-32 h-32 text-yellow-400 opacity-80 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                {/* Zigzag decoration */}
                <svg className="absolute top-8 left-[30%] w-16 h-16 text-pink-300 pointer-events-none" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="5">
                    <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10 L70 0 L80 10 L90 0 L100 10" />
                </svg>
                {/* Ring decoration */}
                <div className="absolute top-24 left-[28%] w-8 h-8 rounded-full border-4 border-gray-600 pointer-events-none"></div>


                <h1 className="text-6xl font-extrabold text-[#0D1E32] mb-4 relative z-10">FAQ</h1>

                <div className="flex items-center space-x-2 text-sm font-medium z-10">
                    <Link to="/" className="text-[#E65555] hover:underline">Home</Link>
                    <span className="text-gray-400 font-bold">&gt;</span>
                    <span className="text-[#E65555]">FAQ</span>
                </div>

                {/* Wave Separator at bottom of header */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white opacity-20"></path>
                    </svg>
                    {/* Using a curve similar to reference - recreating clean white look requires background checking. 
                         Assuming main bg is white, this header section serves as the top part. 
                         Actually, the reference has a white background with a wave separating the header area? 
                         Let's keep it simple: Clean white background for the whole page, header elements floating.
                     */}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#0D1E32]">
                        General <span className="text-[#E65555]">Question</span>
                    </h2>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {faqItems.length > 0 ? (
                        faqItems.map((item, index) => (
                            <div key={item._id} className="mb-2">
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className={`w-full flex justify-between items-center px-6 py-4 rounded-lg transition-all duration-300 shadow-sm ${expandedQuestion === index
                                            ? "bg-[#E65555] text-white"
                                            : "bg-[#FDF2F2] text-[#E65555] hover:bg-red-100" // Light pink bg for closed
                                        }`}
                                >
                                    <span className={`font-semibold text-left text-lg ${expandedQuestion === index ? "text-white" : "text-[#E65555]"}`}>
                                        {item.title}
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        {expandedQuestion === index ? <FaMinus /> : <FaPlus />}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {expandedQuestion === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 py-6 text-gray-600 bg-white leading-relaxed text-sm border-l-2 border-[#E65555] mt-2">
                                                {item.content}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-gray-500">
                            No FAQs found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FAQ;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchContent } from "../../features/content/contentSlice";
import Loader from "../../components/ui/Loader";

const FAQ = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { contentItems, loading, error } = useSelector((state) => state.content);

    // Filter only FAQs
    const faqItems = contentItems.filter(item => item.type === 'faq' && item.isActive);

    // Group by Category (using subtitle as category)
    const groupedFAQs = faqItems.reduce((acc, item) => {
        const category = item.subtitle || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const categories = Object.keys(groupedFAQs);

    const [activeCategory, setActiveCategory] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    useEffect(() => {
        dispatch(fetchContent('faq'));
    }, [dispatch]);

    useEffect(() => {
        if (categories.length > 0) {
            // Check for catalog param (ID or Category Name)
            const catalogParam = searchParams.get('catalog');
            let foundCategory = categories[0];

            if (catalogParam) {
                // Try finding by exact category name match OR by item ID within category
                const cat = categories.find(c => c === catalogParam || groupedFAQs[c].some(item => item._id === catalogParam));
                if (cat) {
                    foundCategory = cat;
                }
            }

            if (!activeCategory || (catalogParam && activeCategory !== foundCategory)) {
                setActiveCategory(foundCategory);
            }
        }
    }, [categories.length, searchParams, activeCategory, groupedFAQs]);

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setExpandedQuestion(null);

        const firstItemId = groupedFAQs[category][0]?._id;
        if (firstItemId) {
            setSearchParams({ catalog: firstItemId, view: 'CATALOG' });
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="p-10 text-center text-red-600">Error loading FAQs: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-blue-600 text-white py-4 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-medium">Help Center</h1>
                    <div className="relative hidden md:block w-96"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* Sidebar */}
                    <div className="w-full md:w-1/4 bg-white shadow-sm rounded-lg overflow-hidden h-fit">
                        <div className="border-b border-gray-100 last:border-0 pb-2">
                            <h3 className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Help Topics</h3>
                            <ul className="mb-2">
                                {categories.length > 0 ? categories.map((cat) => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => handleCategoryClick(cat)}
                                            className={`w-full text-left px-5 py-3 text-sm flex justify-between items-center hover:bg-blue-50 transition-colors ${activeCategory === cat
                                                ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 pl-4"
                                                : "text-gray-700 hover:text-blue-600"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                )) : (
                                    <li className="px-5 py-3 text-sm text-gray-500">No topics found. (Check Debug Bar)</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 flex flex-col">
                        <div className="bg-white shadow-sm rounded-lg p-6 min-h-[500px]">
                            {/* Breadcrumb / Header */}
                            <div className="mb-6">
                                <p className="text-xs text-gray-500 mb-2">Help Centre {'>'} {activeCategory || '...'}</p>
                                <h2 className="text-2xl font-semibold text-gray-800">{activeCategory || 'Select a Topic'}</h2>
                            </div>

                            {/* Questions List */}
                            <div className="space-y-4">
                                {activeCategory && groupedFAQs[activeCategory] ? (
                                    groupedFAQs[activeCategory].map((item, index) => (
                                        <div key={item._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                            <button
                                                onClick={() => toggleQuestion(index)}
                                                className="w-full text-left flex justify-between items-start focus:outline-none group"
                                            >
                                                <span className={`text-base ${expandedQuestion === index ? 'text-blue-600 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                                                    {item.title}
                                                </span>
                                                <span className={`ml-2 transform transition-transform duration-200 text-gray-400 ${expandedQuestion === index ? 'rotate-90 text-blue-600' : ''}`}>
                                                    <FaChevronRight size={14} />
                                                </span>
                                            </button>
                                            <AnimatePresence>
                                                {expandedQuestion === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-1 whitespace-pre-wrap">
                                                            {item.content}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        <p>Select a topic to view details.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer / Postal Address Note */}
                        <div className="mt-8 text-center text-gray-500 text-xs">
                            <p>Want to reach us old style? Here is our <span className="text-blue-600 cursor-pointer hover:underline">postal address</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FAQ;

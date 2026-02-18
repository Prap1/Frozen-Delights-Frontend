import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';

const About = () => {
    const dispatch = useDispatch();
    const { contentItems, loading } = useSelector((state) => state.content);

    useEffect(() => {
        dispatch(fetchContent('about'));
    }, [dispatch]);

    if (loading) return <Loader />;

    // Find the active 'about' content (assuming one main entry or mapping multiple)
    const aboutContent = contentItems.find(item => item.type === 'about' && item.isActive) || {
        title: "About Frozen Delights",
        content: "Frozen Delight is a premium frozen dessert brand dedicated to delivering high-quality, flavorful, and refreshing treats. Our goal is to combine taste, freshness, and innovation to create an exceptional dessert experience for our customers. With a strong focus on quality standards and customer satisfaction, Frozen Delight aims to be a trusted name in frozen desserts.",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=2670&auto=format&fit=crop" // Default generic ice cream image
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 py-24 px-6 sm:px-12 lg:px-24">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=2574&auto=format&fit=crop"
                        alt="Ice Cream Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                        {aboutContent.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                        Crafting moments of pure joy, one scoop at a time.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div className="prose prose-lg text-gray-600">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                        <div className="whitespace-pre-line leading-relaxed">
                            {aboutContent.content}
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <img
                            src={aboutContent.image}
                            alt="About Frozen Delights"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="font-bold text-xl">Premium Quality</p>
                            <p className="text-sm opacity-90">Since 2024</p>
                        </div>
                    </div>
                </div>

                {/* Values Section (Static for now to add flair) */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-[#FDF2F2] rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-white text-[#E65555] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">🌿</div>
                        <h3 className="text-xl font-bold text-[#0D1E32] mb-2">Fresh Ingredients</h3>
                        <p className="text-gray-600">We source only the finest, freshest ingredients for our desserts.</p>
                    </div>
                    <div className="text-center p-6 bg-[#FDF2F2] rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-white text-[#E65555] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">✨</div>
                        <h3 className="text-xl font-bold text-[#0D1E32] mb-2">Innovative Flavors</h3>
                        <p className="text-gray-600">Constantly experimenting to bring you unique and delightful taste experiences.</p>
                    </div>
                    <div className="text-center p-6 bg-[#FDF2F2] rounded-xl hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-white text-[#E65555] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">❤️</div>
                        <h3 className="text-xl font-bold text-[#0D1E32] mb-2">Made with Love</h3>
                        <p className="text-gray-600">Every batch is crafted with care and passion for our customers.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;

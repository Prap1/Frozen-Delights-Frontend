import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import HeroSection from '../components/ui/HeroSection';
import HighlightSection from '../components/ui/HighlightSection';
import IceCreamVariantSection from '../components/ui/IceCreamVariantSection';
import WhyChooseUsSection from '../components/ui/WhyChooseUsSection';
import FeaturedProductSection from '../components/ui/FeaturedProductSection';
import ExperienceSection from '../components/ui/ExperienceSection';
import TestimonialSection from '../components/ui/TestimonialSection';
import StorySection from '../components/ui/StorySection';
import { motion } from 'framer-motion';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { fetchContent } from '../features/content/contentSlice';
import Loader from '../components/ui/Loader';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const { items: products, loading } = useSelector((state) => state.products);
    const { contentItems } = useSelector((state) => state.content);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchContent());
    }, [dispatch]);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    if (user?.role === 'admin') return null;

    if (loading) return <Loader />;

    // Use real products, fallback to empty array if undefined
    const featuredProducts = products || [];

    return (
        <div className="flex flex-col min-h-screen bg-white font-['Poppins']">
            {/* Announcements */}
            {contentItems.filter(i => i.type === 'announcement').map((item) => (
                <div key={item._id} className="bg-[#E65555] text-white text-center py-2 px-4 text-sm font-medium">
                    {item.content}
                </div>
            ))}

            {/* Hero Section */}
            <HeroSection />

            {/* Highlight Section */}
            <HighlightSection />

            {/* Ice Cream Variant Section */}
            <IceCreamVariantSection />

            {/* Why Choose Us Section */}
            <WhyChooseUsSection />





            {/* New Arrivals - Hidden */}

            {/* Popular Items (Featured Product Style) */}
            <FeaturedProductSection
                items={[...featuredProducts]
                    .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
                    .slice(0, 3)
                }
            />

            {/* Experience Section */}
            <ExperienceSection />

            {/* Testimonial Section */}
            {/* <TestimonialSection /> */}

            {/* Story Section */}
            {/* <StorySection /> */}
        </div>
    );
};

export default Home;

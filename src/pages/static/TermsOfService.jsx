import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';

const TermsOfService = () => {
    const dispatch = useDispatch();
    const { contentItems, loading } = useSelector(state => state.content);
    const [termsContent, setTermsContent] = useState(null);

    useEffect(() => {
        dispatch(fetchContent('terms'));
    }, [dispatch]);

    useEffect(() => {
        if (contentItems && contentItems.length > 0) {
            // contentItems is an array, we find the first 'terms' item
            const item = contentItems.find(c => c.type === 'terms');
            if (item) setTermsContent(item);
        }
    }, [contentItems]);

    if (loading) return <Loader />;

    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    {termsContent ? termsContent.title : 'Terms of Service'}
                </h1>

                {termsContent ? (
                    <div
                        className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: termsContent.content.replace(/\n/g, '<br />') }}
                    />
                ) : (
                    <div className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
                        <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-yellow-800">
                            <p>Terms of Service content is currently being updated. Please check back later.</p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TermsOfService;

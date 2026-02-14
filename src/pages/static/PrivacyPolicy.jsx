import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';

const PrivacyPolicy = () => {
    const dispatch = useDispatch();
    const { contentItems, loading } = useSelector(state => state.content);
    const [privacyContent, setPrivacyContent] = useState(null);

    useEffect(() => {
        dispatch(fetchContent('privacy'));
    }, [dispatch]);

    useEffect(() => {
        if (contentItems && contentItems.length > 0) {
            const item = contentItems.find(c => c.type === 'privacy');
            if (item) setPrivacyContent(item);
        }
    }, [contentItems]);

    // If loading and we don't have content yet, show loader
    if (loading && !privacyContent) return <Loader />;

    // Use dynamic content if available
    if (privacyContent) {
        return (
            <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center uppercase tracking-wide">
                        {privacyContent.title}
                    </h1>
                    <div
                        className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: privacyContent.content.replace(/\n/g, '<br />') }}
                    />
                </div>
            </div>
        );
    }

    // Fallback to static content
    return (
        <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center uppercase tracking-wide">
                    Privacy Policy
                </h1>

                <div className="space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
                    {/* Disclaimer */}
                    <section className="bg-gray-50 p-4 rounded-lg border border-gray-100 italic text-gray-600">
                        <p>
                            <span className="font-semibold text-gray-800 not-italic">Disclaimer:</span> In case of any discrepancy or difference, the English version will take precedence over the translation.
                        </p>
                    </section>

                    {/* Introduction */}
                    <section>
                        <p>
                            We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how <strong>Frozen Delights</strong> and its affiliates, group companies and related parties (collectively "Frozen Delights", "we", "our", "us") collect, use, share or otherwise process your personal data through the website and its mobile application (hereinafter referred to as the "Platform").
                        </p>
                        <p className="mt-4">
                            While you can browse sections of the Platform without the need of sharing any information with us, however, please note we do not offer any product or service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing out product/service, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
                        </p>
                    </section>

                    {/* Collection of Information */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Collection of Your Information</h2>
                        <p>
                            When you use our Platform, we collect and store your information which is provided by you from time to time. Once you give us your personal data, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide data by choosing not to use a particular service, product or feature on the Platform.
                        </p>
                        <p className="mt-4">
                            We collect and analyse your personal data relating to your buying behavior, browsing patterns, preferences, and other information that you choose to provide while interacting with our Platform. We use this information to do internal research on our users' demographics, interests, usage trends, and behavior to better understand your needs and provide you with an enhanced user experience, protect and serve our users. Additionally, this information may also be compiled and analyzed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our Platform or not), which URL you next go to (whether this URL is on our Platform or not), your computer browser information, and your IP address. Such insights enable us to personalise and optimise our products, services, marketing communications, and the checkout process to better align with your preferences. The insights derived from this analysis may be shared with our group companies, affiliates, related companies, business partners, and third-parties who offer services to us or to whom we provide our products or services. These group companies, affiliates, related companies, business partners and third-parties may use such insights for promotions, advertisements and marketing, product development, and other commercial purposes. They may also leverage these insights to display content according to your preferences.
                        </p>
                    </section>

                    {/* Use of Demographic / Profile Data */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Use of Demographic / Profile Data / Your Information</h2>
                        <p>
                            We use your personal data to take and fulfill orders, deliver products and services, process payments, and communicate with you about orders, products and services, and promotional offers. We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services; inform you about online and offline offers, products, services, and updates; customize and enhance your experience; report to regulatory authorities wherever required, detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection of information.
                        </p>
                        <p className="mt-4">
                            With your consent, we may have access to your SMS, instant messages, contacts in your directory, location, camera, photo gallery and device information and we may also request you to provide your PAN, credit information report (from credit agencies), GST Number, Government issued ID cards/number and Know-Your-Customer (KYC) details to: (i) check your eligibility for certain products and services like insurance, credit and payment products; (ii) issue GST invoice for the products and services purchased for your business requirements; (iii) enhance your experience on the Platform and provide you access to the products and services being offered by us, sellers, affiliates, lending partners, business partners or third-parties who offer services to us or to whom we provide our products or services. You understand that your access to these products/services may be affected in the event consent is not provided to us.
                        </p>
                        <p className="mt-4">
                            In our efforts to continually improve our product and service offerings, we and our affiliates collect and analyze demographic and profile data about our users' activity on our Platform. We identify and use your IP address to help diagnose problems with our server, and to administer our Platform. Your IP address is also used to help identify you and to gather broad demographic information.
                        </p>
                        <p className="mt-4">
                            We will occasionally ask you to participate in optional surveys conducted either by us or through a third-party market research agency. These surveys may ask you for personal data, contact information, date of birth, demographic information (like zip code, age, or income level), attributes such as your interests, household or lifestyle information, your purchasing behavior or history, preferences, and other such information that you may choose to provide. The surveys may involve collection of voice data or video recordings, the participation of which would purely be voluntary in nature. We use this data to tailor your experience at our Platform, providing you with content that we think you might be interested in and to display content according to your preferences.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

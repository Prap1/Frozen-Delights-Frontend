import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeadset, FaEnvelope, FaQuestionCircle } from 'react-icons/fa';

const Support = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        How can we help you?
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Our support team is here to assist you with any questions or issues.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
                    <Link to="/contact" className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-center mb-4">
                            <FaHeadset className="h-12 w-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">Contact Support</h3>
                        <p className="mt-2 text-gray-500">
                            Speak directly with our customer service team.
                        </p>
                    </Link>

                    <Link to="/faqs" className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-center mb-4">
                            <FaQuestionCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">FAQs</h3>
                        <p className="mt-2 text-gray-500">
                            Find answers to commonly asked questions.
                        </p>
                    </Link>

                    <div className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="flex justify-center mb-4">
                            <FaEnvelope className="h-12 w-12 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">Email Us</h3>
                        <p className="mt-2 text-gray-500">
                            support@frozendelights.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;

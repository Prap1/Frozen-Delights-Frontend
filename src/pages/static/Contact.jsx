import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStore, FaArrowRight } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log(formData);
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white font-['Poppins']">
            {/* Header Section */}
            <div className="relative pt-16 pb-24 flex flex-col items-center justify-center overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-10 right-[15%] w-24 h-24 rounded-full border-4 border-yellow-400 opacity-20 pointer-events-none"></div>
                <svg className="absolute top-12 right-[20%] w-32 h-32 text-yellow-400 opacity-80 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                <svg className="absolute top-8 left-[30%] w-16 h-16 text-pink-300 pointer-events-none" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="5">
                    <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10 L70 0 L80 10 L90 0 L100 10" />
                </svg>
                <div className="absolute top-24 left-[28%] w-8 h-8 rounded-full border-4 border-gray-600 pointer-events-none"></div>

                <h1 className="text-6xl font-extrabold text-[#0D1E32] mb-4 relative z-10">Contact <span className="text-[#0D1E32]">Us</span></h1>

                <div className="flex items-center space-x-2 text-sm font-medium z-10">
                    <Link to="/" className="text-[#E65555] hover:underline">Home</Link>
                    <span className="text-gray-400 font-bold">&gt;</span>
                    <span className="text-[#E65555]">Contact Us</span>
                </div>

                {/* Wave Separator */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white opacity-20"></path>
                    </svg>
                </div>
            </div>

            {/* Info Cards Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Phone */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#FDF2F2] rounded-full flex items-center justify-center text-[#E65555] mb-4">
                            <FaPhoneAlt size={24} />
                        </div>
                        <h3 className="text-[#E65555] font-medium mb-1">Our Number</h3>
                        <p className="text-2xl font-bold text-[#0D1E32]">+6282 4032 567</p>
                    </div>
                    {/* Email */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#FDF2F2] rounded-full flex items-center justify-center text-[#E65555] mb-4">
                            <FaEnvelope size={24} />
                        </div>
                        <h3 className="text-[#E65555] font-medium mb-1">Email Address</h3>
                        <p className="text-2xl font-bold text-[#0D1E32]">example@email.com</p>
                    </div>
                    {/* Location */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#FDF2F2] rounded-full flex items-center justify-center text-[#E65555] mb-4">
                            <FaMapMarkerAlt size={24} />
                        </div>
                        <h3 className="text-[#E65555] font-medium mb-1">Our Location</h3>
                        <p className="text-xl font-bold text-[#0D1E32]">2443 Oak Ridge Omaha, QA 45065</p>
                    </div>
                </div>
            </div>

            {/* Main Content: Get In Touch & Form */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Text & Map */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-[#0D1E32] mb-4">
                                Get In <span className="text-[#E65555]">Touch</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Nulla nec ligla molestie, pulvinar mi id, vulputate magna. Etiam lobortis velit vitae ante aliquet tincidunt.
                            </p>
                        </div>

                        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.7281065796!2d-0.2416815338162817!3d51.52877184087545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sin!4v1708428800000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Google Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:w-1/2">
                        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Your Name..."
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E65555] focus:ring-1 focus:ring-[#E65555] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="example@site.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E65555] focus:ring-1 focus:ring-[#E65555] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    placeholder="Type a Subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E65555] focus:ring-1 focus:ring-[#E65555] focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="6"
                                    placeholder="Type Here..."
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#E65555] focus:ring-1 focus:ring-[#E65555] focus:outline-none transition-colors resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 px-6 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] transition-all transform hover:-translate-y-1"
                            >
                                Send Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Visit Store Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="md:w-1/2 p-12">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-[#E65555] rounded-full flex items-center justify-center text-white">
                                <FaStore />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0D1E32]">Visit Our Store Now!</h3>
                        </div>

                        <div className="border-b border-gray-100 mb-6"></div>

                        <h4 className="font-bold text-[#0D1E32] mb-4">Open Hours :</h4>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-[#0D1E32] font-semibold">Monday - Friday</p>
                                <p className="text-[#E65555] font-medium mt-1">09.00 AM - 05.00 PM</p>
                            </div>
                            <div>
                                <p className="text-[#0D1E32] font-semibold">Saturday - Sunday</p>
                                <p className="text-[#E65555] font-medium mt-1">10.00 AM - 08.00 PM</p>
                            </div>
                        </div>

                        <div className="border-b border-gray-100 my-6"></div>

                        <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-full text-white bg-[#E65555] hover:bg-[#d14040] transition-colors">
                            <span className="mr-2">See Map</span> <FaArrowRight />
                        </button>
                    </div>
                    <div className="md:w-1/2 h-[500px] relative">
                        <img
                            src="https://kitpro.site/flato/wp-content/uploads/sites/141/2023/01/outdoor-seating-at-a-restaurant-2022-12-16-01-08-38-utc-copy-1024x699.jpg"
                            alt="Frozen Delights Store Front"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/autoplay';

const testimonials = [
    {
        id: 1,
        name: "Anna Rose",
        role: "Doctor",
        image: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet libero et justo tristique vulputate. Vestibulum congue vulputate nibh, eget consectetur nibh euismod at."
    },
    {
        id: 2,
        name: "Jacob Anderson",
        role: "Student",
        image: "https://img.freepik.com/free-photo/portrait-handsome-man-isolated_53876-40305.jpg",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet libero et justo tristique vulputate. Vestibulum congue vulputate nibh, eget consectetur nibh euismod at."
    },
    {
        id: 3,
        name: "Jim Wert",
        role: "Office Worker",
        image: "https://img.freepik.com/free-photo/mand-holding-cup_1258-340.jpg",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet libero et justo tristique vulputate. Vestibulum congue vulputate nibh, eget consectetur nibh euismod at."
    },
    {
        id: 4,
        name: "Sarah Williams",
        role: "Designer",
        image: "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet libero et justo tristique vulputate. Vestibulum congue vulputate nibh, eget consectetur nibh euismod at."
    },
    {
        id: 5,
        name: "Michael Chen",
        role: "Engineer",
        image: "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg",
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet libero et justo tristique vulputate. Vestibulum congue vulputate nibh, eget consectetur nibh euismod at."
    }
];

const TestimonialSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
                    Our Customer <span className="text-[#E65555]">Testimonial</span>
                </h2>
                <p className="text-gray-600 max-w-2xl">
                    Pellentesque fermentum interdum orci at mattis. Duis sit amet mi eget turpis euismod placerat. Sed in posuere neque, tincidunt ultrices nisl.
                </p>
            </div>

            {/* Swiper Container */}
            <div className="w-full relative px-4">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={true}
                    speed={3000}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="w-full !pb-12" // Add padding bottom for shadows
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id} className="h-auto">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col relative group hover:-translate-y-1 transition-transform duration-300">
                                {/* Stars */}
                                <div className="flex text-yellow-400 gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>

                                {/* Quote Icon */}
                                <FaQuoteLeft className="text-pink-100 text-5xl absolute top-8 left-6 -z-0" />

                                {/* Text */}
                                <p className="text-gray-600 mb-8 relative z-10 leading-relaxed italic">
                                    {testimonial.quote}
                                </p>

                                {/* User Info */}
                                <div className="mt-auto flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E65555]/20">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1A1A1A]">{testimonial.name}</h4>
                                        <p className="text-[#E65555] text-sm font-medium">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TestimonialSection;

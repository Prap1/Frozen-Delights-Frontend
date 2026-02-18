import { motion } from 'framer-motion';

const stories = [
    {
        id: 1,
        date: "24",
        month: "Jan",
        title: "Best Ice Cream Shop In Town",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quis ornare mauris. Quisque ullamcorper lacus dolor, vel mattis dolor facilisis at.",
        image: "https://img.freepik.com/free-photo/young-man-working-ice-cream-shop_23-2149226343.jpg?w=740&t=st=1708170000~exp=1708170600~hmac=placeholder" // Shop worker with tray
    },
    {
        id: 2,
        date: "24",
        month: "Jan",
        title: "Your Family Ice Cream Shop",
        description: "Nulla lobortis sodales rutrum. Proin at dignissim justo. Aenean eleifend, enim gravida fermentum euismod, odio est ornare justo, non commodo tortor dui vitae.",
        image: "https://img.freepik.com/free-photo/ingredients-ice-cream_23-2147754948.jpg?w=740&t=st=1708170000~exp=1708170600~hmac=placeholder" // Fruit/Ingredients setup
    },
    {
        id: 3,
        date: "24",
        month: "Jan",
        title: "It's Ice Cream Time!",
        description: "Duis viverra tristique euismod. Donec eu lectus lorem. Proin facilisis mauris nec efficitur accumsan. Nunc ligula massa, iaculis sed malesuada eu.",
        image: "https://img.freepik.com/free-photo/waiter-uniform-showing-ice-cream_23-2148006730.jpg?w=740&t=st=1708170000~exp=1708170600~hmac=placeholder" // Waiter holding cone
    }
];

const StorySection = () => {
    return (
        <section className="py-16 md:py-24 bg-white font-['Poppins']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
                        Story <span className="text-[#E65555]">Around Us</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Maecenas nibh lorem, imperdiet a sollicitudin rhoncus, commodo non erat. Suspendisse turpis tellus, pretium sit amet lacinia ut.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: story.id * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Date Badge */}
                                <div className="absolute bottom-0 left-4 bg-[#E65555] text-white p-3 text-center min-w-[60px]">
                                    <div className="text-xl font-bold leading-none">{story.date}</div>
                                    <div className="text-xs font-medium uppercase">{story.month}</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#E65555] transition-colors duration-300">
                                    {story.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {story.description}
                                </p>
                                <a href="#" className="text-[#E65555] font-medium text-sm mt-auto hover:text-[#d14040] transition-colors inline-block tracking-wide">
                                    read more
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StorySection;

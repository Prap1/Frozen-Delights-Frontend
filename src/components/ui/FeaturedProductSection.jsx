import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeaturedProductSection = ({ items }) => {
  const navigate = useNavigate();
  const productsToDisplay = items && items.length > 0 ? items : [];

  if (productsToDisplay.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white font-['Poppins']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A1A]">
            Our Featured <span className="text-[#E65555]">Product</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {productsToDisplay.slice(0, 3).map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative rounded-[32px] sm:rounded-[36px] lg:rounded-[40px] overflow-hidden hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Card */}
              <div className="
                relative 
                h-[460px] 
                sm:h-[500px] 
                lg:h-[540px] 
                bg-[#F8A8A8] 
                flex 
                flex-col 
                items-center 
                rounded-[32px] sm:rounded-[36px] lg:rounded-[40px]
                overflow-hidden
              ">

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#F8A8A8]/30 to-[#E65555]/20"></div>

                {/* Decorative Waves */}
                <div className="absolute inset-0 opacity-30">
                  <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full fill-white opacity-20 scale-150">
                    <path d="M0,100 C150,200 350,0 500,100 L500,0 L0,0 Z" />
                  </svg>
                  <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="absolute bottom-0 w-full h-1/2 fill-[#E65555] opacity-20">
                    <path d="M0,100 C150,200 350,0 500,100 L500,500 L0,500 Z" />
                  </svg>
                </div>

                {/* Product Image */}
                <div className="
                  absolute 
                  top-8 sm:top-10 lg:top-10
                  w-56 h-56 
                  sm:w-64 sm:h-64 
                  lg:w-72 lg:h-72
                  bg-white 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  shadow-md 
                  z-10 
                  transition-transform 
                  duration-300 
                  group-hover:scale-105
                ">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      product.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="w-[85%] h-[85%] object-contain rounded-full"
                  />
                </div>

                {/* Content */}
                <div className="
                  relative 
                  z-20 
                  text-center 
                  mt-[280px] 
                  sm:mt-[300px] 
                  lg:mt-[340px] 
                  px-5 sm:px-6
                ">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    $
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : product.price}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/product/${product._id || product.id}`)
                    }
                    className="
                      bg-white 
                      text-[#E65555] 
                      font-semibold 
                      text-sm 
                      py-3 
                      px-8 
                      rounded-full 
                      shadow-lg 
                      hover:shadow-xl 
                      hover:bg-gray-50 
                      transition-all 
                      transform 
                      hover:scale-105
                    "
                  >
                    Check It Now
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductSection;

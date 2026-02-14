import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice'; // Determine correct path
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const addToCartHandler = () => {
        if (product.Stock < 1) return;

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            stock: product.Stock,
            quantity: 1,
            vendor: product.vendor
        }));

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: 'Item has been added to your cart successfully!',
            timer: 1500,
            showConfirmButton: false
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative group">
            {/* Image Container with Hover Effect */}
            <div className="relative overflow-hidden aspect-w-1 aspect-h-1 h-64">
                <Link to={`/products/${product._id}`}>
                    <img
                        src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.Stock < 1 && (
                        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-full transform -rotate-12">
                                OUT OF STOCK
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Content Container */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Category & Title */}
                <div className="mb-2">
                    <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
                        {product.category}
                    </span>
                    <Link to={`/products/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 mt-1">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Ratings */}
                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className={index < Math.round(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({product.numOfReviews} Reviews)</span>
                </div>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                    </div>

                    <button
                        onClick={addToCartHandler}
                        disabled={product.Stock < 1}
                        className={`p-2 rounded-full transition-colors duration-200 shadow-sm ${product.Stock < 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                            }`}
                        title={product.Stock < 1 ? "Out of Stock" : "Add to Cart"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

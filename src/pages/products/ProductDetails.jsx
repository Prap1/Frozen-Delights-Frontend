import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, createReview, resetReviewSuccess, clearErrors } from '../../features/products/productSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Loader from '../../components/ui/Loader';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error, success: reviewSuccess, error: reviewError } = useSelector((state) => state.products);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [openReview, setOpenReview] = useState(false);

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    // Handle review success/error
    useEffect(() => {
        if (reviewError) {
            Swal.fire('Error', reviewError.message || 'Error submitting review', 'error');
            dispatch(clearErrors());
        }

        if (reviewSuccess) {
            Swal.fire('Success', 'Review Submitted Successfully', 'success');
            dispatch(resetReviewSuccess());
            setOpenReview(false);
            setRating(0);
            setComment('');
            dispatch(fetchProductDetails(id)); // Refresh details
        }
    }, [reviewSuccess, reviewError, dispatch, id]);

    const addToCartHandler = () => {
        if (product.Stock < 1) return;

        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            stock: product.Stock,
            quantity,
            vendor: product.vendor
        }));

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: 'Item has been added to your cart successfully!',
            timer: 2000,
            showConfirmButton: false
        });
    };

    const submitReviewHandler = () => {
        if (rating === 0) {
            Swal.fire('Error', 'Please select a rating', 'error');
            return;
        }
        dispatch(createReview({ rating, comment, productId: id }));
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">{error.message || 'Error loading product'}</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Image gallery */}
                    <div className="flex flex-col-reverse">
                        <div className="w-full aspect-w-1 aspect-h-1">
                            <img
                                src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/600'}
                                alt={product.name}
                                className="w-full h-full object-center object-cover sm:rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl text-gray-900">₹{product.price}</p>

                            <div className="flex items-center mt-2">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar key={index} className={index < Math.round(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-500 text-sm">({product.numOfReviews} Reviews)</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="text-base text-gray-700 space-y-6">{product.description}</div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.Stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.Stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10 flex">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-gray-700">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.Stock, quantity + 1))}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                    disabled={quantity >= product.Stock}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={addToCartHandler}
                                disabled={product.Stock < 1}
                                className={`ml-4 flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${product.Stock < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Add to bag
                            </button>
                        </div>

                        {/* Review Button */}
                        <div className="mt-8">
                            <button
                                onClick={() => setOpenReview(!openReview)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {openReview ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        </div>

                        {/* Review Form */}
                        {openReview && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Review</h3>

                                {!isAuthenticated && <p className="text-red-500 text-sm mb-2">You must be logged in to review.</p>}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`text-2xl focus:outline-none transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                    <textarea
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your experience..."
                                    ></textarea>
                                </div>
                                <button
                                    onClick={submitReviewHandler}
                                    disabled={!isAuthenticated || loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Submit Review
                                </button>
                                <p className="text-xs text-gray-500 mt-2 italic">* You can only review products you have purchased and received.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="mt-16 border-t border-gray-200 pt-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                    {product.reviews && product.reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="bg-white border text-gray-500 border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                                {review.name ? review.name[0].toUpperCase() : 'U'}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-gray-900">{review.name}</h4>
                                            <div className="flex text-yellow-400 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 italic text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url,
            stock: product.Stock,
            quantity,
            vendor: product.vendor
        }));
        alert('Item Added to Cart');
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!product) return <div className="text-center py-10">Product not found</div>;

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

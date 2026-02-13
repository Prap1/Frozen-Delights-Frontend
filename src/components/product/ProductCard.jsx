import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white group relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-60">
                <img
                    src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <div className="p-4">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/product/${product._id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
                </div>
                <div className="mt-4">
                    {/* Add to Cart button could go here, but usually on details or hover */}
                    <span className="text-sm text-blue-600 font-medium">View Details &rarr;</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

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
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">View Details &rarr;</span>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            // Dispatch add to compare
                            import('../../features/products/compareSlice').then(({ addToCompare }) => {
                                import('../../app/store').then(({ store }) => {
                                    store.dispatch(addToCompare(product));
                                    alert("Added to Compare");
                                });
                            });
                        }}
                        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 text-gray-700 z-10 relative"
                    >
                        Compare
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCompare } from '../../features/products/compareSlice';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleCompare = (e) => {
        e.preventDefault();
        dispatch(addToCompare(product));
        Swal.fire({
            title: 'Added to Compare',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    };

    return (
        <div className="bg-white group relative rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-60">
                <img
                    src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <div className="p-2 md:p-4">
                <div className="flex justify-between flex-col md:flex-row">
                    <div>
                        <h3 className="text-sm md:text-lg font-medium text-gray-900 truncate">
                            <Link to={`/product/${product._id}`}>
                                <span aria-hidden="true" className="absolute inset-0" />
                                {product.name}
                            </Link>
                        </h3>
                        <p className="mt-1 text-xs md:text-sm text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm md:text-lg font-medium text-gray-900 mt-1 md:mt-0">₹{product.price}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs md:text-sm text-blue-600 font-medium group-hover:underline">View Details &rarr;</span>
                    <button
                        onClick={handleCompare}
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

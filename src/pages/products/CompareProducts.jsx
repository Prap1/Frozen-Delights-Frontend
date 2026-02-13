import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCompare } from '../../features/products/compareSlice';

const CompareProducts = () => {
    const dispatch = useDispatch();
    const { compareItems } = useSelector((state) => state.compare);

    const removeItem = (id) => {
        dispatch(removeFromCompare(id));
    };

    if (compareItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900">No products to compare</h2>
                <Link to="/products" className="mt-4 text-blue-600 hover:text-blue-500">View Products</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Compare Products</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-4 px-6 text-left font-semibold text-gray-600 w-1/5">Attribute</th>
                                {compareItems.map((item) => (
                                    <th key={item._id} className="py-4 px-6 text-center font-semibold text-gray-900 w-1/5 min-w-[200px]">
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={item.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="h-32 w-32 object-cover rounded-md mb-2"
                                            />
                                            <Link to={`/product/${item._id}`} className="text-blue-600 hover:underline">
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                {/* Fill empty columns if less than 4 items to maintain layout, optional */}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <th key={`empty-${index}`} className="py-4 px-6 w-1/5 hidden md:table-cell"></th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-4 px-6 font-medium text-gray-900 bg-gray-50">Price</td>
                                {compareItems.map((item) => (
                                    <td key={`price-${item._id}`} className="py-4 px-6 text-center text-gray-700">
                                        ₹{item.price}
                                    </td>
                                ))}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <td key={`empty-price-${index}`} className="hidden md:table-cell"></td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-6 font-medium text-gray-900 bg-gray-50">Category</td>
                                {compareItems.map((item) => (
                                    <td key={`cat-${item._id}`} className="py-4 px-6 text-center text-gray-700">
                                        {item.category}
                                    </td>
                                ))}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <td key={`empty-cat-${index}`} className="hidden md:table-cell"></td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-6 font-medium text-gray-900 bg-gray-50">Rating</td>
                                {compareItems.map((item) => (
                                    <td key={`rating-${item._id}`} className="py-4 px-6 text-center text-yellow-500 font-bold">
                                        {item.rating || 'N/A'} ★
                                    </td>
                                ))}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <td key={`empty-rating-${index}`} className="hidden md:table-cell"></td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-6 font-medium text-gray-900 bg-gray-50">Description</td>
                                {compareItems.map((item) => (
                                    <td key={`desc-${item._id}`} className="py-4 px-6 text-center text-gray-600 text-sm">
                                        {item.description && item.description.length > 100
                                            ? item.description.substring(0, 100) + '...'
                                            : item.description}
                                    </td>
                                ))}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <td key={`empty-desc-${index}`} className="hidden md:table-cell"></td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-4 px-6 font-medium text-gray-900 bg-gray-50">Availability</td>
                                {compareItems.map((item) => (
                                    <td key={`stock-${item._id}`} className={`py-4 px-6 text-center font-bold ${item.Stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.Stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </td>
                                ))}
                                {[...Array(4 - compareItems.length)].map((_, index) => (
                                    <td key={`empty-stock-${index}`} className="hidden md:table-cell"></td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompareProducts;

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import Loader from '../../components/ui/Loader';
import ProductCard from '../../components/product/ProductCard';
import { useState, useEffect } from 'react';

const categories = [
    "Ice Cream",
    "Sorbet",
    "Gelato",
    "Frozen Yogurt",
    "Popsicle",
    "Dessert Bar"
];

const ProductList = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState([0, 25000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ratings, setRatings] = useState(0);

    // Debounce keyword search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchProducts({ keyword, currentPage, price, category, ratings }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, keyword, currentPage, price, category, ratings]);

    // Handlers
    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Frozen Delights</h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Browse our collection of premium frozen desserts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
                        <h3 className="text-lg font-bold mb-4">Filters</h3>

                        {/* Search */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Categories</h4>
                            <ul className="space-y-2">
                                <li
                                    className={`cursor-pointer ${category === "" ? "font-bold text-blue-600" : "text-gray-600"}`}
                                    onClick={() => setCategory("")}
                                >
                                    All
                                </li>
                                {categories.map((cat) => (
                                    <li
                                        key={cat}
                                        className={`cursor-pointer ${category === cat ? "font-bold text-blue-600" : "text-gray-600 hover:text-blue-500"}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Price Range</h4>
                            {/* Simple Inputs for now to avoid slider dependency issues if any */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    className="w-20 border border-gray-300 rounded p-1"
                                    value={price[0]}
                                    onChange={(e) => setPrice([Number(e.target.value), price[1]])}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="w-20 border border-gray-300 rounded p-1"
                                    value={price[1]}
                                    onChange={(e) => setPrice([price[0], Number(e.target.value)])}
                                />
                            </div>
                        </div>

                        {/* Reset */}
                        <button
                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
                            onClick={() => {
                                setKeyword("");
                                setCategory("");
                                setPrice([0, 25000]);
                                setRatings(0);
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div className="md:col-span-3">
                        {products && products.length > 0 ? (
                            <div className="grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No products found matching your criteria.
                            </div>
                        )}

                        {/* Pagination (Simple Next/Prev for now) */}
                        {resultPerPage < filteredProductsCount && (
                            <div className="mt-8 flex justify-center space-x-4">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">Page {currentPage}</span>
                                <button
                                    disabled={products.length < resultPerPage} // Rough estimate or use logic from filteredProductsCount
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className={`px-4 py-2 border rounded-md ${products.length < resultPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;

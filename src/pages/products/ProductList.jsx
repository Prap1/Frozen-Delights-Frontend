import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import Loader from '../../components/ui/Loader';

const ProductList = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Frozen Delights</h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Browse our collection of premium frozen desserts.
                    </p>
                </div>

                <div className="mt-12 grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;

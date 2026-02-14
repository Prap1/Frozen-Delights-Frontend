import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../features/products/productSlice';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';
import { resetProductState } from '../../features/products/productSlice';

const NewArrivals = () => {
    const dispatch = useDispatch();
    const productState = useSelector((state) => state.products);
    const { items: products, loading, error } = productState || {};

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(resetProductState());
        }
        dispatch(fetchProducts());
    }, [dispatch, error]);

    // Mock new arrivals by sorting by createdAt desc (if available) or just reversing
    const newArrivalProducts = products ? [...products].filter(p => p.Stock >= 1).reverse().slice(0, 8) : [];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">New Arrivals</h2>
                <p className="text-center text-gray-500 mb-12">The latest additions to our collection.</p>

                {loading ? (
                    <Loader />
                ) : (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {newArrivalProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewArrivals;

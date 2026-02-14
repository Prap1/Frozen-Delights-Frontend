import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, resetProductState } from '../../features/products/productSlice';
import { toast } from 'react-toastify';

const ProductForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading, error: productError, success } = useSelector((state) => state.products);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        Stock: '',
        image: '' // URL for simplicity
    });

    useEffect(() => {
        if (success) {
            toast.success('Product Created Successfully');
            dispatch(resetProductState());
            if (user?.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/admin/products');
            }
        }
        if (productError) {
            toast.error(productError);
            dispatch(resetProductState());
        }
    }, [success, productError, dispatch, navigate, user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const productData = {
            ...formData,
            images: [{ public_id: 'sample_id', url: formData.image }]
        };

        dispatch(createProduct(productData));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" name="category" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" name="Stock" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="image" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;

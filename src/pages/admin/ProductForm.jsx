import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProductForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        Stock: '',
        image: '' // URL for simplicity
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const productData = {
                ...formData,
                images: [{ public_id: 'sample_id', url: formData.image }]
            };

            await api.post('/products/new', productData);
            alert('Product Created Successfully');
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
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
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Create Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;

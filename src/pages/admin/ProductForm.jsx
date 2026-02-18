import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct, fetchProductDetails, resetProductState } from '../../features/products/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';

const ProductForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const { user } = useSelector((state) => state.auth);
    const { loading, error: productError, success, product } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    // Reliable ID extraction
    let id = params.id;
    if (!id) {
        // Fallback: extract from URL last segment if 'edit' is in path
        const pathParts = window.location.pathname.split('/');
        if (pathParts.includes('edit')) {
            id = pathParts[pathParts.length - 1];
        }
    }
    const isEdit = !!id;

    // Local state for form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        Stock: '',
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // 1. Fetch Data on Mount (if Edit)
    useEffect(() => {
        dispatch(fetchCategories()); // Fetch categories for dropdown

        if (isEdit) {
            dispatch(fetchProductDetails(id));
        } else {
            // If create mode, we are "loaded" immediately
            setDataLoaded(true);
            dispatch(resetProductState());
        }
    }, [dispatch, id, isEdit]);

    // 2. Populate Form when Product Data Arrives
    useEffect(() => {
        if (isEdit && product && product._id === id) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                category: product.category || '',
                Stock: product.Stock || '',
            });
            if (product.images && product.images[0]) {
                setImagePreview(product.images[0].url);
            }
            setDataLoaded(true);
        }
    }, [product, isEdit, id]);

    // 3. Handle Success/Error Actions
    useEffect(() => {
        if (success) {
            toast.success(`Product ${isEdit ? 'Updated' : 'Created'} Successfully`);
            dispatch(resetProductState());
            if (user && user.role === 'vendor') {
                navigate('/vendor/products');
            } else {
                navigate('/admin/products');
            }
        }
        if (productError) {
            toast.error(productError);
            dispatch(resetProductState());
        }
    }, [success, productError, dispatch, navigate, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name", formData.name);
        myForm.set("price", formData.price);
        myForm.set("description", formData.description);
        myForm.set("category", formData.category);
        myForm.set("Stock", formData.Stock);
        if (image) {
            myForm.set("image", image);
        }

        if (isEdit) {
            dispatch(updateProduct({ id, productData: myForm }));
        } else {
            dispatch(createProduct(myForm));
        }
    };

    // Show Loader while fetching edit data
    if (isEdit && !dataLoaded) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    {isEdit ? 'Edit Product' : 'Create New Product'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        className="block w-full rounded-md border-gray-300 pl-7 py-2 px-3 focus:border-blue-500 focus:ring-blue-500 transition duration-150 ease-in-out"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-white"
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories && categories.map((cate) => (
                                        <option key={cate._id} value={cate.name}>
                                            {cate.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    name="Stock"
                                    required
                                    value={formData.Stock}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    rows="10"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-48 object-cover rounded-md" />
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*, .jpeg, .jpg, .png, .webp"
                                                    className="sr-only"
                                                    required={!isEdit}
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                                transition duration-150 ease-in-out`}
                        >
                            {loading && isEdit && !dataLoaded ? 'Loading Data...' : (loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchProducts, createProduct, deleteProduct, resetProductState } from '../../features/products/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { items: products, loading, success } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('AdminProducts State:', { products, loading, success });
    console.log('Categories:', categories);

    // React Hook Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setIsModalOpen(false);
            reset();
            dispatch(resetProductState());
        }
    }, [success, reset, dispatch]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', data.price);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('Stock', data.stock);
        if (data.image[0]) {
            formData.append('image', data.image[0]);
        }
        dispatch(createProduct(formData));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.images && row.images[0] ? row.images[0].url : '',
            cell: row => (
                <img
                    src={row.images && row.images[0] ? row.images[0].url : 'https://via.placeholder.com/50'}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-md"
                />
            ),
            width: '80px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
            format: row => `$${row.price.toFixed(2)}`,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Stock',
            selector: row => row.Stock,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#f3f4f6',
            },
        },
    };

    if (loading && products.length === 0) return <Loader />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={products}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>

            {/* Add Product Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('price', { required: 'Price is required', min: 0 })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.price && <span className="text-red-500 text-xs">{errors.price.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            {...register('category', { required: 'Category is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input
                            type="number"
                            {...register('stock', { required: 'Stock is required', min: 0 })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.stock && <span className="text-red-500 text-xs">{errors.stock.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register('image')}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminProducts;

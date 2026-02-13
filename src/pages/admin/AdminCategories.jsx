import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, deleteCategory, clearCategoryMessage } from '../../features/categories/categorySlice';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const { categories, loading, message } = useSelector((state) => state.categories);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            setIsModalOpen(false);
            reset();
            setTimeout(() => dispatch(clearCategoryMessage()), 3000);
        }
    }, [message, dispatch, reset]);

    const onSubmit = (data) => {
        dispatch(createCategory(data));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            dispatch(deleteCategory(id));
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
            grow: 2,
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
                        className="p-2 text-red-600 hover:text-red-800 transition-colors">
                        <FaTrash />
                    </button>
                </div>
            ),
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Add New Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={categories}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>

            {/* Add Category Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
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
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
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
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminCategories;

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaPlus, FaTag } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDiscounts, createDiscount, deleteDiscount, clearDiscountMessage, updateDiscount } from '../../features/discounts/discountSlice';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const VendorDiscounts = () => {
    const dispatch = useDispatch();
    const { discounts, loading, message } = useSelector((state) => state.discounts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
    const applicableTo = watch('applicableTo');

    useEffect(() => {
        dispatch(fetchVendorDiscounts());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            setIsModalOpen(false);
            reset();
            setIsEditing(false);
            setEditId(null);
            setTimeout(() => dispatch(clearDiscountMessage()), 3000);
        }
    }, [message, dispatch, reset]);

    const onSubmit = (data) => {
        if (isEditing) {
            dispatch(updateDiscount({ id: editId, discountData: data }));
        } else {
            dispatch(createDiscount(data));
        }
    };

    const handleEdit = (discount) => {
        setIsEditing(true);
        setEditId(discount._id);
        setValue('code', discount.code);
        setValue('percentage', discount.percentage);
        setValue('expiryDate', new Date(discount.expiryDate).toISOString().split('T')[0]);
        setValue('applicableTo', discount.applicableTo);
        setValue('minOrderValue', discount.minOrderValue);

        if (discount.applicableTo === 'product' || discount.applicableTo === 'category') {
            setValue('targetId', discount.targetId);
        }

        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDiscount(id));
                Swal.fire(
                    'Deleted!',
                    'Discount has been deleted.',
                    'success'
                )
            }
        })
    };

    const columns = [
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'Percentage',
            selector: row => row.percentage,
            sortable: true,
            format: row => `${row.percentage}%`,
        },
        {
            name: 'Expiry Date',
            selector: row => new Date(row.expiryDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Applicable To',
            selector: row => row.applicableTo,
            sortable: true,
            format: row => row.applicableTo ? row.applicableTo.charAt(0).toUpperCase() + row.applicableTo.slice(1).replace('_', ' ') : 'All',
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
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
                <h1 className="text-2xl font-bold text-gray-800">My Discounts</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Add New Discount
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={discounts}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    progressComponent={<Loader />}
                    noDataComponent={
                        <div className="p-12 text-center">
                            <FaTag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No Discounts Yet</h3>
                            <p className="mt-2 text-gray-500">Create coupons to boost your sales.</p>
                        </div>
                    }
                />
            </div>

            {/* Add/Edit Discount Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? "Edit Discount" : "Add New Discount"}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code</label>
                        <input
                            {...register('code', { required: 'Code is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            placeholder="e.g. SUMMER2024"
                        />
                        {errors.code && <span className="text-red-500 text-xs">{errors.code.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Percentage</label>
                        <input
                            type="number"
                            {...register('percentage', { required: 'Percentage is required', min: 1, max: 100 })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            placeholder="10"
                        />
                        {errors.percentage && <span className="text-red-500 text-xs">{errors.percentage.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            {...register('expiryDate', { required: 'Expiry date is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                        {errors.expiryDate && <span className="text-red-500 text-xs">{errors.expiryDate.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Applicable To</label>
                        <select
                            {...register('applicableTo')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="all">All Orders</option>
                            <option value="product">Specific Product</option>
                            <option value="category">Specific Category</option>
                        </select>
                    </div>

                    {(applicableTo === 'product' || applicableTo === 'category') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {applicableTo === 'product' ? 'Product ID' : 'Category ID'}
                            </label>
                            <input
                                {...register('targetId', { required: 'Target ID is required' })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                placeholder={`Enter ${applicableTo} ID`}
                            />
                            {errors.targetId && <span className="text-red-500 text-xs">{errors.targetId.message}</span>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Minimum Order Value</label>
                        <input
                            type="number"
                            {...register('minOrderValue', { min: 0 })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            placeholder="0"
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
                            {loading ? 'Saving...' : (isEditing ? 'Update Discount' : 'Save Discount')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VendorDiscounts;

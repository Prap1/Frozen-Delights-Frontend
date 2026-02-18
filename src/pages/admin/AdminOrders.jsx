import { useEffect, useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllOrders, deleteOrder, updateOrder, resetUpdateStatus } from '../../features/orders/orderSlice';
import api from '../../services/api';
import { clearErrors } from '../../features/orders/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, loading, error, updateLoading, isUpdated } = useSelector((state) => state.orders);
    const [filterText, setFilterText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Return Review State
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
    const [returnActionLoading, setReturnActionLoading] = useState(false);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('Order Status Updated Successfully');
            dispatch(resetUpdateStatus());
        }

        dispatch(fetchAllOrders());
    }, [dispatch, error, isUpdated]);

    const deleteOrderHandler = (id) => {
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
                dispatch(deleteOrder(id));
                Swal.fire(
                    'Deleted!',
                    'Order has been deleted.',
                    'success'
                )
            }
        })
    };

    const updateStatusHandler = (id, status) => {
        dispatch(updateOrder({ id, status }));
    };

    const handleResolveReturn = (order) => {
        console.log("Selected Return Order:", order);
        console.log("User Data:", order.user);
        setSelectedReturnOrder(order);
        setReturnModalOpen(true);
    };

    const handleReturnAction = async (status) => {
        try {
            setReturnActionLoading(true);
            await api.put(`/orders/admin/${selectedReturnOrder._id}/return`, { status });

            setReturnActionLoading(false);
            setReturnModalOpen(false);
            setSelectedReturnOrder(null);

            Swal.fire('Success', `Return request ${status.toLowerCase()} successfully`, 'success');
            dispatch(fetchAllOrders());

        } catch (error) {
            setReturnActionLoading(false);
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update return status');
        }
    };

    // Filter Logic
    const filteredOrders = orders ? orders.filter(item => {
        const searchText = filterText.toLowerCase();
        const idMatch = item._id && String(item._id).toLowerCase().includes(searchText);
        const userMatch = item.user && item.user.username && item.user.username.toLowerCase().includes(searchText);
        // Also allow searching by product names within the order
        const productMatch = item.orderItems && item.orderItems.some(i => i.name && i.name.toLowerCase().includes(searchText));

        const statusMatch = statusFilter ? item.orderStatus === statusFilter : true;

        return (idMatch || userMatch || productMatch) && statusMatch;
    }) : [];



    const columns = [
        {
            name: 'User',
            selector: row => row.user?.username || 'N/A',
            sortable: true,
            grow: 1,
            minWidth: '100px',
        },
        {
            name: 'Delivery Address',
            selector: row => row.shippingInfo?.address,
            sortable: false,
            cell: row => (
                <div className="text-xs py-1">
                    <p className="font-medium">{row.shippingInfo?.address}</p>
                    <p>{row.shippingInfo?.city}, {row.shippingInfo?.state} - {row.shippingInfo?.pinCode}</p>
                    <p className="text-gray-500">Ph: {row.shippingInfo?.phoneNo}</p>
                </div>
            ),
            grow: 2,
            minWidth: '200px',
        },
        {
            name: 'Items',
            selector: row => row.orderItems.map(i => i.name).join(', '),
            sortable: false,
            cell: row => (
                <div className="truncate" title={row.orderItems.map(i => i.name).join(', ')}>
                    {row.orderItems.map(i => i.name).join(', ')}
                </div>
            ),
            grow: 2,
            minWidth: '200px',
        },
        {
            name: 'Status',
            selector: row => row.orderStatus,
            sortable: true,
            cell: row => {
                const isFinalStatus = row.orderStatus === 'Delivered' || row.orderStatus === 'Cancelled' || row.orderStatus === 'Returned';

                if (row.orderStatus === 'Cancelled') {
                    return <span className="bg-red-100 text-red-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">Cancelled</span>;
                }
                if (row.orderStatus === 'Returned') {
                    return <span className="bg-orange-100 text-orange-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">Returned</span>;
                }

                if (row.orderStatus === 'Return Requested') {
                    return (
                        <button
                            onClick={() => handleResolveReturn(row)}
                            className="bg-yellow-100 text-yellow-800 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full hover:bg-yellow-200 cursor-pointer border border-yellow-300"
                        >
                            Review Return
                        </button>
                    );
                }

                return (
                    <select
                        value={row.orderStatus}
                        onChange={(e) => updateStatusHandler(row._id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-none focus:ring-0 cursor-pointer ${row.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                            row.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                row.orderStatus === 'Out For Delivery' ? 'bg-purple-100 text-purple-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}
                        disabled={row.orderStatus === 'Delivered'}
                    >
                        <option value="Processing" className="bg-white text-gray-800">Processing</option>
                        <option value="Shipped" className="bg-white text-gray-800">Shipped</option>
                        <option value="Out For Delivery" className="bg-white text-gray-800">Out for Delivery</option>
                        <option value="Delivered" className="bg-white text-gray-800">Delivered</option>
                        <option value="Returned" className="bg-white text-gray-800">Returned</option>
                    </select>
                );
            },
            minWidth: '160px',
        },
        {
            name: 'Qty',
            selector: row => row.orderItems.length,
            sortable: true,
            width: '80px',
            center: true,
        },
        {
            name: 'Amount',
            selector: row => row.totalPrice,
            sortable: true,
            format: row => `₹${row.totalPrice.toFixed(2)}`,
            width: '120px',
        },
        {
            name: 'Date',
            selector: row => row.createdAt,
            sortable: true,
            format: row => new Date(row.createdAt).toLocaleDateString(),
            width: '120px',
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex items-center justify-center space-x-2 w-full">
                    {/* <Link to={`/order/${row._id}`} className="text-indigo-600 hover:text-indigo-900 p-1" title="View Details">
                        <FaEye size={18} />
                    </Link> */}
                    <button onClick={() => deleteOrderHandler(row._id)} className="text-red-600 hover:text-red-900 p-1" title="Delete">
                        <FaTrash size={18} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '100px',
            center: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 'bold',
                backgroundColor: '#f9fafb',
                color: '#374151',
            },
        },
        rows: {
            style: {
                fontSize: '13px',
                minHeight: '60px',
            },
        },
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar is handled in App.jsx layout */}

            <div className="flex-1 overflow-auto relative">
                {updateLoading && (
                    <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
                        <Loader />
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">All Orders</h1>

                        {/* Filter & Search */}
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Returned">Returned</option>
                            </select>

                            <div className="flex items-center w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search ID, User, or Item..."
                                    className="border border-gray-300 rounded-l-md px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterText}
                                    onChange={e => {
                                        setFilterText(e.target.value);
                                        setResetPaginationToggle(!resetPaginationToggle);
                                    }}
                                />
                                <button
                                    className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-4 py-2 hover:bg-gray-200 transition-colors text-gray-600 font-medium whitespace-nowrap"
                                    onClick={() => {
                                        if (filterText) {
                                            setResetPaginationToggle(!resetPaginationToggle);
                                            setFilterText('');
                                        }
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                        <DataTable
                            columns={columns}
                            data={filteredOrders}
                            pagination
                            paginationResetDefaultPage={resetPaginationToggle}
                            persistTableHead
                            progressPending={loading}
                            progressComponent={<Loader />}
                            customStyles={customStyles}
                            highlightOnHover
                            pointerOnHover
                            responsive
                            noDataComponent={<div className="p-8 text-center text-gray-500">No orders found matching your search.</div>}
                        />
                    </div>
                </div>
            </div>

            {/* Return Request Modal */}
            {returnModalOpen && selectedReturnOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Review Return Request</h2>
                            <button onClick={() => setReturnModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Order Details */}
                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="font-semibold text-lg mb-2">Order Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Order ID:</p>
                                        <p className="font-medium">{selectedReturnOrder._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">User:</p>
                                        <p className="font-medium">{selectedReturnOrder.user?.username || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Order Date:</p>
                                        <p className="font-medium">{new Date(selectedReturnOrder.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total Amount:</p>
                                        <p className="font-medium">₹{selectedReturnOrder.totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Return Reason & Description */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Return Details</h3>
                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded space-y-3">
                                    <div>
                                        <span className="font-bold text-gray-700 block mb-1">Reason:</span>
                                        <span className="bg-white px-2 py-1 rounded border border-gray-200 inline-block font-medium">
                                            {selectedReturnOrder.returnRequest?.reason}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-700 block mb-1">Description:</span>
                                        <p className="bg-white p-3 rounded border border-gray-200 text-gray-700 min-h-[60px]">
                                            {selectedReturnOrder.returnRequest?.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Proof Images */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Proof Images</h3>
                                {selectedReturnOrder.returnRequest?.images && selectedReturnOrder.returnRequest.images.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedReturnOrder.returnRequest.images.map((img, index) => (
                                            <a
                                                key={index}
                                                href={img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}/${img}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block hover:opacity-75 transition-opacity border rounded overflow-hidden h-32"
                                            >
                                                <img
                                                    src={img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}/${img}`}
                                                    alt={`Proof ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No images uploaded.</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => handleReturnAction('Rejected')}
                                    disabled={returnActionLoading}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium transition-colors disabled:opacity-50"
                                >
                                    Reject Return
                                </button>
                                <button
                                    onClick={() => handleReturnAction('Approved')}
                                    disabled={returnActionLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium transition-colors shadow-sm disabled:opacity-50"
                                >
                                    Approve Return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllOrders, deleteOrder, updateOrder, resetUpdateStatus } from '../../features/orders/orderSlice';
import { clearErrors } from '../../features/orders/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orders, loading, error, updateLoading, isUpdated } = useSelector((state) => state.orders);

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
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Orders</h1>

                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items Qty
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders && orders.map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order._id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {order.orderItems.map(item => item.name).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.orderStatus === 'Cancelled' ? (
                                                    <span className="bg-red-100 text-red-800 px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                                        Cancelled
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => updateStatusHandler(order._id, e.target.value)}
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border-none focus:ring-0 cursor-pointer ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        disabled={order.orderStatus === 'Delivered'}
                                                    >
                                                        <option value="Processing" className="bg-white text-gray-800">Processing</option>
                                                        <option value="Shipped" className="bg-white text-gray-800">Shipped</option>
                                                        <option value="Delivered" className="bg-white text-gray-800">Delivered</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.orderItems.length}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₹{order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-4">
                                                    <Link to={`/admin/order/${order._id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit/View">
                                                        <FaEdit size={20} />
                                                    </Link>
                                                    <button onClick={() => deleteOrderHandler(order._id)} className="text-red-600 hover:text-red-900" title="Delete">
                                                        <FaTrash size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;

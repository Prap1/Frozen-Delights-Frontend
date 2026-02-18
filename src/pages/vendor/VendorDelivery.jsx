import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaTruck, FaCheckCircle, FaClipboardList } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorOrders, updateOrder } from '../../features/orders/orderSlice';
import Loader from '../../components/ui/Loader';
import Swal from 'sweetalert2';

const VendorDelivery = () => {
    const dispatch = useDispatch();
    const { vendorOrders: orders, loading } = useSelector((state) => state.orders);
    const [activeOrders, setActiveOrders] = useState([]);

    useEffect(() => {
        dispatch(fetchVendorOrders());
    }, [dispatch]);

    useEffect(() => {
        if (orders) {
            // Filter only active orders (Processing, Shipped, Out For Delivery)
            const active = orders.filter(
                o => o.orderStatus === 'Processing' || o.orderStatus === 'Shipped' || o.orderStatus === 'Out For Delivery'
            );
            setActiveOrders(active);
        }
    }, [orders]);

    const handleStatusUpdate = (id, currentStatus) => {
        const nextStatus = currentStatus === 'Processing' ? 'Shipped'
            : currentStatus === 'Shipped' ? 'Out For Delivery'
                : 'Delivered';

        Swal.fire({
            title: 'Update Status?',
            text: `Change status from ${currentStatus} to ${nextStatus}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Update'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateOrder({ id, orderData: { status: nextStatus } }));
            }
        });
    };

    const columns = [
        {
            name: 'Order ID',
            selector: row => row._id,
            sortable: true,
            width: '200px',
        },
        {
            name: 'Customer',
            selector: row => row.shippingInfo?.address || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row.orderStatus,
            sortable: true,
            cell: row => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${row.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        row.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                    {row.orderStatus}
                </span>
            ),
        },
        {
            name: 'Items',
            selector: row => row.orderItems.length,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <button
                    onClick={() => handleStatusUpdate(row._id, row.orderStatus)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                >
                    <FaCheckCircle />
                    {row.orderStatus === 'Processing' ? 'Ship'
                        : row.orderStatus === 'Shipped' ? 'Deliver'
                            : 'Complete'}
                </button>
            ),
            button: true,
            width: '120px'
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

    if (loading && orders.length === 0) return <Loader />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Delivery Management</h1>
                <p className="text-gray-600 mt-2">Track and update status of active orders.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={activeOrders}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    progressComponent={<Loader />}
                    noDataComponent={
                        <div className="p-12 text-center">
                            <FaTruck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No Active Deliveries</h3>
                            <p className="mt-2 text-gray-500">All orders are processed or none have been received.</p>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default VendorDelivery;

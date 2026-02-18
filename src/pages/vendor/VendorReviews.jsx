import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaStar, FaComment } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorReviews, resetReviewState } from '../../features/reviews/reviewSlice';
import Loader from '../../components/ui/Loader';

const VendorReviews = () => {
    const dispatch = useDispatch();
    const { reviews, loading, success } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchVendorReviews());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            dispatch(resetReviewState());
        }
    }, [success, dispatch]);

    const columns = [
        {
            name: 'Product',
            selector: row => row.product?.name || 'Unknown Product',
            sortable: true,
            grow: 2,
        },
        {
            name: 'User',
            selector: row => row.user?.username || 'Unknown User',
            sortable: true,
        },
        {
            name: 'Rating',
            selector: row => row.rating,
            sortable: true,
            cell: row => (
                <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                        <FaStar key={index} className={index < row.rating ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                </div>
            ),
        },
        {
            name: 'Comment',
            selector: row => row.comment,
            wrap: true,
            grow: 3,
        },
        {
            name: 'Date',
            selector: row => new Date(row.createdAt).toLocaleDateString(),
            sortable: true,
            width: '120px',
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

    if (loading && reviews.length === 0) return <Loader />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>
                <p className="text-gray-600 mt-2">See what customers are saying about your products.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={reviews}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    noDataComponent={
                        <div className="p-12 text-center">
                            <FaComment className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No Reviews Yet</h3>
                            <p className="mt-2 text-gray-500">Reviews for your products will appear here.</p>
                        </div>
                    }
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>
        </div>
    );
};

export default VendorReviews;

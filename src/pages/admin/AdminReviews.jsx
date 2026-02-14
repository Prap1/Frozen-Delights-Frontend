import { useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaTrash, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews, deleteReview, resetReviewState } from '../../features/reviews/reviewSlice';
import Loader from '../../components/ui/Loader';

const AdminReviews = () => {
    const dispatch = useDispatch();
    const { reviews, loading, success } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchAllReviews());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            dispatch(resetReviewState());
        }
    }, [success, dispatch]);

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
                dispatch(deleteReview(id));
                Swal.fire(
                    'Deleted!',
                    'Review has been deleted.',
                    'success'
                )
            }
        })
    };

    const columns = [
        {
            name: 'User',
            selector: row => row.user?.username || 'Unknown User',
            sortable: true,
        },
        {
            name: 'Product',
            selector: row => row.product?.name || 'Unknown Product',
            sortable: true,
            grow: 2,
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
        {
            name: 'Actions',
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Remove Review"
                >
                    <FaTrash />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '80px',
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
                <h1 className="text-2xl font-bold text-gray-800">Feedback & Review Management</h1>
                <p className="text-gray-600 mt-2">View customer feedback, analyze satisfaction, and manage reviews.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={reviews}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    noDataComponent={<div className="p-8 text-center text-gray-500">No reviews found.</div>}
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>
        </div>
    );
};

export default AdminReviews;

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, resetProductState, fetchVendorProducts } from '../../features/products/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import Loader from '../../components/ui/Loader';

const VendorProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading, success } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchVendorProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            dispatch(resetProductState());
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
                dispatch(deleteProduct(id));
                Swal.fire(
                    'Deleted!',
                    'Product has been deleted.',
                    'success'
                )
            }
        })
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.images && row.images[0] ? row.images[0].url : '',
            cell: row => (
                <div className="py-1">
                    <img
                        src={row.images && row.images[0] ? row.images[0].url : 'https://via.placeholder.com/50'}
                        alt={row.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    />
                </div>
            ),
            width: '100px',
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
                    <button
                        onClick={() => navigate(`/vendor/product/edit/${row._id}`)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
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
                <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
                <button
                    onClick={() => navigate('/vendor/product/new')}
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
        </div>
    );
};

export default VendorProductList;

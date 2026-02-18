import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaPlus, FaUserShield, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchAllUsers, deleteUser, updateUserRole, clearUserMessage, toggleBlockUser } from '../../features/users/userSlice';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading, message } = useSelector((state) => state.users);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            setIsModalOpen(false);
            reset();
            setEditingUser(null);
            setTimeout(() => dispatch(clearUserMessage()), 3000); // Clear message after 3s
        }
    }, [message, reset, dispatch]);

    const handleEdit = (user) => {
        setEditingUser(user);
        setValue('role', user.role);
        setIsModalOpen(true);
    };

    const onSubmit = (data) => {
        if (editingUser) {
            dispatch(updateUserRole({ id: editingUser._id, role: data.role }));
        } else {
            // Logic for creating new user if API supports it
            // For now, just close modal
            setIsModalOpen(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(id));
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                )
            }
        })
    };

    const handleBlock = (user) => {
        Swal.fire({
            title: `Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#eab308', // yellow-500
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${user.isBlocked ? 'unblock' : 'block'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(toggleBlockUser(user._id));
            }
        })
    };


    const columns = [
        {
            name: 'Name',
            selector: row => row.username || row.name, // Handle difference in API field naming
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${row.role === 'admin' ? 'bg-red-100 text-red-800' :
                        row.role === 'vendor' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'}`}>
                    {row.role.toUpperCase()}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleBlock(row)}
                        className={`p-2 transition-colors ${row.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-yellow-600 hover:text-yellow-800'}`}
                        title={row.isBlocked ? "Unblock User" : "Block User"}
                    >
                        {row.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                    </button>
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors" title="Edit Role"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors" title="Delete"
                    >
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
                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                {/* <button onClick={() => { setEditingUser(null); reset(); setIsModalOpen(true); }} className="bg-blue-600 ...">Add User</button> */}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={users}
                    pagination
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>

            {/* Edit User Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Edit User Role" : "Add New User"}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {editingUser && (
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Editing: <span className="font-semibold">{editingUser.username || editingUser.name}</span></p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            {...register('role', { required: 'Role is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}
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
                            {loading ? 'Updating...' : 'Update Role'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminUsers;

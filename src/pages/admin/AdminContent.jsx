import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaTrash, FaEdit, FaPlus, FaImage, FaBullhorn } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    fetchAllBanners, createBanner, updateBanner, deleteBanner,
    fetchAllContent, createContent, updateContent, deleteContent,
    resetContentState
} from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';

const AdminContent = () => {
    const dispatch = useDispatch();
    const { banners, contentItems, loading, success } = useSelector((state) => state.content);
    const [activeTab, setActiveTab] = useState('banners');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        dispatch(fetchAllBanners());
        dispatch(fetchAllContent());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            setIsModalOpen(false);
            setEditingItem(null);
            reset();
            dispatch(resetContentState());
        }
    }, [success, dispatch, reset]);

    const openModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            Object.keys(item).forEach(key => setValue(key, item[key]));
        } else {
            reset();
            // Default type for content tab
            if (activeTab === 'content') setValue('type', 'announcement');
        }
        setIsModalOpen(true);
    };

    const onSubmit = (data) => {
        if (activeTab === 'banners') {
            if (editingItem) {
                dispatch(updateBanner({ id: editingItem._id, bannerData: data }));
            } else {
                dispatch(createBanner(data));
            }
        } else {
            if (editingItem) {
                dispatch(updateContent({ id: editingItem._id, contentData: data }));
            } else {
                dispatch(createContent(data));
            }
        }
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
                if (activeTab === 'banners') {
                    dispatch(deleteBanner(id));
                } else {
                    dispatch(deleteContent(id));
                }
                Swal.fire(
                    'Deleted!',
                    'Item has been deleted.',
                    'success'
                )
            }
        })
    };

    // Columns for Banners
    const bannerColumns = [
        { name: 'Order', selector: row => row.order, sortable: true, width: '80px' },
        {
            name: 'Image',
            cell: row => <img src={row.image} alt={row.title} className="h-10 w-16 object-cover rounded my-1" />,
            width: '100px'
        },
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Subtitle', selector: row => row.subtitle, wrap: true },
        { name: 'Link', selector: row => row.link },
        {
            name: 'Status',
            selector: row => row.isActive ? 'Active' : 'Inactive',
            sortable: true,
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => openModal(row)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </div>
            )
        }
    ];

    // Columns for Content
    const contentColumns = [
        { name: 'Type', selector: row => row.type, sortable: true, width: '120px' },
        { name: 'Title/Question', selector: row => row.title, sortable: true },
        { name: 'Category', selector: row => row.subtitle || '-', sortable: true, width: '150px' },
        { name: 'Content/Answer', selector: row => row.content, wrap: true },
        {
            name: 'Status',
            selector: row => row.isActive ? 'Active' : 'Inactive',
            sortable: true,
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            name: 'Actions',
            cell: row => (
                <div className="flex space-x-2">
                    <button onClick={() => openModal(row)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
                    <p className="text-gray-600 mt-2">Manage homepage banners, announcements, and site content.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            if (!window.confirm("This will add default FAQs to your database. Continue?")) return;

                            const defaultFAQs = [
                                { type: 'faq', title: 'How can I track my order?', content: 'You can track your order status in the "My Orders" section. Once shipped, you will receive an SMS and email with tracking details.', subtitle: 'Delivery related', isActive: true },
                                { type: 'faq', title: 'What is the return policy?', content: 'Most items can be returned within 7 days of delivery if they are unused and in original packaging.', subtitle: 'Returns & Pickup', isActive: true },
                                { type: 'faq', title: 'How can I pay for my order?', content: 'We accept Credit/Debit cards, Net Banking, UPI, and Cash on Delivery (COD).', subtitle: 'Payment', isActive: true },
                                { type: 'faq', title: 'I forgot my password, how do I reset it?', content: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.', subtitle: 'Login and my account', isActive: true },
                                { type: 'faq', title: 'Can I cancel my order?', content: 'You can cancel your order before it has been shipped from the "My Orders" section.', subtitle: 'Cancellations', isActive: true },
                            ];

                            // Sequential creation to avoid overwhelming the server
                            for (const faq of defaultFAQs) {
                                await dispatch(createContent(faq));
                            }
                            // Refresh list
                            dispatch(fetchAllContent());
                            Swal.fire('Success', 'Default FAQs added!', 'success');
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                        Seed Default FAQs
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus /> Add New {activeTab === 'banners' ? 'Banner' : 'Content'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('banners')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'banners' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaImage className="inline mr-2" /> Homepage Banners
                </button>
                <button
                    onClick={() => setActiveTab('content')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaBullhorn className="inline mr-2" /> Announcements & Content
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={activeTab === 'banners' ? bannerColumns : contentColumns}
                    data={activeTab === 'banners' ? banners : contentItems}
                    pagination
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Edit' : 'Add'} ${activeTab === 'banners' ? 'Banner' : 'Content'}`}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {activeTab === 'banners' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Order</label>
                                    <input type="number" {...register('order')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" defaultValue={0} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                                <textarea {...register('subtitle', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input {...register('image', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="https://..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                                    <input {...register('cta', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Link</label>
                                    <input {...register('link', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" {...register('isActive')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                                <label className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select {...register('type', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2">
                                        <option value="announcement">Announcement</option>
                                        <option value="feature">Feature</option>
                                        <option value="about">About Section</option>
                                        <option value="faq">FAQ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Order</label>
                                    <input type="number" {...register('order')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" defaultValue={0} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {activeTab === 'content' && 'Title (Question for FAQ)'}
                                </label>
                                <input {...register('title', { required: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. How do I return an item?" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {activeTab === 'content' && 'Content (Answer for FAQ)'}
                                </label>
                                <textarea {...register('content', { required: true })} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. You can return items within 7 days..." />
                            </div>

                            {/* Subtitle field abused as Category for FAQs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category (for FAQs) / Subtitle</label>
                                <input {...register('subtitle')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. Returns & Pickup" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                                <input {...register('image')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Icon (Optional, visual only)</label>
                                <input {...register('icon')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. 🍦" />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" {...register('isActive')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                                <label className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>
                        </>
                    )}
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                        >
                            {editingItem ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminContent;

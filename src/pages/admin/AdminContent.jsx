import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaTrash, FaEdit, FaPlus, FaImage, FaBullhorn } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    fetchAllBanners, deleteBanner,
    fetchAllContent, deleteContent,
    createContent,
    resetContentState
} from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';

const AdminContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const { banners, contentItems, loading, success } = useSelector((state) => state.content);

    // Get active tab from URL or default to 'banners'
    const activeTab = searchParams.get('tab') || 'banners';

    useEffect(() => {
        dispatch(fetchAllBanners());
        dispatch(fetchAllContent());
    }, [dispatch]);

    // Handle tab change by updating URL
    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    const handleEdit = (item) => {
        const mode = activeTab === 'banners' ? 'banner' : 'content';
        navigate(`/admin/content/edit/${item._id}?mode=${mode}&tab=${activeTab}`);
    };

    const handleAdd = () => {
        const mode = activeTab === 'banners' ? 'banner' : 'content';
        navigate(`/admin/content/new?mode=${mode}&tab=${activeTab}`);
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
                    <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
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
                    <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
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
                        onClick={async () => {
                            if (!window.confirm("This will add default Privacy Policy and Terms to your database. Continue?")) return;

                            const defaultPolicies = [
                                {
                                    type: 'privacy',
                                    title: 'Privacy Policy',
                                    content: `We value the trust you place in us... (Please edit this with full content)`,
                                    isActive: true
                                },
                                {
                                    type: 'terms',
                                    title: 'Terms of Service',
                                    content: `TERMS OF SERVICE\nFrozen Delight\n... (Please edit this with full content)`,
                                    isActive: true
                                },
                            ];

                            // Sequential creation to avoid overwhelming the server
                            for (const policy of defaultPolicies) {
                                await dispatch(createContent(policy));
                            }
                            // Refresh list
                            dispatch(fetchAllContent());
                            Swal.fire('Success', 'Default Policies added!', 'success');
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        Seed Policies
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus /> Add New {activeTab === 'banners' ? 'Banner' : activeTab === 'policies' ? 'Policy' : 'Content'}
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
                <button
                    onClick={() => setActiveTab('policies')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'policies' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FaBullhorn className="inline mr-2" /> ID Policies
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable
                    columns={activeTab === 'banners' ? bannerColumns : contentColumns}
                    data={
                        activeTab === 'banners'
                            ? banners
                            : activeTab === 'policies'
                                ? contentItems.filter(item => ['privacy', 'terms'].includes(item.type))
                                : contentItems.filter(item => !['privacy', 'terms'].includes(item.type))
                    }
                    pagination
                    progressPending={loading}
                    progressComponent={<Loader />}
                />
            </div>
        </div>
    );
};

export default AdminContent;

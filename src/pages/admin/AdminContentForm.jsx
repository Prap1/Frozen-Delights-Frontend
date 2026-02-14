import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    createBanner, updateBanner,
    createContent, updateContent,
    fetchBanners, fetchAllContent,
    resetContentState
} from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';
import { FaArrowLeft } from 'react-icons/fa';

const AdminContentForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'content'; // 'banner' or 'content'
    const tab = searchParams.get('tab'); // 'banners', 'content', 'policies' - purely for navigation back

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { banners, contentItems, loading, success, error } = useSelector((state) => state.content);
    const { register, handleSubmit, setValue, reset, watch } = useForm();
    const [isEdit, setIsEdit] = useState(false);

    // Watch type to conditionally render fields
    const watchedType = watch('type');

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            if (mode === 'banner') {
                if (banners.length === 0) dispatch(fetchBanners());
                const banner = banners.find(b => b._id === id);
                if (banner) {
                    Object.keys(banner).forEach(key => setValue(key, banner[key]));
                }
            } else {
                if (contentItems.length === 0) dispatch(fetchAllContent());
                const item = contentItems.find(c => c._id === id);
                if (item) {
                    Object.keys(item).forEach(key => setValue(key, item[key]));
                }
            }
        } else {
            // Defaults for new items
            if (mode === 'content') {
                // Set default type based on previous tab if possible, or default to announcement
                if (tab === 'policies') setValue('type', 'privacy');
                else setValue('type', 'announcement');
            }
        }
    }, [id, mode, banners, contentItems, dispatch, setValue, tab]);

    useEffect(() => {
        if (success) {
            dispatch(resetContentState());
            navigate('/admin/content');
        }
    }, [success, dispatch, navigate]);

    const onSubmit = (data) => {
        if (mode === 'banner') {
            if (isEdit) {
                dispatch(updateBanner({ id, bannerData: data }));
            } else {
                dispatch(createBanner(data));
            }
        } else {
            if (isEdit) {
                dispatch(updateContent({ id, contentData: data }));
            } else {
                dispatch(createContent(data));
            }
        }
    };

    if (loading && isEdit && ((mode === 'banner' && banners.length === 0) || (mode === 'content' && contentItems.length === 0))) {
        return <Loader />;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <button
                onClick={() => navigate('/admin/content')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <FaArrowLeft className="mr-2" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEdit ? 'Edit' : 'Add New'} {mode === 'banner' ? 'Banner' : 'Content'}
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {mode === 'banner' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input {...register('title', { required: 'Title is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input type="number" {...register('order')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" defaultValue={0} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <textarea {...register('subtitle', { required: 'Subtitle is required' })} rows={3} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input {...register('image', { required: 'Image URL is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                                    <input {...register('cta', { required: 'CTA Text is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                    <input {...register('link', { required: 'Link is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select {...register('type', { required: true })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2">
                                        <option value="announcement">Announcement</option>
                                        <option value="feature">Feature</option>
                                        <option value="about">About Section</option>
                                        <option value="faq">FAQ</option>
                                        <option value="privacy">Privacy Policy</option>
                                        <option value="terms">Terms of Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                    <input type="number" {...register('order')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" defaultValue={0} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {(watchedType === 'privacy' || watchedType === 'terms') ? 'Title' : 'Title (Question for FAQ)'}
                                </label>
                                <input {...register('title', { required: 'Title is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {(watchedType === 'privacy' || watchedType === 'terms') ? 'Content (Full Text)' : 'Content (Answer for FAQ)'}
                                </label>
                                <textarea
                                    {...register('content', { required: 'Content is required' })}
                                    rows={(watchedType === 'privacy' || watchedType === 'terms') ? 20 : 6}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 font-mono text-sm"
                                    placeholder="Enter content here..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category (for FAQs) / Subtitle</label>
                                <input {...register('subtitle')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                                <input {...register('image')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Optional, visual only)</label>
                                <input {...register('icon')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. 🍦" />
                            </div>
                        </>
                    )}

                    <div className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                        <input type="checkbox" {...register('isActive')} id="isActive" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 cursor-pointer">Active (Visible to users)</label>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/content')}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminContentForm;

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
    createContent, updateContent,
    fetchAllContent,
    resetContentState
} from '../../features/content/contentSlice';
import Loader from '../../components/ui/Loader';
import { FaArrowLeft } from 'react-icons/fa';

const AdminContentForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab'); // 'content', 'policies' - purely for navigation back

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { contentItems, loading, success, error } = useSelector((state) => state.content);
    const { register, handleSubmit, setValue, watch } = useForm();
    const [isEdit, setIsEdit] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Watch type to conditionally render fields
    const watchedType = watch('type');

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            if (contentItems.length === 0) dispatch(fetchAllContent());
            const item = contentItems.find(c => c._id === id);
            if (item) {
                Object.keys(item).forEach(key => setValue(key, item[key]));
                if (item.image) {
                    setImagePreview(item.image);
                }
            }
        } else {
            // Defaults for new items
            // Set default type based on previous tab if possible, or default to announcement
            if (tab === 'policies') setValue('type', 'privacy');
            else setValue('type', 'announcement');
        }
    }, [id, contentItems, dispatch, setValue, tab]);

    useEffect(() => {
        if (success) {
            dispatch(resetContentState());
            navigate('/admin/content');
        }
    }, [success, dispatch, navigate]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();

        // Append all text fields
        Object.keys(data).forEach(key => {
            if (key !== 'image') { // Skip image key from text inputs
                formData.append(key, data[key]);
            }
        });

        // Append image file if selected
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        if (isEdit) {
            dispatch(updateContent({ id, contentData: formData }));
        } else {
            dispatch(createContent(formData));
        }
    };

    if (loading && isEdit && contentItems.length === 0) {
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
                    {isEdit ? 'Edit' : 'Add New'} Content
                </h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select {...register('type', { required: true })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2">
                                <option value="announcement">Announcement</option>
                                <option value="feature">Feature</option>
                                <option value="about">About Section</option>
                                <option value="hero">Hero Section</option>
                                <option value="highlight">Highlight Section</option>
                                <option value="variant">Ice Cream Variant</option>
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
                            {(watchedType === 'privacy' || watchedType === 'terms') ? 'Title' : (watchedType === 'hero' || watchedType === 'highlight' || watchedType === 'variant') ? 'Title / Heading' : 'Title (Question for FAQ)'}
                        </label>
                        <input {...register('title', { required: 'Title is required' })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                    </div>

                    {(watchedType === 'hero' || watchedType === 'highlight') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                                <input {...register('ctaText')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                <input {...register('link')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {(watchedType === 'privacy' || watchedType === 'terms') ? 'Content (Full Text)' : (watchedType === 'hero' || watchedType === 'highlight' || watchedType === 'variant') ? 'Description' : 'Content (Answer for FAQ)'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="flex items-center space-x-4">
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Optional, visual only) / Variant Image URL</label>
                        <input {...register('icon')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" placeholder="e.g. 🍦" />
                    </div> */}

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

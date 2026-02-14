import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useForm } from 'react-hook-form';

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { loading: authLoading } = useSelector((state) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { register, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            address: '',
            brandName: '',
            contactNumber: ''
        }
    });

    // Watch for file changes to update preview
    const profileImageFile = watch('profileImage');

    useEffect(() => {
        if (user) {
            // Reset form with user data
            reset({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                brandName: user.brandName || '',
                contactNumber: user.contactNumber || ''
            });

            // Set initial image preview
            if (user.profileImage) {
                const imageUrl = user.profileImage.startsWith('http')
                    ? user.profileImage
                    : `${api.defaults.baseURL.replace('/api', '')}/${user.profileImage}`;
                setImagePreview(imageUrl);

            }
        }
    }, [user, reset]);

    // Handle image preview update when file changes via react-hook-form
    useEffect(() => {
        if (profileImageFile && profileImageFile.length > 0) {
            const file = profileImageFile[0];
            setImagePreview(URL.createObjectURL(file));
        }
    }, [profileImageFile]);


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);

        if (user.role === 'vendor') {
            formData.append('brandName', data.brandName);
            formData.append('contactNumber', data.contactNumber);
        }

        if (data.profileImage && data.profileImage.length > 0) {
            formData.append('profileImage', data.profileImage[0]);
        }

        try {
            await dispatch(updateProfile(formData)).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error(err?.message || 'Failed to update profile');
        }
    };

    if (!user) {
        return <div className="text-center py-10">Please Login</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="border-t border-gray-200 px-4 py-5 sm:px-6 space-y-4">
                            <div className="flex flex-col items-center mb-4">
                                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('profileImage')}
                                    className="text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    {...register('username')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    {...register('phone')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    {...register('address')}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {user.role === 'vendor' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                                        <input
                                            type="text"
                                            {...register('brandName')}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number (Vendor)</label>
                                        <input
                                            type="text"
                                            {...register('contactNumber')}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={authLoading}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                                >
                                    {authLoading && <Loader />}
                                    <span className={authLoading ? 'ml-2' : ''}>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:flex sm:items-center sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 sm:w-1/3">Profile Image</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone || '-'}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.address || '-'}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{user.role}</dd>
                                </div>

                                {user.role === 'vendor' && (
                                    <>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Brand Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.brandName || '-'}</dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">Vendor Contact</dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.contactNumber || '-'}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </div>
                    )}
                </div>

            </div>
        
    </div >
);
};

export default Profile;

import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/ui/Loader';
import { useForm } from 'react-hook-form';
import { FaCamera } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { loading: authLoading } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            gender: 'Male',
            brandName: '',
            contactNumber: '',
            address: ''
        }
    });

    const profileImageFile = watch('profileImage');

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            reset({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || 'Male',
                brandName: user.brandName || '',
                contactNumber: user.contactNumber || '',
                address: user.address || ''
            });
            if (user.profileImage) {
                const imageUrl = user.profileImage.startsWith('http')
                    ? user.profileImage
                    : `${api.defaults.baseURL.replace('/api', '')}/${user.profileImage}`;
                setImagePreview(imageUrl);
            }
        }
    }, [user, reset]);

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
        formData.append('gender', data.gender);

        if (data.profileImage && data.profileImage.length > 0) {
            formData.append('profileImage', data.profileImage[0]);
        }

        if (user.role === 'vendor') {
            formData.append('brandName', data.brandName);
            formData.append('contactNumber', data.contactNumber);
            formData.append('address', data.address);
        }

        try {
            await dispatch(updateProfile(formData)).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            toast.error(err?.message || 'Failed to update profile');
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        try {
            await dispatch(updatePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            })).unwrap();
            toast.success('Password updated successfully');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err?.message || 'Failed to update password');
        }
    };

    if (!user) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-poppins">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md group">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-2xl bg-gray-100">
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaCamera className="text-white text-xl" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register('profileImage')}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        title="Change Profile Photo"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold text-[#0D1E32]">{user.username}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-[#E65555] text-white px-6 py-2 rounded-lg hover:bg-[#d14040] transition shadow-sm font-medium"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8">

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                {...register('username')}
                                disabled={!isEditing}
                                placeholder="Your Name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                {...register('email')}
                                disabled={!isEditing}
                                placeholder="Your Email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="text"
                                {...register('phone')}
                                disabled={!isEditing}
                                placeholder="Your Phone Number"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div className="relative">
                                <select
                                    {...register('gender')}
                                    disabled={!isEditing}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password - shown when editing */}
                    {isEditing && (
                        <div className="mb-8 border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            minLength={6}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition"
                                            placeholder="Min 6 characters"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            minLength={6}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition"
                                            placeholder="Re-enter new password"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={submitPasswordChange}
                                        disabled={!passwordData.oldPassword || !passwordData.newPassword || authLoading}
                                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 text-sm font-medium"
                                    >
                                        Update Password Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Details - vendors only */}
                    {user.role === 'vendor' && (
                        <div className="mb-8 border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                                    <input
                                        type="text"
                                        {...register('brandName')}
                                        disabled={!isEditing}
                                        placeholder="Your Brand Name"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Contact Number</label>
                                    <input
                                        type="text"
                                        {...register('contactNumber')}
                                        disabled={!isEditing}
                                        placeholder="Business Phone"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                                    <textarea
                                        {...register('address')}
                                        disabled={!isEditing}
                                        placeholder="Business Address"
                                        rows="3"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E65555] focus:bg-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    {isEditing && (
                        <div className="flex justify-end border-t border-gray-100 pt-6">
                            <button
                                type="submit"
                                disabled={authLoading}
                                className="bg-[#E65555] text-white px-8 py-3 rounded-lg hover:bg-[#d14040] shadow-md transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {authLoading ? <Loader /> : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;

import { useSelector, useDispatch } from 'react-redux';
import { login, logout, registerInitiate, registerVerify, forgotPassword, resetPassword, updateProfile } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated, error } = useSelector((state) => state.auth);

    return {
        user,
        loading,
        isAuthenticated,
        error,
        login: (creds) => dispatch(login(creds)).unwrap(),
        logout: () => dispatch(logout()),
        registerInitiate: (data) => dispatch(registerInitiate(data)).unwrap(),
        registerVerify: (data) => dispatch(registerVerify(data)).unwrap(),
        forgotPassword: (data) => dispatch(forgotPassword(data)).unwrap(),
        resetPassword: (data) => dispatch(resetPassword(data)).unwrap(),
        updateProfile: (data) => dispatch(updateProfile(data)).unwrap()
    };
};

export default useAuth;

import { useSelector, useDispatch } from 'react-redux';
import { login, logout, registerInitiate, registerVerify, forgotPassword, resetPassword } from '../features/auth/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated, error } = useSelector((state) => state.auth);

    return {
        user,
        loading,
        isAuthenticated,
        error,
        login: (creds) => dispatch(login(creds)),
        logout: () => dispatch(logout()),
        registerInitiate: (data) => dispatch(registerInitiate(data)),
        registerVerify: (data) => dispatch(registerVerify(data)),
        forgotPassword: (data) => dispatch(forgotPassword(data)),
        resetPassword: (data) => dispatch(resetPassword(data))
    };
};

export default useAuth;

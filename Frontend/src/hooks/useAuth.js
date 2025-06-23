import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, clearRegistrationSuccess, fetchUserProfile, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, verifyEmail, setAuthenticated } from "../features/auth/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    const login = useCallback(async (credentials) => {
        return dispatch(loginUser(credentials));
    }, [dispatch]);

    const register = useCallback(async (userData) => {
        return dispatch(registerUser(userData));
    }, [dispatch]);

    const logout = useCallback(async () => {
        return dispatch(logoutUser());
    }, [dispatch]);

    const getUserProfile = useCallback(async () => {
        return dispatch(fetchUserProfile());
    }, [dispatch]);

    const requestReset = useCallback(async (email) => {
        return dispatch(requestPasswordReset(email));
    }, [dispatch]);

    const resetUserPassword = useCallback(async (token, newPassword) => {
        return dispatch(resetPassword({ token, newPassword }));
    }, [dispatch]);

    const verifyUserEmail = useCallback(async (token) => {
        return dispatch(verifyEmail(token));
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearRegSuccess = useCallback(() => {
        dispatch(clearRegistrationSuccess());
    }, [dispatch]);

    const updateAuthState = useCallback((status) => {
        dispatch(setAuthenticated(status));
    }, [dispatch]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !authState.user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, authState.user]);

    return {
        ...authState,
        login,
        register,
        logout,
        getUserProfile,
        requestPasswordReset: requestReset,
        resetPassword: resetUserPassword,
        verifyEmail: verifyUserEmail,
        clearError: clearAuthError,
        clearRegistrationSuccess: clearRegSuccess,
        setAuthenticated: updateAuthState,
    };
};
import { Loader } from '@/components/ui/loader';
import { useAuth } from '@/provider/authContext';
import React from 'react'
import { Navigate, Outlet } from 'react-router'

const AuthLayout = () => {

    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Outlet />
    )
}

export default AuthLayout
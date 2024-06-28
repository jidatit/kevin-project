import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from "../../AuthContext";

const Loader = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
}

const Layout = () => {

    const { currentUser, loading, userType } = useAuth();
    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {!currentUser && (
                <>
                    <Outlet />
                </>
            )}
            {currentUser && userType === "user" && (
                <>
                    <Navigate to="user_portal" />
                </>
            )}
            {currentUser && userType === "admin" && (
                <>
                    <Navigate to="admin_portal" />
                </>
            )}
        </>
    )
}

export default Layout;
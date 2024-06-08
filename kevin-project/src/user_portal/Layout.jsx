import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserAvatar from '../assets/Avatar.png';

const Loader = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 opacity-75 z-50">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};

const Layout = () => {
    const { logout, currentUser, loading, userType } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [displayName, setDisplayName] = useState(false);
    const [showNameInMenu, setShowNameInMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleResize = useCallback(() => {
        const isDesktop = window.innerWidth > 768;
        setDisplayName(isDesktop);
        setShowNameInMenu(!isDesktop);
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    if (loading) {
        return <Loader />;
    }

    const toggleOpenSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        currentUser && userType === 'user' ? (
            <>
                <div className="w-full flex flex-cols relative">
                    {/* Right Navbar */}
                    <div
                        id="logo-sidebar"
                        className={`w-64 absolute flex flex-col left-0 top-0 border-r-2 border-gray-300 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white sm:translate-x-0 z-50`}
                        aria-label="Sidebar"
                    >
                        <div onClick={toggleCloseSidebar} className="w-full h-60 flex justify-center items-center text-3xl font-bold border-b-2 border-gray-300">
                            Logo Here
                        </div>
                        <div className="flex flex-col justify-center items-center gap-4 mt-8">
                            <div
                                onClick={() => navigate('/user_portal/')}
                                className="flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer">
                                <DashboardOutlinedIcon />
                                Dashboard
                            </div>
                            <div 
                                onClick={() => navigate('/user_portal/profile')}
                                className="flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer">
                                <AccountBoxOutlinedIcon />
                                Profile
                            </div>
                            <div 
                                onClick={() => navigate('/user_portal/clients')}
                                className="flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer">
                                <PeopleOutlineOutlinedIcon />
                                Clients
                            </div>
                        </div>
                    </div>

                    {/* Left Main Area */}
                    <div className="absolute flex flex-col left-0 right-0 sm:ml-64 transition-all duration-300">
                        <div className="w-full flex flex-cols justify-between items-center py-4 px-4 sm:px-10 md:px-10 lg:px-10 xl:px-10">
                            <div className="flex items-center justify-start gap-4 rtl:justify-end">
                                <button onClick={toggleOpenSidebar} aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                                    <span className="sr-only">Open sidebar</span>
                                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                    </svg>
                                </button>
                                <div className="font-bold text-2xl">Dashboard</div>
                            </div>
                            <div className="flex flex-cols justify-center items-center gap-0 lg:gap-2">
                                <Avatar src={UserAvatar} alt="Remy Sharp" />
                                {displayName && <h1 className="text-base font-semibold pl-4">Muhammad Umar</h1>}
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    <KeyboardArrowDownIcon className="text-4xl text-black" />
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {showNameInMenu && <MenuItem>Muhammad Umar</MenuItem>}
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>Change Password</MenuItem>
                                    <MenuItem onClick={logout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </div>
                        <div className="w-full flex flex-cols justify-between items-center py-4 px-10">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <Navigate to="/" />
        )
    );
};

export default Layout;

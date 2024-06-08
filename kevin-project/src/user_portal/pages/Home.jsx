import React, { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserAvatar from '../../assets/Avatar.png';

const Home = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout, currentUser, userType } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className=' flex flex-col min-h-screen'>
            <nav className="w-full bg-white border-b-2 border-gray-300">
                <div className="py-12 px-4 sm:py-12 sm:px-12 md:py-12 md:px-12 lg:py-12 lg:px-12 xl:py-12 xl:px-12 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start gap-4 rtl:justify-end">
                            <button onClick={toggleSidebar} aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                                <span className="sr-only"> Open sidebar </span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75a1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <div className='font-bold text-2xl'> Logo Here </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div className='flex flex-cols justify-center items-center gap-2'>
                                    <Avatar src={UserAvatar} alt="Remy Sharp" />
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <KeyboardArrowDownIcon className='text-4xl text-black ' />
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
                                        <MenuItem>Muhammad Umar</MenuItem>
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>Change Password</MenuItem>
                                        <MenuItem onClick={logout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className='w-full h-full flex flex-row relative flex-grow'>
                <aside
                    id="logo-sidebar"
                    className={`w-64 absolute left-0 top-0 bottom-0 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r-2 border-gray-300 sm:translate-x-0 z-50`}
                    aria-label="Sidebar">
                    <div className="px-4 py-8 overflow-y-auto">
                        <div className='flex flex-col justify-center items-center gap-4'>
                        <div className='font-bold text-2xl'> Logo Here </div>
                            <div className='flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer'>
                                <DashboardOutlinedIcon />
                                Dashboard
                            </div>
                            <div className='flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer'>
                                <AccountBoxOutlinedIcon />
                                Profile
                            </div>
                            <div className='flex justify-start items-center w-[80%] bg-gray-300 py-2 px-4 rounded text-base gap-2 cursor-pointer'>
                                <PeopleOutlineOutlinedIcon />
                                Clients
                            </div>
                        </div>
                    </div>
                </aside>

                <div className={`absolute bottom-0 top-0 left-0 right-0 sm:ml-64 border-4 border-red-500 transition-all duration-300 overflow-y-auto min-h-full`}>
                    <div className="p-4 border-4 border-gray-200 border-dashed rounded-lg h-[1000px]">
                        <h1>Dashboard</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

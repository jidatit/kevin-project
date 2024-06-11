import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

import AuthLayout from './auth/Layout'
import UserSignup from './auth/UserSignup'
import UserLogin from './auth/UserLogin'
import AdminLogin from './auth/AdminLogin'

import UserLayout from './user_portal/Layout'
import UserDashboardHome from './user_portal/pages/Dashboard'
import UserDashboardProfile from './user_portal/pages/Profile'
import UserDashboardClients from './user_portal/pages/Clients'
import UserPasswordChange from './user_portal/components/UserPasswordChange'

import AdminLayout from './admin_portal/Layout'
import AdminDashbaordUsers from './admin_portal/pages/Users'
import AdminPasswordChange from './admin_portal/components/AdminPasswordChange'

function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path='/' element={<AuthLayout />}>
            <Route index element={<UserLogin />} />
            <Route path='signup' element={<UserSignup />} />
            <Route path='admin' element={<AdminLogin />} />
          </Route>

          <Route path='/user_portal' element={<UserLayout />}>
            <Route index element={<UserDashboardHome />} />
            <Route path='profile' element={<UserDashboardProfile />} />
            <Route path='clients' element={<UserDashboardClients />} />
            <Route path='changePassword' element={<UserPasswordChange/>} />
            <Route path='logout' element={<Logout />} />
          </Route>

          <Route path='/admin_portal' element={<AdminLayout />}>
            <Route index element={<AdminDashbaordUsers />} />
            <Route path='changePassword' element={<AdminPasswordChange/>} />
            <Route path='logout' element={<Logout />} />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App;

function Logout() {
  const { logout, userType } = useAuth()
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#1F2634] bg-opacity-75">
        <div className='w-[654px] h-[310px] rounded-lg mt-[40px] flex flex-col gap-[23px] justify-center items-center bg-white'>
          <p className='font-bold text-black text-3xl text-center'>Are you sure you want to logout?</p>
          <div className='w-[540px] h-[70px] flex flex-row gap-6 justify-center'>
            {userType === "admin" ? (<button onClick={() => { navigate('/admin_portal') }} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>)
              : (<button onClick={() => { navigate('/user_portal') }} className='bg-[#BB000E] rounded-md w-[229px] h-[56px] font-bold text-white'>Cancel</button>)}
            <button onClick={logout} className='bg-[#059C4B] rounded-md w-[229px] h-[56px] font-bold text-white'>Confirm</button>
          </div>
        </div>
      </div>
    </>
  )
}
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <div className='w-full flex flex-col justify-start items-center' >
                <Outlet/>
            </div>
        </>
    )
}

export default Layout

import React from 'react'
import ClientTable from '../components/ClientTable'

const Profile = () => {
    return (
        <>
            <div className='w-full h-auto flex flex-col' >

                <div className=' w-full flex flex-col justify-center items-center'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Description Information </div>
                    <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3' >

                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > First Name </h1>
                            <h2 className='font-normal text-sm text-black' > Muhammad </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Last Name </h1>
                            <h2 className='font-normal text-sm text-black' > Umar </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Agent Company </h1>
                            <h2 className='font-normal text-sm text-black' > Jidat IT </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Phone Number </h1>
                            <h2 className='font-normal text-sm text-black' > 051-XXXXXX </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Mobile Number </h1>
                            <h2 className='font-normal text-sm text-black' > 0316-XXXXXX </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Email </h1>
                            <h2 className='font-normal text-sm text-black' > client@client.com </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Agent Referral Code </h1>
                            <h2 className='font-normal text-sm text-black' > 3r5tf6hg45g </h2>
                        </div>

                    </div>
                </div>

                <div className='w-full h-auto mt-8' >
                    <ClientTable />
                </div>

            </div>
        </>
    )
}

export default Profile

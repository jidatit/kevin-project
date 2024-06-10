import React from 'react'

const Dashboard = () => {
    return (
        <>
            <div className='w-full h-auto flex flex-col' >

                <div className=' w-full lg:w-[40%] flex flex-col justify-center items-center'>
                    <div className='w-full h-12 rounded-t-lg bg-[#6DB23A]'></div>
                    <div className='w-[95%] h-60 my-5 lg:my-3 rounded-xl bg-gray-200 flex justify-center items-center' >
                        <div className='font-semibold text-3xl' >Video will Display Here</div>
                    </div>
                </div>

                <div className=' w-full flex flex-col justify-center items-center mt-10'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Quick Links </div>
                    <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-around items-start gap-3 lg:gap-0' >
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>Click Here to Schedule a Call</div>
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>Go to Settings in Concierge</div>
                    </div>
                    <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-around items-start mt-[-6px] lg:mt-0 gap-3 lg:gap-0' >
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>Email Support Team</div>
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>Call Support Team Here</div>
                    </div>
                </div>

                <div className=' w-full flex flex-col justify-center items-center mt-10'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Contact My Account Executive </div>
                    <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col lg:flex-row justify-around items-start gap-3 lg:gap-0' >
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>1-877-4677 ext. 988</div>
                        <div className='font-semibold w-full lg:w-auto text-lg py-2 px-10 text-[#6DB23A] bg-gray-200 cursor-pointer'>admin@admin.com</div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Dashboard

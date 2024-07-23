
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '../../../AuthContext';
import { db } from '../../../Firebase';
import { Link } from 'react-router-dom';

const Dashboard = () => {

    const { currentUser } = useAuth();
    const userID = currentUser?.uid;
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        if (!userID) return;
        try {
            const userRef = doc(db, 'users', userID);
            const dataDoc = await getDoc(userRef);
            if (dataDoc.exists()) {
                setUserData(dataDoc.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    };

    const getEmbedURL = (url) => {
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    useEffect(() => {
        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    return (
        <>
            <div className='w-full h-auto flex flex-col mb-6' >

                <div className=' w-full lg:w-[50%] flex flex-col justify-center items-center'>
                    <div className='w-full h-12 rounded-t-lg bg-[#6DB23A]'></div>
                    <div className='w-[95%] h-64 my-5 rounded-xl bg-gray-200 flex justify-center items-center'>
                        {userData && userData.quickLinkVideo !== null && (
                            <iframe
                                className="rounded-xl"
                                width="100%"
                                height="100%"
                                src={getEmbedURL(userData.quickLinkVideo)}
                                title="Embedded Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                        {userData && userData.videoFileLink !== null && (
                            <video width="100%" height="100%" controls>
                                <source src={userData.videoFileLink} type="video/mp4" />
                            </video>
                        )}
                    </div>
                </div>

                <div className=' w-full flex flex-col justify-center items-center mt-2'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Quick Links </div>

                    <div className='w-full h-auto flex flex-col lg:flex-row justify-around items-start gap-3 mt-5 mb-3 px-4' >
                        <div className='w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl'>
                            <div className='text-lg text-[#6DB23A] font-bold'>Click Here to Schedule a Call</div>
                            <div className='flex flex-col  text-[#619f34] text-sm font-semibold cursor-pointer'>
                                {userData && userData.quickLinkFirst ? (<Link to={userData.quickLinkFirst} className='underline break-words'> {userData.quickLinkFirst} </Link>) : (<span> No Link Available </span>)}
                            </div>
                        </div>
                        <div className='w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl'>
                            <div className='text-lg text-[#6DB23A] font-bold' >Go to Settings in Concierge</div>
                            <div className='text-sm flex flex-col  text-[#619f34] font-semibold cursor-pointer' >
                                {userData && userData.quickLinkSecond ? (<Link to={userData.quickLinkSecond} className='underline break-words'> {userData.quickLinkSecond} </Link>) : (<span> No Link Available </span>)}
                            </div>
                        </div>
                    </div>

                    <div className='w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-3 px-4' >
                        <div className='w-full lg:max-w-[50%] py-3 px-5 lg:px-8 bg-gray-200 rounded-xl'>
                            <div className='text-lg text-[#6DB23A] font-bold' > Email Support Team</div>
                            <div className='text-sm flex flex-col  text-[#619f34] font-semibold cursor-pointer' >
                                {userData && userData.quickLinkThird ? (<Link to={userData.quickLinkThird} className='underline break-words' > {userData.quickLinkThird} </Link>) : (<span> No Link Available </span>)}
                            </div>
                        </div>
                    </div>

                </div>

                <div className=' w-full flex flex-col justify-start items-start mt-7'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Contact My Account Executive </div>

                    <div className='w-full h-auto flex flex-col lg:flex-row justify-start items-start gap-3 px-4' >
                        <div className='w-full lg:max-w-[50%] py-3 px-5 lg:px-8 mt-3 bg-gray-200 rounded-xl'>
                            <div className='text-lg text-[#6DB23A] font-bold'>Contact Number</div>
                            <div className='text-sm flex flex-col  text-[#619f34] font-semibold cursor-pointer' >
                                {userData && userData.quickLinkContact ? (<Link href={userData.quickLinkContact} className='break-words'> {userData.quickLinkContact} </Link>) : (<span> No Number Available </span>)}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Dashboard

import React, { useState, useEffect }  from 'react'
import ClientTable from '../components/ClientTable'
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from '../../../AuthContext';
import { db } from '../../../Firebase';

const Profile = () => {

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

    useEffect(() => {
        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    return (
        <>
            <div className='w-full h-auto flex flex-col' >

                <div className=' w-full flex flex-col justify-center items-center'>
                    <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Description Information </div>
                    <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3' >

                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > First Name </h1>
                            <h2 className='font-normal text-sm text-black' > { userData ? userData.name.split(' ')[0] : '-'} </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Last Name </h1>
                            <h2 className='font-normal text-sm text-black' > { userData ? userData.name.split(' ')[1] : '-'} </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Agent Company </h1>
                            <h2 className='font-normal text-sm text-black' > { userData ? userData.agent : '-'}  </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Phone Number </h1>
                            <h2 className='font-normal text-sm text-black' > { userData ? userData.phoneNumber : '-'} </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Email </h1>
                            <h2 className='font-normal text-sm text-black' > { userData ? userData.email : '-'} </h2>
                        </div>
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > Agent Referral </h1>
                            <h2 className='font-normal text-sm text-black break-words' > {userData ? userData.referralLink : '-'}  </h2>
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

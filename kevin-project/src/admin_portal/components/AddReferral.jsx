import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TextField } from '@mui/material'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddReferral = () => {

    const { id } = useParams();
    const [userID, setUserID] = useState('');
    const [referralText, setReferralText] = useState('');
    const [isAddingReferral, setIsAddingReferral] = useState(false);

    const handleReferralSave = async () => {

        if (referralText === "") {
            toast.error("Please fill the field");
            return;
        }

        try {
            setIsAddingReferral(true);
            const userRef = doc(db, 'users', userID);
            await updateDoc(userRef, { referralLink: referralText });
            toast.success("Referral Added Successfully");
        } catch (error) {
            toast.error("Error Adding Referral : ", error);
        }
        finally {
            setReferralText('');
            setIsAddingReferral(false);
        }
    };

    useEffect(() => {
        if (id) {
            setUserID(id);
        }
    });

    return (
        <>
            <div className='w-full h-auto flex flex-col justify-center items-center'>
                <ToastContainer />
                <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Add Referral </div>

                <div className='w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3'>
                    <div className='w-full pt-4 pb-6 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]'>  </h1>
                        <TextField
                            fullWidth
                            name='link'
                            type='text'
                            value={referralText}
                            onChange={(e) => setReferralText(e.target.value)}
                        />
                    </div>

                    <div className='w-full py-4 px-6 flex flex-col justify-center lg:justify-end items-center lg:items-end'>
                        <button
                            onClick={handleReferralSave}
                            className="w-auto text-white bg-[#6DB23A] hover:bg-[#65a13a] focus:outline-none focus:ring-4 focus:ring-[#65a13a] font-medium rounded-xl text-sm px-5 py-3 text-center me-2 mb-2"
                            disabled={isAddingReferral}
                        >
                            {isAddingReferral ? 'Adding Referral...' : 'Add Referral'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddReferral

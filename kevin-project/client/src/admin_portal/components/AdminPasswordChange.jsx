import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPasswordChange = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isUpdating, setIsUpdating] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (oldPassword === "" || newPassword === "" || confirmPassword === "") {
            toast.error("Please fill all the fields");
            return;
        }

        if (oldPassword === newPassword) {
            toast.error("New Password should be different from the Old Password");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New Password & Confirm Password don't match");
            return;
        }

        try {
            setIsUpdating(true);

            const auth = getAuth();
            const user = auth.currentUser;
            const userId = user.uid;
            const userDocRef = doc(db, 'admins', userId);

            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const password = userData.password;

                const credential = EmailAuthProvider.credential(user.email, oldPassword);
                await reauthenticateWithCredential(user, credential);

                await updatePassword(user, newPassword);
                await updateDoc(userDocRef, {
                    password: newPassword,
                });

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                toast.success('Password Updated Successfully');
            } else {
                toast.error('No User Data Exists');
            }
        } catch (error) {
            toast.error('Error Updating Password');
            if (error.code === 'auth/requires-recent-login') {
                toast.error('Please re-login and try again.');
            } else {
                toast.error('Error updating password. Please try again.');
            }
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <div className='w-full h-auto flex flex-col justify-center items-center'>
                <ToastContainer />
                <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Change Password </div>

                <form onSubmit={handlePasswordReset} className='w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3'>
                    <div className='w-full pt-4 pb-6 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]'> Old Password </h1>
                        <TextField
                            fullWidth
                            name='oldPassword'
                            type='password'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className='w-full pt-4 pb-6 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]'> New Password </h1>
                        <TextField
                            fullWidth
                            name='newPassword'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className='w-full pt-4 pb-6 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]'> Confirm Password </h1>
                        <TextField
                            fullWidth
                            name='confirmPassword'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className='w-full py-4 px-6 flex flex-col justify-center lg:justify-end items-center lg:items-end'>
                        <button
                            type="submit"
                            className="w-auto text-white bg-[#6DB23A] hover:bg-[#65a13a] focus:outline-none focus:ring-4 focus:ring-[#65a13a] font-medium rounded-xl text-sm px-5 py-3 text-center me-2 mb-2"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminPasswordChange;

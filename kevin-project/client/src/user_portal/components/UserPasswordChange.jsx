import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import bcrypt from 'bcryptjs';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPasswordChange = () => {

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
            const userDocRef = doc(db, 'users', userId);

            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const hashedPassword = userData.hashedPassword;

                const isMatch = bcrypt.compareSync(oldPassword, hashedPassword);
                if (!isMatch) {
                    toast.error("Old password is incorrect");
                    setIsUpdating(false);
                    return;
                }

                const credential = EmailAuthProvider.credential(user.email, oldPassword);
                await reauthenticateWithCredential(user, credential);

                const salt = bcrypt.genSaltSync(10);
                const newHashedPassword = bcrypt.hashSync(newPassword, salt);

                await updatePassword(user, newPassword);
                await updateDoc(userDocRef, {
                    hashedPassword: newHashedPassword,
                });

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                toast.success('Password Updated Successfully');
            } else {
                toast.error('No User Data Exists');
            }
        } catch (error) {
            console.error('Error updating password : ', error.message);
            toast.error('Error Updating Password');
            if (error.code === 'auth/requires-recent-login') {
                toast.error('Please re-login and try again.');
            } else {
                toast.error('Error updating password. Please try again.');
            }
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

export default UserPasswordChange;

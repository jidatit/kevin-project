import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../Firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const UserPasswordChange = () => {

    const [userFormData, setUserFormData] = useState({
        username: '',
        email: '',
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const fetchData = async () => {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'Users', userId);

        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUserFormData(userData);
            } else {
                console.error('No User Data Exists');
            }
        } catch (error) {
            console.error('Error fetching user data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (oldPassword === newPassword) {
            setError("New password should be different from the old password");
            return;
        }

        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);

            await updatePassword(user, newPassword);

            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, 'Users', userId);
            await updateDoc(userDocRef, {
                password: newPassword,
            });

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');

            console.log('Password updated successfully');
        } catch (error) {

            console.error('Error updating password: ', error.message);
            setError('Error updating password. Please try again.');
        }
    };


    return (
        <>

            <div className=' w-full h-auto flex flex-col justify-center items-center'>
                <div className='w-full h-12 rounded-t-lg text-white font-semibold text-base pt-3 pl-3 bg-[#6DB23A]'> Change Password </div>


                < form onSubmit={handlePasswordReset} className='w-[95%] h-auto my-5 rounded-xl flex flex-col justify-around items-start gap-3' >

                    <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]' > Old Password </h1>
                        <TextField
                            fullWidth
                            name='oldPassword'
                            type='password'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]' > New Password </h1>
                        <TextField
                            fullWidth
                            name='newPassword'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}

                        />
                    </div>

                    <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                        <h1 className='font-semibold text-lg text-[#6DB23A]' > Confirm Password </h1>
                        <TextField
                            fullWidth
                            name='confirmPassword'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error &&
                        <div className='w-full py-4 px-6 bg-gray-200 cursor-pointer flex flex-col gap-2'>
                            <h1 className='font-semibold text-lg text-[#6DB23A]' > {error} </h1>
                        </div>
                    }

                    <div className='w-full py-4 px-6 flex flex-col'>
                        <button type="submit" class="text-white bg-[#6DB23A] hover:bg-[#65a13a] focus:outline-none focus:ring-4 focus:ring-[#65a13a] font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Update Password
                        </button>
                    </div>

                </form>
            </div>
        </>
    )
}

export default UserPasswordChange;
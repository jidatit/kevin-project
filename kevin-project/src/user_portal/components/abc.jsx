


import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../Firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const UserProfileComp = () => {

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
            <div className='userProfileComp' >

                <div className='userProfileCompMain2'>
                    <div className='userProfileCompMainWidthSetting2' >
                        <form onSubmit={handlePasswordReset}>
                            <TextField
                                label='Old Password'
                                name='oldPassword'
                                type='password'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <TextField
                                label='New Password'
                                name='newPassword'
                                type='password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            <TextField
                                label='Confirm New Password'
                                name='confirmPassword'
                                type='password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                margin='normal'
                            />
                            {error && <div style={{ color: 'red' }}>{error}</div>}
                            <div className="updateButton">
                                <span className="setUpdateButton">
                                    <button type='submit'>
                                        <div className='buttonSize' > Reset Password </div>
                                    </button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        </>
    );
};

export default UserProfileComp;
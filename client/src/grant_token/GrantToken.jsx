import React, { useState } from 'react';
import { TextField } from '@mui/material';

const GrantToken = () => {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [scope, setScope] = useState('ZohoCRM.modules.ALL,ZohoCRM.org.READ,ZohoCRM.bulk.ALL,ZohoCRM.coql.READ');
    const [redirectUrl, setRedirectUrl] = useState('https://kevin.jidatit.uk/grant-token/auth-token');
    const [accessType, setAccessType] = useState('offline');

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('clientId', clientId);
        localStorage.setItem('clientSecret', clientSecret);
        localStorage.setItem('scope', scope);
        localStorage.setItem('redirectUrl', redirectUrl);
        localStorage.setItem('accessType', accessType);
        console.log("Scope is : ", scope);
        const url = `https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=${clientId}&client_secret=${clientSecret}&scope=${scope}&redirect_uri=${redirectUrl}&access_type=${accessType}`;
        window.location.href = url;
    };

    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]'>
            <div className='w-[90%] relative md:w-[70%] bg-[#FFFFFF] pt-[60px] pb-[60px] rounded-[10px] flex flex-col justify-center items-center gap-5'>
                <h2 className='text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]'> Authorization Token | Grant Token </h2>
                <form className='w-[90%] md:w-[60%] flex gap-2 flex-col justify-start items-start' onSubmit={handleSubmit}>
                    <label htmlFor="clientid" className='font-semibold text-base pl-2'> Client ID </label>
                    <TextField
                        className='w-full outline-none'
                        placeholder='Client ID'
                        id='clientid'
                        type='text'
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        required
                    />
                    <label htmlFor="clientsecret" className='font-semibold text-base pl-2'> Client Secret </label>
                    <TextField
                        className='w-full outline-none'
                        placeholder='Client Secret'
                        id='clientsecret'
                        type='text'
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        required
                    />
                    <label htmlFor="scope" className='font-semibold text-base pl-2'> Scope </label>
                    <TextField
                        className='w-full outline-none'
                        placeholder='Scope'
                        id='scope'
                        type='text'
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        required
                        disabled
                    />
                    <label htmlFor="redirecturl" className='font-semibold text-base pl-2'> Redirect URL </label>
                    <TextField
                        className='w-full outline-none'
                        placeholder='Redirect URL'
                        id='redirecturl'
                        type='text'
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        required
                        disabled
                    />
                    <label htmlFor="accesstype" className='font-semibold text-base pl-2'> Access Type </label>
                    <TextField
                        className='w-full outline-none'
                        placeholder='Access Type'
                        id='accesstype'
                        type='text'
                        value={accessType}
                        onChange={(e) => setAccessType(e.target.value)}
                        required
                        disabled
                    />
                    <button
                        type='submit'
                        className='bg-white hover:bg-[#6DB23A] text-[#6DB23A] hover:text-[white] text-lg font-semibold mt-2 py-2 px-4 w-[100%] border-2 border-[#6DB23A] rounded shadow'>
                        Authorize
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GrantToken;
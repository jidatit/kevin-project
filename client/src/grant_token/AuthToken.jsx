import React, { useEffect, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthToken = () => {
    const [authCode, setAuthCode] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [scope, setScope] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [accessType, setAccessType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(window.location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
        const code = getUrlParameter('code');
        setAuthCode(code);

        const clientId = localStorage.getItem('clientId');
        const clientSecret = localStorage.getItem('clientSecret');
        const scope = localStorage.getItem('scope');
        const redirectUrl = localStorage.getItem('redirectUrl');
        const accessType = localStorage.getItem('accessType');

        setClientId(clientId);
        setClientSecret(clientSecret);
        setScope(scope);
        setRedirectUrl(redirectUrl);
        setAccessType(accessType);
    }, []);

    const copyToClipboard = () => {
        if (authCode) {
            navigator.clipboard.writeText(authCode)
                .then(() => {
                    alert('Authorization code copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy authorization code to clipboard.');
                });
        }
    };

    const generateTokens = async () => {
        try {
            const response = await axios.post('http://localhost:10000/api/accessAndRefreshToken', {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUrl,
                code: authCode,
                scope: scope,
                access_type: accessType
            });

            console.log('Tokens generated:', response.data);
            alert('Access & Refresh tokens generated successfully!');
        } catch (error) {
            console.error('Error generating tokens:', error);
            alert('Failed to generate tokens.');
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-[#6DB23A]">
            <div className="w-[90%] relative md:w-[70%] bg-[#FFFFFF] pt-[60px] pb-[60px] rounded-[10px] flex flex-col justify-center items-center gap-5">
                <h2 className="text-center font-bold lg:text-[30px] md:text-[25px] text-[20px]">Authorization Token | Grant Token</h2>
                {authCode && (
                    <>
                        <div className="mt-2 p-4 bg-gray-100 rounded-md shadow flex flex-row items-center justify-between border-2 border-gray-300">
                            <p className="text-gray-800">{authCode}</p>
                            <div className=" text-[#6DB23A] hover:text-[#50852b] text-sm font-semibold py-2 px-4 rounded cursor-pointer">
                                <ContentCopyIcon onClick={copyToClipboard} />
                            </div>
                        </div>
                        <div className='w-full h-auto px-56' >
                            <span className='text-base font-semibold' > Note: </span>
                            <span className='text-base' > Grant token is a one-time use token and valid for two minutes. So, generate access and refresh tokens within two minutes </span>
                        </div>
                    </>
                )}
                <div className='w-full h-auto flex flex-row justify-center items-center'>
                    <button
                        onClick={generateTokens}
                        className="text-white bg-[#6DB23A] hover:bg-[#50852b] text-sm font-semibold py-2 px-4 rounded cursor-pointer">
                        Generate Access & Refresh Token
                    </button>
                </div>
                <div className='w-full h-auto flex flex-row justify-center items-center'>
                    <button
                        onClick={() => navigate('/grant-token')}
                        className="text-white bg-[#6DB23A] hover:bg-[#50852b] text-sm font-semibold py-2 px-4 rounded cursor-pointer">
                        Back to Token Generation Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthToken;
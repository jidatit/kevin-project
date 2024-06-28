import express from 'express';
import axios from 'axios';
import { stringify } from 'querystring';

const router = express.Router();

let client_id = '';
let client_secret = '';
let access_token = '';
let refresh_token = '';

router.post('/accessAndRefreshToken', async (req, res) => {
    const { redirect_uri, code, scope, access_type } = req.body;

    client_id = req.body.client_id;
    client_secret = req.body.client_secret;

    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', stringify({
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: redirect_uri,
            code: code,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Response Data: ', response.data);
        access_token = response.data.access_token;
        refresh_token = response.data.refresh_token;
        console.log('Access Token : ', access_token);
        console.log('Refresh Token : ', refresh_token);
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).send('Error fetching tokens');
    }
});

export default router;

// import express from 'express';
// import axios from 'axios';
// import { stringify } from 'querystring';

// const router = express.Router();

// const client_id = '1000.LH7UHAB6ILUX55KGPO99WX70W2U9AT';
// const client_secret = '71e21436c8a43db71d68802dd87a57cd3f13d1bf65';
// const redirect_uri = 'http://localhost:5173';
// const authorization_code = '1000.8eb409abd5aa0632364b7790759c986a.5275504221fd0e8d3b9953e77860906d';
// let access_token = '';
// let refresh_token = '';

// export async function getTokens() {
//     try {
//         const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', stringify({
//             grant_type: 'authorization_code',
//             client_id: client_id,
//             client_secret: client_secret,
//             redirect_uri: redirect_uri,
//             code: authorization_code
//         }), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });

//         console.log('Response Data: ', response.data);
//         access_token = response.data.access_token;
//         refresh_token = response.data.refresh_token;
//         console.log('Access Token : ', access_token);
//         console.log('Refresh Token : ', refresh_token);
//         return response;
//     } catch (error) {
//         console.error('Error fetching tokens:', error);
//         throw error;
//     }
// }

// export async function refreshAccessToken() {
//     try {
//         const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', stringify({
//             grant_type: 'refresh_token',
//             client_id: client_id,
//             client_secret: client_secret,
//             refresh_token: refresh_token
//         }), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });

//         console.log('Refresh Response Data: ', response.data);
//         access_token = response.data.access_token;
//         console.log('New Access Token : ', access_token);
//         return response;
//     } catch (error) {
//         console.error('Error refreshing access token:', error);
//         throw error;
//     }
// }

// async function fetchModules(accessToken) {
//     try {
//         const response = await axios.get('https://www.zohoapis.com/crm/v2/settings/modules', {
//             headers: {
//                 Authorization: `Zoho-oauthtoken ${accessToken}`
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching modules:', error);
//         throw error;
//     }
// }

// router.get('/', async (req, res) => {
//     try {
//         const response = await getTokens();
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).send('Error fetching tokens');
//     }
// });

// router.get('/refresh', async (req, res) => {
//     try {
//         const response = await refreshAccessToken();
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).send('Error refreshing access token');
//     }
// });

// router.get('/modules', async (req, res) => {
//     try {
//         if (!access_token) {
//             await refreshAccessToken();
//         }
//         const modules = await fetchModules(access_token);
//         res.json(modules);
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             await refreshAccessToken();
//             const modules = await fetchModules(access_token);
//             res.json(modules);
//         } else {
//             res.status(500).send(error.message);
//         }
//     }
// });

// export default router;

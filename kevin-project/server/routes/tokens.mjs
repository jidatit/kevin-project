import express from 'express';
import axios from 'axios';
import { stringify } from 'querystring';
import cron from 'node-cron';

const router = express.Router();

let client_id = '';
let client_secret = '';
let access_token = '';
let refresh_token = '';
let cronJob;

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
        
        setTimeout(() => {
            scheduleTokenRefresh();
        }, 55 * 60 * 1000); 

    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).send('Error fetching tokens');
    }
});

export async function refreshAccessToken() {
    try {
        const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', stringify({
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refresh_token
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Refresh Response Data: ', response.data);
        access_token = response.data.access_token;
        console.log('New Access Token : ', access_token);
        return response;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

function scheduleTokenRefresh() {
    if (cronJob) cronJob.stop();
    cronJob = cron.schedule('0/55 * * * *', async () => {
        console.log('Refreshing access token...');
        try {
            await refreshAccessToken();
        } catch (error) {
            console.error('Failed to refresh access token:', error);
        }
    }, {
        scheduled: true,
        timezone: "Etc/UTC"
    });

    console.log('Token refresh scheduled for every 55 minutes.');
}

export default router;
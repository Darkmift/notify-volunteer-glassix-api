// import api from 'api';
import logger from './logger-winston';
import env from '../config/index';
import axios from 'axios';
import { asyncTryCatchWrapper } from './tryCatchWrapper';
// const GlassixApi = api('@glassix/v1.2#abw55o2jvlp72nwk4');
// GlassixApi.server('https://assistanceelderly.glassix.com/api/v1.2');

// const sdk = new GlassixApi();
// sdk.setBasicAuth(env.GLASSIX_BASIC_AUTH_KEY, env.GLASSIX_BASIC_AUTH_SECRET);

const axiosInstance = axios.create({
    baseURL: 'https://assistanceelderly.glassix.com/api/v1.2',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getToken = async () => {
    try {
        const options = {
            apiKey: env.GLASSIX_BASIC_AUTH_KEY,
            apiSecret: env.GLASSIX_BASIC_AUTH_SECRET,
            userName: env.GLASSIX_USERNAME,
        };

        // const token = await sdk.pOST_tokenGet(options);
        const response = await axiosInstance.post('/token/get', options);
        const token = response.data.access_token;
        logger.info('data', response.data);
        return token;
    } catch (error) {
        logger.error(error as Error);
    }
};

export const cleanValue = (value: string): string => {
    return value.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
};

export const getTickets = async () => {
    return asyncTryCatchWrapper(async () => {
        const axiosInstance = axios.create({
            baseURL:
                'https://glas.consist.co.il/Services/api/message/non-ticket-test/d8b6b24f-9178-4c41-a77b-df7a65a1d1b5',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.GLASSIX_UNIQUE_TOKEN}`,
            },
        });

        const notification = {
            volunteerPhoneNumber: '972546912072',
            volunteerName: 'AVI TEST',
            seniorName: 'SENIOR TEST',
            seniorPhoneNumbers: '972546912072',
            subscriptionNumber: '', //monday itemid
            communityLeader: '',
            hoursThreshold: '', //24
        };

        const response = await axiosInstance.post('', {
            template: 'reminder_v2',
            waba: '784043332187199',
            from: '97223764765',
            to: notification.volunteerPhoneNumber.replace(/\n/g, '').trim(),
            protocolType: 'WhatsApp',
            params: [
                {
                    1: cleanValue(notification.volunteerName),
                },
                {
                    2: cleanValue(notification.seniorName),
                },
                {
                    3: cleanValue(notification.seniorPhoneNumbers),
                },
                {
                    4: cleanValue(notification.subscriptionNumber),
                },
                {
                    5: cleanValue(notification.communityLeader),
                },
                {
                    6: notification.hoursThreshold.toString(),
                },
            ],
        });

        logger.info('data', response.data);
    });
    // return asyncTryCatchWrapper(async () => {
    //     const token = await getToken();
    //     // set token as beared token
    //     axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    //     return (await axiosInstance.get('/tickets/list')).data;
    // });
};

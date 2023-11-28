// import api from 'api';
import logger from './logger-winston';
import env from '../config/index';
import axios from 'axios';
import { asyncTryCatchWrapper } from './tryCatchWrapper';
import { ContactVolunteerDetails, MessageType } from '../types';

export const cleanValue = (value: string): string => {
    return value.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
};

export const notifyVolunteerInWhatsApp = async (notification: ContactVolunteerDetails) => {
    return asyncTryCatchWrapper(async () => {
        const axiosInstance = axios.create({
            baseURL: env.GLASSIX_UNIQUE_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.GLASSIX_UNIQUE_TOKEN}`,
            },
        });

        const { data } = (await axiosInstance.post('', {
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
        })) as { data: MessageType };

        logger.info('MessageType send attempt result', data);
        return data;
    });
};

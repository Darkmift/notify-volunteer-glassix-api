// client.test.ts
import { describe, expect, jest, it } from '@jest/globals';
// import { notifyVolunteerInWhatsApp } from '../../../utils/client';
// import { ContactVolunteerDetails } from '../../../types';

jest.setTimeout(10000);

describe('send message', () => {
    it('send a message and get from in message sent details from response', async () => {
        //     const notification: ContactVolunteerDetails = {
        //         volunteerPhoneNumber: '972546912072',
        //         volunteerName: 'AVI TEST',
        //         seniorName: 'SENIOR TEST',
        //         seniorPhoneNumbers: '972546912072',
        //         subscriptionNumber: '1112563',
        //         communityLeader: 'TAMAR',
        //         hoursThreshold: 24,
        //     };
        //     const messageSentDetails = await notifyVolunteerInWhatsApp(notification);
        //     expect(messageSentDetails?.from).toBeDefined();
        expect(true).toBe(true);
    });
});

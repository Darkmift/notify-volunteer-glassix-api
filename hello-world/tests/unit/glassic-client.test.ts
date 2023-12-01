jest.mock('../../client/graphql/graphQlRequestClient', () => ({
    __esModule: true, // This is required for ES6 modules
    default: mockMakeGQLRequest,
}));

jest.mock('axios');
import axios from 'axios';

import { mockMakeGQLRequest } from '../../mocks/client/index.mock';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import mockSendMessageAttempt from '../../mocks/sendMEssageAttempResult.mock';
import { ContactVolunteerDetails } from '../../types';
import { messageVolunteerOnWhatsapp } from '../../client/glassix';

jest.setTimeout(10000);

describe('Unit test for app handler', function () {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const sendMessageAttemptClone = structuredClone(mockSendMessageAttempt);

    beforeEach(() => {
        mockedAxios.create.mockReturnThis();
        mockedAxios.post.mockResolvedValue({ data: sendMessageAttemptClone });

        mockMakeGQLRequest.mockClear();
    });
    it('sends a WhatsApp message and returns the response', async () => {
        // Prepare test data
        const messageOptions: ContactVolunteerDetails = {
            volunteerName: 'תמר שפירא',
            volunteerPhoneNumber: '97255500000',
            seniorName: 'אבי כהן',
            seniorPhoneNumber: '97255000000',
            subscriptionNumber: '420000',
            communityLeader: 'אין מידע',
            hoursThreshold: 24,
        };

        // Call your function
        const response = await messageVolunteerOnWhatsapp(messageOptions);
        console.log('🚀 ~ file: glassic-client.test.ts:41 ~ it ~ response:', response);

        // Assertions
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(response).toEqual(mockSendMessageAttempt);
    });
});

// client.test.ts
import { expect, describe, it } from '@jest/globals';
import { getTickets, getToken } from '../../../utils/client';

describe('getToken', () => {
    it('returns a token when GlassixApi.getToken is successful', async () => {
        const token = await getToken();

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(20);
    });
});

// client.test.ts

describe('getTickets', () => {
    it('returns tickets when the Glassix API is available and the environment variables are set correctly', async () => {
        const tickets = await getTickets();
        console.log('🚀 ~ file: client.test.ts:20 ~ it ~ tickets:', tickets);

        // Here you should check the properties of the tickets depending on the structure of the data returned by the Glassix API
        expect(tickets).toBeDefined();
        expect(tickets).toBeInstanceOf(Array);
    });
});

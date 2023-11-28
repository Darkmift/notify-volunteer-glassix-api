// client.test.ts
import { expect, describe, it } from '@jest/globals';
import { getToken } from '../../../utils/client';

describe('getToken', () => {
    it('returns a token when GlassixApi.getToken is successful', async () => {
        const token = await getToken();

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(20);
    });
});

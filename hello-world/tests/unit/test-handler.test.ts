jest.mock('../../client/graphql/graphQlRequestClient', () => ({
    __esModule: true, // This is required for ES6 modules
    default: mockMakeGQLRequest,
}));

jest.mock('axios');
import axios from 'axios';

import { mockMakeGQLRequest } from '../../mocks/client/index.mock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';
import { mockAwsEvent, mockMondayEvent } from '../../mocks/awsEvent';
import tryParse from '../../utils/tryparse';
import mockHelpRequester from '../../mocks/helpRequester.mock';
import mockSendMessageAttempt from '../../mocks/sendMEssageAttempResult.mock';
import { LINKED_VOLUNTEERS_COLUMN_ID } from '../../config/consts';

jest.setTimeout(10000);

describe('Unit test for app handler', function () {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    const sendMessageAttemptClone = structuredClone(mockSendMessageAttempt);
    let mockAwsEventClone = structuredClone(mockAwsEvent);
    // let mockMondayEventClone = structuredClone(mockMondayEvent);
    let mockHelpRequesterClone = structuredClone(mockHelpRequester);

    beforeEach(() => {
        mockHelpRequesterClone = structuredClone(mockHelpRequester);
        mockAwsEventClone = structuredClone(mockAwsEvent);
        // mockMondayEventClone = structuredClone(mockMondayEvent);
        mockedAxios.create.mockReturnThis();
        mockedAxios.post.mockResolvedValue({ data: sendMessageAttemptClone });

        mockMakeGQLRequest.mockClear();
    });

    it('Happy flow - full flow', async () => {
        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);

        const response = tryParse<{ challenge: string | null; triggerUuid: string | null; message: string }>(
            result.body,
        );
        expect(result.statusCode).toEqual(200);
        expect(response.message).toEqual('app init');
    });

    it('should handle no linked volunteers data', async () => {
        // Mock response to simulate no linked volunteers data
        mockHelpRequesterClone.items[0].column_values[0].column.id = 'connect_boards5';
        mockHelpRequesterClone.items[0].column_values[0].value = null;

        mockMakeGQLRequest.mockImplementationOnce(() => Promise.resolve(mockHelpRequesterClone));

        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);

        expect(result.statusCode).toEqual(500);
        expect(result.body).toContain('no linked volunteers data');
    });

    it('should handle no assigned volunteers', async () => {
        // Mock response to simulate no assigned volunteers
        // Mock response to simulate no linked volunteers data
        mockHelpRequesterClone.items[0].column_values[0].column.id = 'connect_boards5';
        mockHelpRequesterClone.items[0].column_values[0].value = '{"linkedPulseIds":[]}';

        mockMakeGQLRequest.mockImplementationOnce(() => Promise.resolve(mockHelpRequesterClone));

        const result: APIGatewayProxyResult = await lambdaHandler(mockAwsEventClone);

        expect(result.statusCode).toEqual(500);
        expect(result.body).toContain('no assigned volunteers');
    });
});

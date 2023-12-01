import { jest } from '@jest/globals';
import logger from '../../utils/logger-winston';
import {
    GET_ITEM_DATA,
    MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP,
    SET_REQUESTER_MULTIPLE_VALUES,
} from '../../client/graphql/queries';
import mockHelpRequester from '../helpRequester.mock';
import mockAssignedVolunteerResult from '../assignVolunteer.mock';
import mockVolunteerData from '../volunteer.mock';
// import mockVolunteerData from '../volunteer.mock';

export const mockMakeGQLRequest = jest.fn(
    async (query: string, variables: Record<string, unknown>): Promise<unknown> => {
        logger.log('🚀 ~ file: index.mock.ts:12 ~ { query, variables }:', { query, variables });

        switch (query) {
            case GET_ITEM_DATA:
                if (variables.itemType === 'volunteer') return mockVolunteerData;
                // else (variables.itemType === 'requester')
                return mockHelpRequester;
            // return mockVolunteerData;
            case MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP:
                return mockAssignedVolunteerResult;
            case SET_REQUESTER_MULTIPLE_VALUES:
                return mockAssignedVolunteerResult;
            default:
                return {};
        }
    },
);

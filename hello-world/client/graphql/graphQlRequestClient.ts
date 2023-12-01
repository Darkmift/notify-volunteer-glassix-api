import request from 'graphql-request';
import { MONDAY_API_URL } from '../../config/consts';
import env from '../../config';

const makeGQLRequest = async <T = unknown>(query: string, variables: Record<string, unknown>): Promise<T> => {
    return await request(MONDAY_API_URL, query, variables, {
        'Content-Type': 'application/json',
        Authorization: env.MONDAY_API_KEY,
        'API-Version': '2023-10',
    } as HeadersInit);
};

export default makeGQLRequest;

import 'dotenv/config';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import logger from './utils/logger-winston';
import tryparse from './utils/tryparse';
import { ContactVolunteerDetails, MondayEvent } from './types';
import { getItemData, moveHelpRequesterBackToRawList } from './client/graphql';
import {
    GROUP_RAW_LIST,
    HELPER_COMMUNITY_LEADER_COL_ID,
    HELPER_PHONE_COL_ID,
    LINKED_VOLUNTEERS_COLUMN_ID,
    VOLUNTEER_PHONE_COL_ID,
} from './config/consts';
import { ICommunityLeaderColValueParsed, ILinkedPulseIds, IPhoneColValueParsed } from './types/monday';
import { messageVolunteerOnWhatsapp } from './client/glassix';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { event: eventBody } = tryparse<{ event: MondayEvent }>(event?.body);
    logger.info('event', event);

    const responseBody = {
        challenge: eventBody?.challenge || null,
        triggerUuid: eventBody?.triggerUuid || null,
        message: 'app init',
    };
    const response = { statusCode: 200, body: JSON.stringify(responseBody) };
    let requestHelperId = -1;
    try {
        /**
         * we get the request helper data
         */
        const requestHelperData = await getItemData(eventBody.pulseId, 'requester');
        logger.log('🚀 ~ file: app.ts:33 ~ lambdaHandler ~ requestHelperData:', requestHelperData);

        // if an error is thrown in process we use in catch to return requester to raw group
        requestHelperId = parseInt(requestHelperData?.items[0]?.id);

        const linkedVolunteersColData = requestHelperData?.items[0]?.column_values?.find(
            (col) => col.column.id === LINKED_VOLUNTEERS_COLUMN_ID,
        );

        const linkedVolunteersParsed = tryparse<ILinkedPulseIds>(linkedVolunteersColData?.value);

        if (!linkedVolunteersParsed?.linkedPulseIds) {
            logger.warn('no linked volunteers data', { requestHelperData });
            throw new Error('no linked volunteers data');
        }

        const volunteerId = linkedVolunteersParsed?.linkedPulseIds[0]?.linkedPulseId;

        if (!volunteerId) {
            logger.warn('no assigned volunteers', { requestHelperData });
            throw new Error('no assigned volunteers');
        }

        const volunteerData = await getItemData(volunteerId, 'volunteer');
        logger.log('🚀 ~ file: app.ts:60 ~ lambdaHandler ~ volunteerData:', volunteerData);
        const volunteerPhoneCol = volunteerData?.items[0]?.column_values?.find(
            (col) => col.column.id === VOLUNTEER_PHONE_COL_ID,
        );
        const requestHelperDataPhoneCol = requestHelperData?.items[0]?.column_values?.find(
            (col) => col.column.id === HELPER_PHONE_COL_ID,
        );
        const requestHelperDataCommunityCol = requestHelperData?.items[0]?.column_values?.find(
            (col) => col.column.id === HELPER_COMMUNITY_LEADER_COL_ID,
        );

        const requestHelperDataCommunityColParsed = tryparse<ICommunityLeaderColValueParsed>(
            requestHelperDataCommunityCol?.value,
        );

        logger.log('🚀 ~ file: app.ts:79 ~ lambdaHandler ~ requestHelperDataCommunityColParsed:', {
            requestHelperDataCommunityColParsed,
        });

        const volunteerPhoneColParsed = tryparse<IPhoneColValueParsed>(volunteerPhoneCol?.value);
        const seniorPhoneNumber = requestHelperDataPhoneCol?.value?.replace(/"/g, '').replace(/'/g, '') + '';
        logger.log('🚀 ~ file: app.ts:83 ~ lambdaHandler ~ seniorPhoneNumber:', seniorPhoneNumber);

        const messageOptions: ContactVolunteerDetails = {
            volunteerPhoneNumber: volunteerPhoneColParsed?.phone,
            volunteerName: volunteerData.items[0].name,
            seniorName: requestHelperData.items[0].name,
            seniorPhoneNumber: seniorPhoneNumber,
            subscriptionNumber: requestHelperData.items[0].name,
            communityLeader: requestHelperDataCommunityColParsed?.post_id
                ? requestHelperDataCommunityColParsed?.post_id
                : 'אין מידע',
            hoursThreshold: 24,
        };
        logger.log('🚀 ~ file: app.ts:92 ~ lambdaHandler ~ messageOptions:', { messageOptions });

        const messageSendResult = await messageVolunteerOnWhatsapp(messageOptions);
        logger.log('🚀 ~ file: app.ts:103 ~ lambdaHandler ~ result:', messageSendResult);
        if (!messageSendResult?.status?.length) {
            throw new Error('message sending may have failed');
        }

        return response;
    } catch (err) {
        const error = err as Error;
        logger.info('requestHelperId', { requestHelperId });
        logger.error('Uncaught error in main flow', error);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: error?.message || 'some error happened',
            challenge: responseBody.challenge,
            triggerUuid: responseBody.triggerUuid,
        });
        logger.log('failure - response', response);
        try {
            moveHelpRequesterBackToRawList({
                helpRequesterId: requestHelperId,
                groupId: GROUP_RAW_LIST,
            });
        } catch (error) {
            logger.error('error in moving requester back to raw list', error as Error);
        }
        return response;
    }
};

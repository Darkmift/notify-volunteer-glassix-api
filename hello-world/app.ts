import 'dotenv/config';
import Lambda from 'aws-sdk/clients/lambda';

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
import { ICommunityLeaderColValueParsed, ILinkedPulseIds, IPhoneColValueParsed, ItemElement } from './types/monday';
import env from './config/index';

async function getRequestHelperData(id: number): Promise<ItemElement> {
    logger.info('Get request helper data for id', { id });
    const requestHelperData = await getItemData(id, 'requester');
    logger.debug('Helper data is:', requestHelperData);
    return requestHelperData?.items[0];
}

async function getVolunteerData(requestHelperData: ItemElement): Promise<ItemElement> {
    const linkedVolunteersColData = requestHelperData.column_values?.find(
        (col) => col.column.id === LINKED_VOLUNTEERS_COLUMN_ID,
    );

    const linkedVolunteersParsed = tryparse<ILinkedPulseIds>(linkedVolunteersColData?.value);

    if (!linkedVolunteersParsed?.linkedPulseIds) {
        logger.error('no linked volunteers data', { requestHelperData });
        throw new Error('no linked volunteers data');
    }

    const volunteerId = linkedVolunteersParsed?.linkedPulseIds[0]?.linkedPulseId;

    if (!volunteerId) {
        logger.error('no assigned volunteers', { requestHelperData });
        throw new Error('no assigned volunteers');
    }

    const volunteerData = await getItemData(volunteerId, 'volunteer');
    if (!volunteerData.items) {
        logger.error('Volunteer data not found for id:', { volunteerId });
    }

    return volunteerData.items[0];
}

async function sendNotification(requestHelper: ItemElement, volunteer: ItemElement) {
    const glassixMessageOptions = constructGlassixMessageOptions(requestHelper, volunteer);
    const lambdaParams = {
        FunctionName: env.IL_LAMBDA_ARN,
        InvocationType: 'RequestResponse', // use 'RequestResponse' if you need the response or Event
        Payload: JSON.stringify(glassixMessageOptions),
    };
    logger.info('Involing Glassix lambda');
    return await lambda.invoke(lambdaParams).promise();
}

function constructGlassixMessageOptions(requestHelper: ItemElement, volunteer: ItemElement) {
    const volunteerPhoneCol = volunteer.column_values?.find((col) => col.column.id === VOLUNTEER_PHONE_COL_ID);
    const requestHelperDataPhoneCol = requestHelper.column_values?.find((col) => col.column.id === HELPER_PHONE_COL_ID);
    const requestHelperDataCommunityCol = requestHelper.column_values?.find(
        (col) => col.column.id === HELPER_COMMUNITY_LEADER_COL_ID,
    );

    const requestHelperDataCommunityColParsed = tryparse<ICommunityLeaderColValueParsed>(
        requestHelperDataCommunityCol?.value,
    );

    const volunteerPhoneColParsed = tryparse<IPhoneColValueParsed>(volunteerPhoneCol?.value);
    const seniorPhoneNumber = requestHelperDataPhoneCol?.value?.replace(/"/g, '').replace(/'/g, '') + '';
    logger.info('Help request phone number is', { seniorPhoneNumber });

    // we get the name from column values of requester
    const requestHelperNameColValue = requestHelper.column_values.find((col) => col.column.id === 'text');

    const messageOptions: ContactVolunteerDetails = {
        volunteerPhoneNumber: volunteerPhoneColParsed?.phone,
        volunteerName: requestHelperNameColValue?.value + '',
        seniorName: requestHelper.name,
        seniorPhoneNumber: seniorPhoneNumber,
        subscriptionNumber: requestHelper.name,
        communityLeader: requestHelperDataCommunityColParsed?.post_id
            ? requestHelperDataCommunityColParsed?.post_id
            : 'אין מידע',
        hoursThreshold: 24,
    };
    logger.debug('Message options for Glassix are', messageOptions);
    return messageOptions;
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const lambda = new Lambda({ region: 'il-central-1' });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { event: eventBody } = tryparse<{ event: MondayEvent }>(event?.body);
    logger.info('event', event);

    const responseBody = {
        challenge: eventBody?.challenge || null,
        triggerUuid: eventBody?.triggerUuid || null,
        message: 'app init',
    };
    const response = { statusCode: 200, body: JSON.stringify(responseBody) };
    const requestHelperId = eventBody.pulseId;
    try {
        const requestHelperData = await getRequestHelperData(requestHelperId);
        const volunteerData = await getVolunteerData(requestHelperData);
        const notificationSendingResult = await sendNotification(requestHelperData, volunteerData);
        logger.debug('Notification sending result', notificationSendingResult);
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

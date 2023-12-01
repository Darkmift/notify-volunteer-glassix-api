import { APIGatewayProxyEvent } from 'aws-lambda';
import { MondayEvent } from '../types';

export const mockMondayEvent: { event: MondayEvent } = {
    event: {
        app: 'monday',
        type: 'move_pulse_into_group',
        triggerTime: '2023-11-30T17:22:34.435Z',
        subscriptionId: 15213036,
        userId: 51646340,
        originalTriggerUuid: null,
        boardId: 1317064001,
        pulseId: 1328793984, //itemid
        sourceGroupId: 'new_group80930',
        destGroupId: 'new_group6527',
        destGroup: { id: 'new_group6527', title: 'נשלחה הודעה למתנדב', color: '#FF158A', is_top_group: false },
        triggerUuid: 'def704504b1a01abfe0d0f9249f0d507',
    },
};

export const mockAwsEvent: APIGatewayProxyEvent = {
    httpMethod: 'get',
    body: JSON.stringify(mockMondayEvent),
    headers: {},
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/hello',
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'get',
        identity: {
            accessKey: '',
            accountId: '',
            apiKey: '',
            apiKeyId: '',
            caller: '',
            clientCert: {
                clientCertPem: '',
                issuerDN: '',
                serialNumber: '',
                subjectDN: '',
                validity: { notAfter: '', notBefore: '' },
            },
            cognitoAuthenticationProvider: '',
            cognitoAuthenticationType: '',
            cognitoIdentityId: '',
            cognitoIdentityPoolId: '',
            principalOrgId: '',
            sourceIp: '',
            user: '',
            userAgent: '',
            userArn: '',
        },
        path: '/hello',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/hello',
        stage: 'dev',
    },
    resource: '',
    stageVariables: {},
};

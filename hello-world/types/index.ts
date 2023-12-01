export interface ContactVolunteerDetails {
    volunteerPhoneNumber: string;
    volunteerName: string;
    seniorName: string;
    seniorPhoneNumber: string;
    subscriptionNumber: string;
    communityLeader: string;
    hoursThreshold: number;
}

export type MessageType = {
    text: string;
    html: string;
    protocolType: string;
    attachmentUris: null;
    from: string;
    to: string;
    dateTime: string;
    providerMessageId: string;
    departmentId: string;
    status: string;
    files: null;
    serviceProvider: number;
    level: string;
    message: string;
    timestamp: string;
};

export interface MondayEvent {
    app: string;
    type: string;
    triggerTime: string;
    subscriptionId: number;
    userId: number;
    originalTriggerUuid: string | null;
    boardId: number;
    pulseId: number;
    sourceGroupId: string;
    destGroupId: string;
    destGroup: {
        id: string;
        title: string;
        color: string;
        is_top_group: boolean;
    };
    triggerUuid: string;
    challenge?: string;
}

export type MoveHelpRequesterBackToRawListGroupVariables = {
    helpRequesterId: number;
    groupId: string;
};

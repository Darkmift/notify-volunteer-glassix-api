import { MoveHelpRequesterBackToRawListGroupVariables } from '../../types';
import { ItemsResponse } from '../../types/monday';
import makeGQLRequest from './graphQlRequestClient';
import { GET_ITEM_DATA, MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP } from './queries';

// get item data
export const getItemData = async (itemId: number, itemType: 'volunteer' | 'requester'): Promise<ItemsResponse> => {
    return await makeGQLRequest(GET_ITEM_DATA, {
        itemId,
        itemType,
    });
};

// move help requester back to raw list

export const moveHelpRequesterBackToRawList = async ({
    helpRequesterId,
    groupId,
}: MoveHelpRequesterBackToRawListGroupVariables): Promise<void> => {
    await makeGQLRequest(MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP, { helpRequesterId, groupId });
};

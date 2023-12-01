import { gql } from 'graphql-request';

export const GET_ITEM_DATA = gql`
    query GetItemData($itemId: ID!) {
        items(ids: [$itemId]) {
            id
            name
            group {
                id
                title
            }
            column_values {
                value
                column {
                    id
                    title
                }
            }
        }
    }
`;

export const MOVE_HELPREQUESTER_BACK_TO_RAWLIST_GROUP = gql`
    mutation ChangeColumnValue($helpRequesterId: ID!, $groupId: String!) {
        move_item_to_group(group_id: $groupId, item_id: $helpRequesterId) {
            id
        }
    }
`;

export const SET_REQUESTER_MULTIPLE_VALUES = gql`
    mutation SetRequesterMultipleValues($itemId: ID!, $boardId: ID!, $groupId: String!, $columnValues: JSON!) {
        change_multiple_column_values(item_id: $itemId, board_id: $boardId, column_values: $columnValues) {
            id
        }
        move_item_to_group(group_id: $groupId, item_id: $itemId) {
            id
        }
    }
`;

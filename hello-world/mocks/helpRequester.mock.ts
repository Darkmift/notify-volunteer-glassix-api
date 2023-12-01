// value of a language column
export const mockCheckBoxLanguageColValue = { checked: true, changed_at: '2023-11-27T11:59:51.688Z' };
// assigned volunteer id
export const mockLinkedPulseIdsColValue = {
    changed_at: '2023-11-27T12:00:16.535Z',
    linkedPulseIds: [{ linkedPulseId: 1316953659 }],
};

const mockHelpRequester = {
    items: [
        {
            id: '1328793984',
            name: '427376',
            group: {
                id: 'new_group6527',
                title: 'נשלחה הודעה למתנדב',
            },
            column_values: [
                {
                    value: null,
                    column: {
                        id: 'subitems',
                        title: 'Subitems',
                    },
                },
                {
                    value: '"אוחנה  חביב"',
                    column: {
                        id: 'text',
                        title: 'שם מלא ↗️',
                    },
                },
                {
                    value: '"089715969"',
                    column: {
                        id: 'text0',
                        title: 'טלפון',
                    },
                },
                {
                    value: '"אופקים"',
                    column: {
                        id: 'text4',
                        title: 'עיר ↗️',
                    },
                },
                {
                    value: '"אור החיים"',
                    column: {
                        id: 'text7',
                        title: 'רחוב',
                    },
                },
                {
                    value: '"44"',
                    column: {
                        id: 'text8',
                        title: 'מספר בית',
                    },
                },
                {
                    value: '"4"',
                    column: {
                        id: 'text3',
                        title: 'דירה',
                    },
                },
                {
                    value: '{"checked":false}',
                    column: {
                        id: 'checkbox',
                        title: 'דובר עברית',
                    },
                },
                {
                    value: JSON.stringify(mockCheckBoxLanguageColValue),
                    column: {
                        id: 'check',
                        title: 'דובר רוסית',
                    },
                },
                {
                    value: JSON.stringify(mockLinkedPulseIdsColValue),
                    column: {
                        id: 'connect_boards5',
                        title: 'מתנדב מטפל',
                    },
                },
                {
                    value: null,
                    column: {
                        id: 'date',
                        title: 'תאריך שיבוץ למתנדב',
                    },
                },
                {
                    value: null,
                    column: {
                        id: 'dropdown',
                        title: 'שפות',
                    },
                },
                {
                    value: '{"index":0,"post_id":null}',
                    column: {
                        id: 'label5',
                        title: 'קהילה',
                    },
                },
                {
                    value: null,
                    column: {
                        id: 'date42',
                        title: 'זמן לשליחת הודעה',
                    },
                },
                {
                    value: '{"index":5,"post_id":null,"changed_at":"2023-11-30T17:22:16.032Z"}',
                    column: {
                        id: 'color',
                        title: 'האם ענה ↘️',
                    },
                },
            ],
        },
    ],
};

export default mockHelpRequester;

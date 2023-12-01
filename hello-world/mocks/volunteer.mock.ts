// value of a language column
export const checkBoxLanguageColValue = { checked: true, changed_at: '2023-11-23T18:05:47.807Z' };
// assigned volunteer id
export const linkedPulseIdsColValue = {
    changed_at: '2023-11-26T06:20:38.780Z',
    linkedPulseIds: [
        { linkedPulseId: 1328793974 },
        { linkedPulseId: 1328793967 },
        { linkedPulseId: 1328793922 },
        { linkedPulseId: 1328793912 },
        { linkedPulseId: 1328793984 },
    ],
};
//email
export const emailColValue = { text: 'tamarshap@gmail.com', email: 'tamarshap@gmail.com' };
export const phoneColValue = { phone: '972547722259', changed_at: '2023-11-13T11:21:11.167Z', countryShortName: 'IL' };

const mockVolunteerData = {
    items: [
        {
            id: '1316953659',
            name: 'תמר שפירא',
            group: {
                id: 'topics',
                title: 'מתנדבים פעילים',
            },
            column_values: [
                {
                    value: JSON.stringify(emailColValue),
                    column: {
                        id: 'email',
                        title: 'אימייל',
                    },
                },
                {
                    value: '"206573156"',
                    column: {
                        id: 'text',
                        title: 'תעודת זהות',
                    },
                },
                {
                    value: JSON.stringify(phoneColValue),
                    column: {
                        id: 'phone',
                        title: 'מספר טלפון',
                    },
                },
                {
                    value: JSON.stringify(checkBoxLanguageColValue),
                    column: {
                        id: 'checkbox',
                        title: 'דובר רוסית',
                    },
                },
                {
                    value: '{"checked":false}',
                    column: {
                        id: 'checkbox4',
                        title: 'דובר עברית',
                    },
                },
                {
                    value: '{"ids":[3],"changed_at":"2023-11-13T11:21:11.131Z"}',
                    column: {
                        id: 'dropdown',
                        title: 'יכול לעזור ב...',
                    },
                },
                {
                    value: '{"ids":[2,3],"changed_at":"2023-11-13T11:21:11.169Z"}',
                    column: {
                        id: 'dropdown5',
                        title: 'הכשרה רלוונטית בהיבטי בריאות',
                    },
                },
                {
                    value: '{"checked":false}',
                    column: {
                        id: 'checkbox7',
                        title: 'מילאתי את הטופס בלינק',
                    },
                },
                {
                    value: JSON.stringify(linkedPulseIdsColValue),
                    column: {
                        id: 'board_relation',
                        title: 'מבקשי סיוע בטיפול',
                    },
                },
                {
                    value: '"6"',
                    column: {
                        id: 'numbers',
                        title: 'capacity',
                    },
                },
            ],
        },
    ],
};

export default mockVolunteerData;

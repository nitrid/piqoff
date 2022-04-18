export const menu = 
[
    {
        id: 'srv',
        text: 'Servis',
        expanded: false,
        items: 
        [
            {
                id: 'P0001',
                text: 'Terminal',
                path: '../pages/terminal.js'
            }
        ]
    },
    {
        id: 'usr',
        text: 'Kullanıcı',
        expanded: false,
        items: 
        [
            {
                id: 'P0002',
                text: 'Kullanıcılar',
                path: '../pages/userPage.js'
            },
            {
                id: 'P0003',
                text: 'Roller',
                path: '../pages/test.js'
            },
            {
                id: 'P0004',
                text: 'TEST_MAHİR',
                path: '../pages/test_mahir.js'
            },
            {
                id: 'P0005',
                text: 'TEST_ALI',
                path: '../pages/test.js'
            }
        ]
    },
    {
        id: 'prm',
        text: 'Parametre',
        expanded: false,
        items: []
    },
    {
        id: 'acs',
        text: 'Yetkilendirme',
        expanded: false,
        items: []
    }
]
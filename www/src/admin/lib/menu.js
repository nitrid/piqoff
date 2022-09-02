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
                path: 'terminal'
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
                path: 'userPage'
            },
            {
                id: 'P0003',
                text: 'Roller',
                path: 'rolesPage'
            },
        ]
    },
    {
        id: 'prm_01',
        text: 'Parametre',
        expanded: false,
        items: 
        [
            {
                id: 'prm_01_001',
                text: 'Sistem Parametreleri',
                path: 'systemParameter'
            },
        ]
    },
    {
        id: 'acs',
        text: 'Yetkilendirme',
        expanded: false,
        items: []
    },
    {
        id: 'menu',
        text: 'Menü Düzenleme',
        expanded: false,
        items: 
        [
            {
                id: 'menu.01',
                text: 'Kullanıcı Menü Ayarları',
                path: 'menuEdit'
            },
            
        ]
    },
    {
        
        id: 'test',
        text: 'test',
        path: 'menutest'
        
    }
]
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
            },
            {
                id: 'P0001_1',
                text: 'Cihaz Seçimi',
                path: 'deviceChoose'
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
        id: 'prm',
        text: 'Parametre',
        expanded: false,
        items: 
        [
            {
                id: 'prm_01',
                text: 'Sistem Parametreleri',
                expanded: false,
                items:
                [
                    {
                        id: 'prm_01_001',
                        text: 'Off',
                        path: 'parameters/systemParamOff'
                    },
                    {
                        id: 'prm_01_002',
                        text: 'Pos',
                        path: 'parameters/systemParamPos'
                    },
                    {
                        id: 'prm_01_003',
                        text: 'Mob',
                        path: 'parameters/systemParamMob'
                    }
                ]
            },
            {
                id: 'prm_02',
                text: 'Evrak Parametreleri',
                expanded: false,
                items:
                [
                    {
                        id: 'prm_02_001',
                        text: 'Off',
                        path: 'parameters/docParamOff'
                    },
                    {
                        id: 'prm_02_003',
                        text: 'Mob',
                        path: 'parameters/docParamMob'
                    }
                ]
            },
            {
                id: 'prm_03',
                text: 'Element Parametreleri',
                expanded: false,
                items:
                [
                    {
                        id: 'prm_03_001',
                        text: 'Off',
                        path: 'parameters/elementParamOff'
                    },
                    {
                        id: 'prm_03_002',
                        text: 'Pos',
                        path: 'parameters/elementParamPos'
                    },
                    {
                        id: 'prm_03_003',
                        text: 'Mob',
                        path: 'parameters/elementParamMob'
                    }
                ]
            },
        ]
    },
    {
        id: 'acs',
        text: 'Yetkilendirme',
        expanded: false,
        items: 
        [
            {
                id: 'acs_01',
                text: 'Off Yetkileri',
                path: 'access/accessOff'
            },
            {
                id: 'acs_02',
                text: 'Pos Yetkileri',
                path: 'access/accessPos'
            },
            {
                id: 'acs_03',
                text: 'Mob Yetkileri',
                path: 'access/accessMob'
            },
        ]
    },
    {
        id: 'menu',
        text: 'Menü Düzenleme',
        expanded: false,
        items: 
        [
            {
                id: 'menu_01',
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
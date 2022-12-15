export const menu = (e) => 
{
    return [
        {
            id: 'srv',
            text: e.t('menu.service'), //Servis
            expanded: false,
            items: 
            [
                {
                    id: 'P0001',
                    text:  e.t('menu.P0001'), // Terminal
                    path: 'terminal'
                },
                {
                    id: 'P0001_1',
                    text: e.t('menu.P0001_1'), // Cihaz Seçimi
                    path: 'deviceChoose'
                }
            ]
        },
        {
            id: 'usr',
            text: e.t('menu.usr'), // Kullanıcı
            expanded: false,
            items: 
            [
                {
                    id: 'P0002',
                    text: e.t('menu.P0002'), // Kullanıcılar
                    path: 'userPage'
                },
                {
                    id: 'P0003',
                    text: e.t('menu.P0003'), // Roller
                    path: 'rolesPage'
                },
            ]
        },
        {
            id: 'prm',
            text: e.t('menu.prm'), // Parametre
            expanded: false,
            items: 
            [
                {
                    id: 'prm_01',
                    text: e.t('menu.prm_01'), // Sistem Parametreleri
                    expanded: false,
                    items:
                    [
                        {
                            id: 'prm_01_001',
                            text: e.t('menu.prm_01_001'), /// OFF
                            path: 'parameters/systemParamOff'
                        },
                        {
                            id: 'prm_01_002',
                            text: e.t('menu.prm_01_002'), // POS
                            path: 'parameters/systemParamPos'
                        },
                        {
                            id: 'prm_01_003',
                            text: e.t('menu.prm_01_003'), // MOBIL
                            path: 'parameters/systemParamMob'
                        }
                    ]
                },
                {
                    id: 'prm_02',
                    text:  e.t('menu.prm_02'), // Evrak Parametreleri
                    expanded: false,
                    items:
                    [
                        {
                            id: 'prm_02_001',
                            text:  e.t('menu.prm_02_001'), //OFF
                            path: 'parameters/docParamOff'
                        },
                        {
                            id: 'prm_02_003',
                            text: e.t('menu.prm_02_003'), //MOBIL
                            path: 'parameters/docParamMob'
                        }
                    ]
                },
                {
                    id: 'prm_03',
                    text: e.t('menu.prm_03'), // Element Parametreleri
                    expanded: false,
                    items:
                    [
                        {
                            id: 'prm_03_001',
                            text: e.t('menu.prm_03_001'), // OFF
                            path: 'parameters/elementParamOff'
                        },
                        {
                            id: 'prm_03_002',
                            text: e.t('menu.prm_03_002'), // POS
                            path: 'parameters/elementParamPos'
                        },
                        {
                            id: 'prm_03_003',
                            text: e.t('menu.prm_03_003'), // MOB
                            path: 'parameters/elementParamMob'
                        }
                    ]
                },
            ]
        },
        {
            id: 'acs',
            text: e.t('menu.acs'), // Yektilendirme
            expanded: false,
            items: 
            [
                {
                    id: 'acs_01',
                    text: e.t('menu.acs_01'), // OFF Yetkileri
                    path: 'access/accessOff'
                },
                {
                    id: 'acs_02',
                    text: e.t('menu.acs_02'), // POs Yetkileri
                    path: 'access/accessPos'
                },
                {
                    id: 'acs_03',
                    text: e.t('menu.acs_03'), // MOB Yetkileri
                    path: 'access/accessMob'
                },
            ]
        },
        {
            id: 'menu',
            text: e.t('menu.menu'), // Menü Düzenleme
            expanded: false,
            items: 
            [
                {
                    id: 'menu_01',
                    text: e.t('menu.menu_01'), // Kullanıcı Menü Ayarları
                    path: 'menuEdit'
                },
            ]
        },
    ]
}
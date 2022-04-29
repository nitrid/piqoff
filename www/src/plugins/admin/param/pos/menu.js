export const menu =
[
    {
        id: 'prm_pos',
        text: 'POS',
        expanded: false,
        items: 
        [
            {
                id: 'prm_piqpos_01',
                text: 'Kullanıcı Parametreleri',
                path: '../../plugins/admin/param/pos/user_prm.js'
            },
            {
                id: 'prm_piqpos_02',
                text: 'Cihaz Parametreleri',
                path: '../../plugins/admin/param/pos/device_param.js'
            },
            {
                id: 'prm_piqpos_03',
                text: 'Sistem Genel Parametreleri',
                path: '../../plugins/admin/param/pos/system_param.js'
            }
        ]
    },
    
]
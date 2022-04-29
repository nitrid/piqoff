//*********************************************************************/
// ADMIN PANELI PLUGIN YAPISI ICIN MENU - 07.09.2021 - ALI KEMAL KARACA
// DOC DOSYASINA BAKINIZ...
//*********************************************************************/
export const menu =
[
    {
        id: 'lic',
        text: 'Lisans',
        expanded: false,
        items: 
        [
            {
                id: 'lic_01',
                text: 'Lisans Listesi',
                path: '../../plugins/admin/licence/licence_list.js'
            }
        ]
    },
]
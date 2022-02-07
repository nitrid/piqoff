export const menu = (e) => 
{
    return [
        {
            id: 'stk',
            text: e.t('menu.stk'),//Stok,
            expanded: false,
            items: 
            [
                {
                    id: 'stk_01',
                    text : e.t('menu.stk_01'),//'Tanımlar'
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_01_001',
                            text: e.t('menu.stk_01_001'),//'Stok Tanımları',
                            path: '../pages/items/cards/itemCard.js'
                        },
                        {
                            id: 'stk_01_002',
                            text: e.t('menu.stk_01_002'),//'Barkod Tanımları',
                            path: '../pages/items/cards/barcodeCard.js'
                        },
                        {
                            id: 'stk_01_003',
                            text: e.t('menu.stk_01_003'),//'Fiyat Tanımları',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_01_004',
                            text: e.t('menu.stk_01_004'),//'Birim Tanımları',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_01_005',
                            text: e.t('menu.stk_01_005'),//'Multi Kod Tanımları',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_01_006',
                            text: e.t('menu.stk_01_006'),//'Depo Tanımları',
                            path: '../pages/items/items_list.js'
                        },
                    ]
                },
                {
                    id: 'stk_02',
                    text : e.t('menu.stk_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_02_001',
                            text: e.t('menu.stk_02_001'),//'Sayım Evrakı',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_02_002',
                            text: e.t('menu.stk_02_002'),//'Depolar Arası Sevk',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_02_003',
                            text: e.t('menu.stk_02_003'),//'Fire Giriş Çıkış Fişi',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'stk_02_004',
                            text: e.t('menu.stk_02_004'),//'Sarf Giriş Çıkış Fişi',
                            path: '../pages/items/items_list.js'
                        }
                    ]
                },
                {
                    id: 'stk_03',
                    text : e.t('menu.stk_03'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_03_001',
                            text: e.t('menu.stk_03_001'),//'Stok Listesi',
                            path: '../pages/items/lists/itemList.js'
                        },
                        {
                            id: 'stk_03_002',
                            text: e.t('menu.stk_03_002'),//'Fiyat Listesi',
                            path: '../pages/items/lists/priceList.js'
                        },
                        {
                            id: 'stk_03_003',
                            text: e.t('menu.stk_03_003'),//'Barkod Listesi',
                            path: '../pages/items/lists/barcodeList.js'
                        },
                        {
                            id: 'stk_03_004',
                            text: e.t('menu.stk_03_004'),//'Depo Listesi',
                            path: '../pages/items/lists/depotList.js'
                        },
                        {
                            id: 'stk_03_005',
                            text: e.t('menu.stk_03_005'),//'Multi Kod Listesi',
                            path: '../pages/items/items_list.js'
                        },
                    ]
                },
                {
                    id: 'stk_04',
                    text : e.t('menu.stk_04'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'cri',
            text: e.t('menu.cri'),//'Cari',
            expanded: false,
            items: 
            [
                {
                    id: 'cri_01',
                    text : e.t('menu.cri_01'),//'Tanımlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_01_001',
                            text: e.t('menu.cri_01_001'),//'Cari Tanımları',
                            path: '../pages/customers/cards/customerCard.js'
                        },
                        {
                            id: 'cri_01_002',
                            text: e.t('menu.cri_01_002'),//'Adres Tanımları',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'cri_01_003',
                            text: e.t('menu.cri_01_003'),//'Grup Tanımları',
                            path: '../pages/items/items_list.js'
                        }
                    ]
                },
                {
                    id: 'cri_02',
                    text : e.t('menu.cri_02'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_02_001',
                            text: e.t('menu.cri_02_001'),//'Cari Listesi',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'cri_02_002',
                            text: e.t('menu.cri_02_002'),//'Adres Listesi',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'cri_02_003',
                            text: e.t('menu.cri_02_003'),//'Grup Listesi',
                            path: '../pages/items/items_list.js'
                        }
                    ]
                },
                {
                    id: 'cri_03',
                    text : e.t('menu.cri_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'ftr',
            text: e.t('menu.ftr'),//'Fatura',
            expanded: false,
            items: 
            [
                {
                    id: 'ftr_01',
                    text : e.t('menu.ftr_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'ftr_01_001',
                            text: e.t('menu.ftr_01_001'),//'Alış Fatura Listesi',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'ftr_01_002',
                            text: e.t('menu.ftr_01_002'),//'Satış Fatura Listesi',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'ftr_01_003',
                            text: e.t('menu.ftr_01_003'),//'Fiyat Farkı Fatura Listesi',
                            path: '../pages/items/items_list.js'
                        }
                    ]
                },
                {
                    id: 'ftr_02',
                    text : e.t('menu.ftr_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'ftr_02_001',
                            text: e.t('menu.ftr_02_001'),//'Alış Faturası',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'ftr_02_002',
                            text: e.t('menu.ftr_02_002'),//'Satış Faturası',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'ftr_02_003',
                            text: e.t('menu.ftr_02_003'),//'Fiyat Farkı Faturası',
                            path: '../pages/items/items_list.js'
                        },
                        {
                            id: 'ftr_02_004',
                            text: e.t('menu.ftr_02_004'),//'Şubeler Arası Satış',
                            path: '../pages/items/items_list.js'
                        }
                    ]
                },
                {
                    id: 'ftr_03',
                    text : e.t('menu.ftr_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        }
    ]
}
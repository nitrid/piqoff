export const menu = 
[
    {
        id: 'stk',
        text: 'Stok',
        expanded: false,
        items: 
        [
            {
                id: 'stk_01',
                text : 'Tanımlar',
                expanded: false,
                items: 
                [
                    {
                        id: 'stk_01_001',
                        text: 'Stok Tanımları',
                        path: '../pages/items/cards/itemCard.js'
                    },
                    {
                        id: 'stk_01_002',
                        text: 'Barkod Tanımları',
                        path: '../pages/items/cards/barcodeCard.js'
                    },
                    {
                        id: 'stk_01_003',
                        text: 'Fiyat Tanımları',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_01_004',
                        text: 'Birim Tanımları',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_01_005',
                        text: 'Multi Kod Tanımları',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_01_006',
                        text: 'Depo Tanımları',
                        path: '../pages/items/items_list.js'
                    },
                ]
            },
            {
                id: 'stk_02',
                text : 'Evraklar',
                expanded: false,
                items: 
                [
                    {
                        id: 'stk_02_001',
                        text: 'Sayım Evrakı',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_02_002',
                        text: 'Depolar Arası Sevk',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_02_003',
                        text: 'Fire Giriş Çıkış Fişi',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'stk_02_004',
                        text: 'Sarf Giriş Çıkış Fişi',
                        path: '../pages/items/items_list.js'
                    }
                ]
            },
            {
                id: 'stk_03',
                text : 'Listeler',
                expanded: false,
                items: 
                [
                    {
                        id: 'stk_03_001',
                        text: 'Stok Listesi',
                        path: '../pages/items/lists/itemList.js'
                    },
                    {
                        id: 'stk_03_002',
                        text: 'Fiyat Listesi',
                        path: '../pages/items/lists/priceList.js'
                    },
                    {
                        id: 'stk_03_003',
                        text: 'Barkod Listesi',
                        path: '../pages/items/lists/barcodeList.js'
                    },
                    {
                        id: 'stk_03_004',
                        text: 'Depo Listesi',
                        path: '../pages/items/lists/depotList.js'
                    },
                    {
                        id: 'stk_03_005',
                        text: 'Multi Kod Listesi',
                        path: '../pages/items/items_list.js'
                    },
                ]
            },
            {
                id: 'stk_04',
                text : 'Raporlar',
                expanded: false,
            }
        ]
    },
    {
        id: 'cri',
        text: 'Cari',
        expanded: false,
        items: 
        [
            {
                id: 'cri_01',
                text : 'Tanımlar',
                expanded: false,
                items: 
                [
                    {
                        id: 'cri_01_001',
                        text: 'Cari Tanımları',
                        path: '../pages/customers/cards/customerCard.js'
                    },
                    {
                        id: 'cri_01_002',
                        text: 'Adres Tanımları',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'cri_01_003',
                        text: 'Grup Tanımları',
                        path: '../pages/items/items_list.js'
                    }
                ]
            },
            {
                id: 'cri_02',
                text : 'Listeler',
                expanded: false,
                items: 
                [
                    {
                        id: 'cri_02_001',
                        text: 'Cari Listesi',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'cri_02_002',
                        text: 'Adres Listesi',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'cri_02_003',
                        text: 'Grup Listesi',
                        path: '../pages/items/items_list.js'
                    }
                ]
            },
            {
                id: 'cri_04',
                text : 'Raporlar',
                expanded: false,
            }
        ]
    },
    {
        id: 'ftr',
        text: 'Fatura',
        expanded: false,
        items: 
        [
            {
                id: 'ftr_01',
                text : 'Listeler',
                expanded: false,
                items: 
                [
                    {
                        id: 'ftr_01_001',
                        text: 'Alış Fatura Listesi',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'ftr_01_002',
                        text: 'Satış Fatura Listesi',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'ftr_01_003',
                        text: 'Fiyat Farkı Fatura Listesi',
                        path: '../pages/items/items_list.js'
                    }
                ]
            },
            {
                id: 'ftr_02',
                text : 'Evraklar',
                expanded: false,
                items: 
                [
                    {
                        id: 'ftr_02_001',
                        text: 'Alış Faturası',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'ftr_02_002',
                        text: 'Satış Faturası',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'ftr_02_003',
                        text: 'Fiyat Farkı Faturası',
                        path: '../pages/items/items_list.js'
                    },
                    {
                        id: 'ftr_02_004',
                        text: 'Şubeler Arası Satış',
                        path: '../pages/items/items_list.js'
                    }
                ]
            },
            {
                id: 'ftr_04',
                text : 'Raporlar',
                expanded: false,
            }
        ]
    }
]
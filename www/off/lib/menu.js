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
                        // {
                        //     id: 'stk_01_003',
                        //     text: e.t('menu.stk_01_003'),//'Fiyat Tanımları',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // },
                        // {
                        //     id: 'stk_01_004',
                        //     text: e.t('menu.stk_01_004'),//'Birim Tanımları',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // },
                        // {
                        //     id: 'stk_01_005',
                        //     text: e.t('menu.stk_01_005'),//'Multi Kod Tanımları',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // },
                        {
                            id: 'stk_01_006',
                            text: e.t('menu.stk_01_006'),//'Depo Tanımları',
                            path: '../pages/items/cards/depotCard.js'
                        },
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
                        // {
                        //     id: 'stk_03_004',
                        //     text: e.t('menu.stk_03_004'),//'Depo Listesi',
                        //     path: '../pages/items/lists/depotList.js'
                        // },
                        {
                            id: 'stk_03_005',
                            text: e.t('menu.stk_03_005'),//'Multi Kod Listesi',
                            path: '../pages/items/lists/multicodeList.js'
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
                            id: 'stk_02_004',
                            text: e.t('menu.stk_02_004'),//'Sarf Giriş Çıkış Fişi',
                            path: '../pages/items/documents/labelPrinting.js'
                        },
                        {
                            id: 'stk_02_001',
                            text: e.t('menu.stk_02_001'),//'Sayım Evrakı',
                            path: '../pages/items/documents/itemCount.js'
                        },
                        {
                            id: 'stk_02_002',
                            text: e.t('menu.stk_02_002'),//'Depolar Arası Sevk',
                            path: '../pages/items/documents/depotTransfer.js'
                        },
                        {
                            id: 'stk_02_003',
                            text: e.t('menu.stk_02_003'),//'Fire Giriş Çıkış Fişi',
                            path: '../pages/items/documents/outageDoc.js'
                        },
                        {
                            id: 'stk_02_005',
                            text: e.t('menu.stk_02_005'),//'İade Deposuna Sevk',
                            path: '../pages/items/documents/rebateDoc.js'
                        },
                    ]
                },
                {
                    id: 'stk_04',
                    text: e.t('menu.stk_04'),//'Promosyon',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_04_001',
                            text : e.t('menu.stk_04_001'),//'Toplu Stok Düzenleme',
                            path: '../pages/items/operations/collectiveItemEdit.js'
                        },
                        {
                            id: 'stk_04_002',
                            text : e.t('menu.stk_04_002'),//'İade Operasyonları',
                            path: '../pages/items/operations/rebateOperation.js'
                        },
                        {
                            id: 'stk_04_003',
                            text : e.t('menu.stk_04_003'),//'Sayım Kesinleştirme',
                            path: '../pages/items/operations/countFinalization.js'
                        },
                    ]
                },
                {
                    id: 'stk_05',
                    text : e.t('menu.stk_05'),//'Raporlar',
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
                            path: '../pages/customers/cards/customerAddressCard.js'
                        },
                        // {
                        //     id: 'cri_01_003',
                        //     text: e.t('menu.cri_01_003'),//'Grup Tanımları',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // }
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
                            path: '../pages/customers/lists/customerList.js'
                        },
                        {
                            id: 'cri_02_002',
                            text: e.t('menu.cri_02_002'),//'Adres Listesi',
                            path: '../pages/customers/lists/customerAddressList.js'
                        },
                        // {
                        //     id: 'cri_02_003',
                        //     text: e.t('menu.cri_02_003'),//'Grup Listesi',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // }
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
                            path: '../pages/invoices/lists/purchaseInvList.js'
                        },
                        {
                            id: 'ftr_01_002',
                            text: e.t('menu.ftr_01_002'),//'Satış Fatura Listesi',
                            path: '../pages/invoices/lists/salesInvList.js'
                        },
                        {
                            id: 'ftr_01_003',
                            text: e.t('menu.ftr_01_003'),//'iade Fatura Listesi',
                            path: '../pages/invoices/lists/rebateInvList.js'
                        },
                        {
                            id: 'ftr_01_004',
                            text: e.t('menu.ftr_01_004'),//'Fiyat Farkı Fatura Listesi',
                            path: '../pages/invoices/lists/priceDiffInvList.js'
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
                            path: '../pages/invoices/documents/purchaseInvoice.js'
                        },
                        {
                            id: 'ftr_02_002',
                            text: e.t('menu.ftr_02_002'),//'Satış Faturası',
                            path: '../pages/invoices/documents/salesInvoice.js'
                        },
                        {
                            id: 'ftr_02_003',
                            text: e.t('menu.ftr_02_003'),//'İade Faturası',
                            path: '../pages/invoices/documents/rebateInvoice.js'
                        },
                        {
                            id: 'ftr_02_004',
                            text: e.t('menu.ftr_02_004'),//'Fiyat Farkı Faturası',
                            path: '../pages/invoices/documents/priceDifferenceInvoice.js'
                        },
                        // {
                        //     id: 'ftr_02_005',
                        //     text: e.t('menu.ftr_02_005'),//'Şubeler Arası Satış',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // }
                    ]
                },
                {
                    id: 'ftr_03',
                    text : e.t('menu.ftr_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'irs',
            text: e.t('menu.irs'),//'İrsaliye',
            expanded: false,
            items: 
            [
                {
                    id: 'irs_01',
                    text : e.t('menu.irs_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'irs_01_001',
                            text: e.t('menu.irs_01_001'),//'Alış İrsaliye Listesi',
                            path: '../pages/dispatch/lists/purchaseDisList.js'
                        },
                        {
                            id: 'irs_01_002',
                            text: e.t('menu.irs_01_002'),//'Satış İrsaliye Listesi',
                            path: '../pages/dispatch/lists/salesDisList.js'
                        },
                        {
                            id: 'irs_01_003',
                            text: e.t('menu.irs_01_003'),//'İade İrsaliye Listesi',
                            path: '../pages/dispatch/lists/rebateDisList.js'
                        },
                    ]
                },
                {
                    id: 'irs_02',
                    text : e.t('menu.irs_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'irs_02_001',
                            text: e.t('menu.irs_02_001'),//'Alış İrsaliye',
                            path: '../pages/dispatch/documents/purchaseDispatch.js'
                        },
                        {
                            id: 'irs_02_002',
                            text: e.t('menu.irs_02_002'),//'Satış İrsaliye',
                            path: '../pages/dispatch/documents/salesDispatch.js'
                        },
                        {
                            id: 'irs_02_003',
                            text: e.t('menu.irs_02_003'),//'İade İrsaliyesi',
                            path: '../pages/dispatch/documents/rebateDispatch.js'
                        },
                        // {
                        //     id: 'irs_02_004',
                        //     text: e.t('menu.irs_02_004'),//'Şubeler Arası Sevk',
                        //     path: '../pages/customers/cards/customerCard.js'
                        // }
                    ]
                },
                {
                    id: 'irs_03',
                    text : e.t('menu.irs_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'sip',
            text: e.t('menu.sip'),//'Sipariş',
            expanded: false,
            items: 
            [
                {
                    id: 'sip_01',
                    text : e.t('menu.sip_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'sip_01_001',
                            text: e.t('menu.sip_01_001'),//'Alış Sipariş Listesi',
                            path: '../pages/orders/lists/purchaseOrdList.js'
                        },
                        {
                            id: 'sip_01_002',
                            text: e.t('menu.sip_01_002'),//'Satış Sipariş Listesi',
                            path: '../pages/orders/lists/salesOrdList.js'
                        },
                    ]
                },
                {
                    id: 'sip_02',
                    text : e.t('menu.sip_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'sip_02_001',
                            text: e.t('menu.sip_02_001'),//'Alış Sİpariş',
                            path: '../pages/orders/documents/purchaseOrder.js'
                        },
                        {
                            id: 'sip_02_002',
                            text: e.t('menu.sip_02_002'),//'Satış Sipariş',
                            path: '../pages/orders/documents/salesOrder.js'
                        },
    
            
                    ]
                },
                {
                    id: 'sip_03',
                    text : e.t('menu.sip_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        
        {
            id: 'cnt',
            text: e.t('menu.cnt'),//'Anlaşmalar',
            expanded: false,
            items: 
            [
                {
                    id: 'cnt_01',
                    text : e.t('menu.cnt_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cnt_01_001',
                            text: e.t('menu.cnt_01_001'),//'Alış Anlaşma Listesi',
                            path: '../pages/contracts/lists/purchaseContList.js'
                        },
                        {
                            id: 'cnt_01_002',
                            text: e.t('menu.cnt_01_002'),//'Satış Anlaşma Listesi',
                            path: '../pages/contracts/lists/salesContList.js'
                        },
                    ]
                },
                {
                    id: 'cnt_02',
                    text : e.t('menu.cnt_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cnt_02_001',
                            text: e.t('menu.cnt_02_001'),//'Alış Anlaşma',
                            path: '../pages/contracts/cards/purchaseContract.js'
                        },
                        {
                            id: 'cnt_02_002',
                            text: e.t('menu.cnt_02_002'),//'Şatış Anlaşma',
                            path: '../pages/contracts/cards/salesContract.js'
                        },
                    ]
                },
                {
                    id: 'cnt_03',
                    text : e.t('menu.cnt_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'fns',
            text: e.t('menu.fns'),//'Finans',
            expanded: false,
            items: 
            [
                {
                    id: 'fns_01',
                    text : e.t('menu.fns_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_01_001',
                            text: e.t('menu.fns_01_001'),//'Ödeme Listesi',
                            path: '../pages/finance/lists/paymentList.js'
                        },
                        {
                            id: 'fns_01_002',
                            text: e.t('menu.fns_01_002'),//'Tahsilat Listesi',
                            path: '../pages/finance/lists/collectionList.js'
                        },
                        {
                            id: 'fns_01_003',
                            text: e.t('menu.fns_01_003'),//'Tahsilat Listesi',
                            path: '../pages/finance/lists/bankList.js'
                        },
                        {
                            id: 'fns_01_004',
                            text: e.t('menu.fns_01_004'),//'Tahsilat Listesi',
                            path: '../pages/finance/lists/safeList.js'
                        },
                    ]
                },
                {
                    id: 'fns_02',
                    text : e.t('menu.fns_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_02_001',
                            text: e.t('menu.fns_02_001'),//'Ödeme',
                            path: '../pages/finance/documents/payment.js'
                        },
                        {
                            id: 'fns_02_002',
                            text: e.t('menu.fns_02_002'),//'Tahsilat',
                            path: '../pages/finance/documents/collection.js'
                        },
                    ]
                },
                {
                    id: 'fns_03',
                    text : e.t('menu.fns_03'),//'Kasa - Banka İşlemleri',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_03_001',
                            text: e.t('menu.fns_03_001'),//'Kasa Tanıtım',
                            path: '../pages/finance/cards/safeCard.js'
                        },
                        {
                            id: 'fns_03_002',
                            text: e.t('menu.fns_03_002'),//'Tahsilat',
                            path: '../pages/finance/cards/bankCard.js'
                        },
                        {
                            id: 'fns_03_003',
                            text: e.t('menu.fns_03_003'),//'Tahsilat',
                            path: '../pages/finance/documents/virement.js'
                        },
                    ]
                },
                {
                    id: 'fns_04',
                    text : e.t('menu.fns_04'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'promo',
            text: e.t('menu.promo'),//'Promosyon',
            expanded: false,
            items: 
            [
                {
                    id: 'promo_01',
                    text : e.t('menu.promo_01'),//'Tanımlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'promo_01_001',
                            text: e.t('menu.promo_01_001'),//'Promosyon Tanımları',
                            path: '../pages/promotion/cards/promotionCard.js'
                        }
                    ]
                },
                {
                    id: 'promo_02',
                    text : e.t('menu.promo_02'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'promo_02_001',
                            text: e.t('menu.promo_02_001'),//'Promosyon Listesi',
                            path: '../pages/test.js'
                        }
                    ]
                },
                {
                    id: 'promo_03',
                    text : e.t('menu.promo_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        }
    ]
}
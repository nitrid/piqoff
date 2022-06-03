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
                            path: 'items/cards/itemCard'
                        },
                        {
                            id: 'stk_01_002',
                            text: e.t('menu.stk_01_002'),//'Barkod Tanımları',
                            path: 'items/cards/barcodeCard'
                        },
                        // {
                        //     id: 'stk_01_003',
                        //     text: e.t('menu.stk_01_003'),//'Fiyat Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        // {
                        //     id: 'stk_01_004',
                        //     text: e.t('menu.stk_01_004'),//'Birim Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        // {
                        //     id: 'stk_01_005',
                        //     text: e.t('menu.stk_01_005'),//'Multi Kod Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        {
                            id: 'stk_01_006',
                            text: e.t('menu.stk_01_006'),//'Depo Tanımları',
                            path: 'items/cards/depotCard'
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
                            path: 'items/documents/labelPrinting'
                        },
                        {
                            id: 'stk_02_001',
                            text: e.t('menu.stk_02_001'),//'Sayım Evrakı',
                            path: 'items/documents/itemCount'
                        },
                        {
                            id: 'stk_02_002',
                            text: e.t('menu.stk_02_002'),//'Depolar Arası Sevk',
                            path: 'items/documents/depotTransfer'
                        },
                        {
                            id: 'stk_02_003',
                            text: e.t('menu.stk_02_003'),//'Fire Giriş Çıkış Fişi',
                            path: 'items/documents/outageDoc'
                        },
                        {
                            id: 'stk_02_005',
                            text: e.t('menu.stk_02_005'),//'İade Deposuna Sevk',
                            path: 'items/documents/rebateDoc'
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
                            path: 'items/lists/itemList'
                        },
                        // {
                        //     id: 'stk_03_002',
                        //     text: e.t('menu.stk_03_002'),//'Fiyat Listesi',
                        //     path: 'items/lists/priceList'
                        // },
                        // {
                        //     id: 'stk_03_003',
                        //     text: e.t('menu.stk_03_003'),//'Barkod Listesi',
                        //     path: 'items/lists/barcodeList'
                        // },
                        // {
                        //     id: 'stk_03_004',
                        //     text: e.t('menu.stk_03_004'),//'Depo Listesi',
                        //     path: 'items/lists/depotList'
                        // },
                        // {
                        //     id: 'stk_03_005',
                        //     text: e.t('menu.stk_03_005'),//'Multi Kod Listesi',
                        //     path: 'items/lists/multicodeList'
                        // },
                        {
                            id: 'stk_03_006',
                            text: e.t('menu.stk_03_006'),//'Stok Listesi',
                            path: 'items/lists/itemQuantityList'
                        },
                    ]
                },
                {
                    id: 'stk_04',
                    text: e.t('menu.stk_04'),//'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_04_001',
                            text : e.t('menu.stk_04_001'),//'Toplu Stok Düzenleme',
                            path: 'items/operations/collectiveItemEdit'
                        },
                        {
                            id: 'stk_04_002',
                            text : e.t('menu.stk_04_002'),//'İade Operasyonları',
                            path: 'items/operations/rebateOperation'
                        },
                        {
                            id: 'stk_04_003',
                            text : e.t('menu.stk_04_003'),//'Sayım Kesinleştirme',
                            path: 'items/operations/countFinalization'
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
                            path: 'customers/cards/customerCard'
                        },
                        {
                            id: 'cri_01_002',
                            text: e.t('menu.cri_01_002'),//'Adres Tanımları',
                            path: 'customers/cards/customerAddressCard'
                        },
                        // {
                        //     id: 'cri_01_003',
                        //     text: e.t('menu.cri_01_003'),//'Grup Tanımları',
                        //     path: 'customers/cards/customerCard'
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
                            path: 'customers/lists/customerList'
                        },
                        {
                            id: 'cri_02_002',
                            text: e.t('menu.cri_02_002'),//'Adres Listesi',
                            path: 'customers/lists/customerAddressList'
                        },
                        // {
                        //     id: 'cri_02_003',
                        //     text: e.t('menu.cri_02_003'),//'Grup Listesi',
                        //     path: 'customers/cards/customerCard'
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
                            path: 'contracts/lists/purchaseContList'
                        },
                        {
                            id: 'cnt_01_002',
                            text: e.t('menu.cnt_01_002'),//'Satış Anlaşma Listesi',
                            path: 'contracts/lists/salesContList'
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
                            path: 'contracts/cards/purchaseContract'
                        },
                        {
                            id: 'cnt_02_002',
                            text: e.t('menu.cnt_02_002'),//'Şatış Anlaşma',
                            path: 'contracts/cards/salesContract'
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
            id: 'tkf',
            text: e.t('menu.tkf'),//'tkfariş',
            expanded: false,
            items: 
            [
                {
                    id: 'tkf_01',
                    text : e.t('menu.tkf_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'tkf_01_001',
                            text: e.t('menu.tkf_01_001'),//'Alış tkfariş Listesi',
                            path: 'offers/lists/purchaseOrdList'
                        },
                        {
                            id: 'tkf_01_002',
                            text: e.t('menu.tkf_01_002'),//'Satış tkfariş Listesi',
                            path: 'offers/lists/salesOrdList'
                        },
                    ]
                },
                {
                    id: 'tkf_02',
                    text : e.t('menu.tkf_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'tkf_02_001',
                            text: e.t('menu.tkf_02_001'),//'Alış Sİpariş',
                            path: 'offers/documents/purchaseOffer'
                        },
                        {
                            id: 'tkf_02_002',
                            text: e.t('menu.tkf_02_002'),//'Satış tkfariş',
                            path: 'offers/documents/salesOffer'
                        },
    
            
                    ]
                },
                {
                    id: 'tkf_03',
                    text : e.t('menu.tkf_03'),//'Raporlar',
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
                            path: 'orders/lists/purchaseOrdList'
                        },
                        {
                            id: 'sip_01_002',
                            text: e.t('menu.sip_01_002'),//'Satış Sipariş Listesi',
                            path: 'orders/lists/salesOrdList'
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
                            path: 'orders/documents/purchaseOrder'
                        },
                        {
                            id: 'sip_02_002',
                            text: e.t('menu.sip_02_002'),//'Satış Sipariş',
                            path: 'orders/documents/salesOrder'
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
                            path: 'dispatch/lists/purchaseDisList'
                        },
                        {
                            id: 'irs_01_002',
                            text: e.t('menu.irs_01_002'),//'Satış İrsaliye Listesi',
                            path: 'dispatch/lists/salesDisList'
                        },
                        {
                            id: 'irs_01_003',
                            text: e.t('menu.irs_01_003'),//'İade İrsaliye Listesi',
                            path: 'dispatch/lists/rebateDisList'
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
                            path: 'dispatch/documents/purchaseDispatch'
                        },
                        {
                            id: 'irs_02_002',
                            text: e.t('menu.irs_02_002'),//'Satış İrsaliye',
                            path: 'dispatch/documents/salesDispatch'
                        },
                        {
                            id: 'irs_02_003',
                            text: e.t('menu.irs_02_003'),//'İade İrsaliyesi',
                            path: 'dispatch/documents/rebateDispatch'
                        },
                        // {
                        //     id: 'irs_02_004',
                        //     text: e.t('menu.irs_02_004'),//'Şubeler Arası Sevk',
                        //     path: 'customers/cards/customerCard'
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
                            path: 'invoices/lists/purchaseInvList'
                        },
                        {
                            id: 'ftr_01_002',
                            text: e.t('menu.ftr_01_002'),//'Satış Fatura Listesi',
                            path: 'invoices/lists/salesInvList'
                        },
                        {
                            id: 'ftr_01_003',
                            text: e.t('menu.ftr_01_003'),//'iade Fatura Listesi',
                            path: 'invoices/lists/rebateInvList'
                        },
                        {
                            id: 'ftr_01_004',
                            text: e.t('menu.ftr_01_004'),//'Fiyat Farkı Fatura Listesi',
                            path: 'invoices/lists/priceDiffInvList'
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
                            path: 'invoices/documents/purchaseInvoice'
                        },
                        {
                            id: 'ftr_02_002',
                            text: e.t('menu.ftr_02_002'),//'Satış Faturası',
                            path: 'invoices/documents/salesInvoice'
                        },
                        {
                            id: 'ftr_02_003',
                            text: e.t('menu.ftr_02_003'),//'İade Faturası',
                            path: 'invoices/documents/rebateInvoice'
                        },
                        {
                            id: 'ftr_02_004',
                            text: e.t('menu.ftr_02_004'),//'Fiyat Farkı Faturası',
                            path: 'invoices/documents/priceDifferenceInvoice'
                        },
                        // {
                        //     id: 'ftr_02_005',
                        //     text: e.t('menu.ftr_02_005'),//'Şubeler Arası Satış',
                        //     path: 'customers/cards/customerCard'
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
                            path: 'finance/lists/paymentList'
                        },
                        {
                            id: 'fns_01_002',
                            text: e.t('menu.fns_01_002'),//'Tahsilat Listesi',
                            path: 'finance/lists/collectionList'
                        },
                        {
                            id: 'fns_01_003',
                            text: e.t('menu.fns_01_003'),//'Tahsilat Listesi',
                            path: 'finance/lists/bankList'
                        },
                        {
                            id: 'fns_01_004',
                            text: e.t('menu.fns_01_004'),//'Tahsilat Listesi',
                            path: 'finance/lists/safeList'
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
                            path: 'finance/documents/payment'
                        },
                        {
                            id: 'fns_02_002',
                            text: e.t('menu.fns_02_002'),//'Tahsilat',
                            path: 'finance/documents/collection'
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
                            path: 'finance/cards/safeCard'
                        },
                        {
                            id: 'fns_03_002',
                            text: e.t('menu.fns_03_002'),//'Tahsilat',
                            path: 'finance/cards/bankCard'
                        },
                        {
                            id: 'fns_03_003',
                            text: e.t('menu.fns_03_003'),//'Tahsilat',
                            path: 'finance/documents/virement'
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
            id: 'pos',
            text: e.t('menu.pos'),//'Toplu İşlemler',
            expanded: false,
            items: 
            [
                {
                    id: 'pos_01',
                    text : e.t('menu.pos_01'),//'Tanımlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'pos_01_001',
                            text: e.t('menu.pos_01_001'),//'Promosyon Tanımları',
                            path: 'pos/card/posDeviceCard'
                        }
                    ]
                },
                {
                    id: 'pos_02',
                    text : e.t('menu.pos_02'),//'Raporlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'pos_02_001',
                            text: e.t('menu.pos_02_001'),//'Promosyon Tanımları',
                            path: 'pos/report/salesTicketReport'
                        },
                        {
                            id: 'pos_02_002',
                            text: e.t('menu.pos_02_002'),//'Promosyon Tanımları',
                            path: 'pos/report/customerPointReport'
                        }
                    ]
                },
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
                            path: 'promotion/cards/promotionCard'
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
                            path: 'test'
                        }
                    ]
                },
                {
                    id: 'promo_03',
                    text : e.t('menu.promo_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        {
            id: 'proces',
            text: e.t('menu.proces'),//'Toplu İşlemler',
            expanded: false,
            items: 
            [
                {
                    id: 'proces_01',
                    text : e.t('menu.proces_01'),//'Toplu Stok işlemleri',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'proces_01_001',
                            text: e.t('menu.proces_01_001'),//'Toplu Ürün Grubu Güncelle',
                            path: 'proces/itemProces/itemGroupProces'
                        }
                    ]
                },
            ]
        },
        {
            id: 'setting',
            text: e.t('menu.set'),//'Ayarlar',
            expanded: false,
            items: 
            [
                {
                    id: 'set_01',
                    text : e.t('menu.set_01'),//'Maliyet ve Ek Vergi',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'set_01_001',
                            text: e.t('menu.set_01_001'),//'Tax Sugar Oranları',
                            path: 'setting/costandtax/taxSugar'
                        }
                    ]
                },
            ]
        }
    ]
}
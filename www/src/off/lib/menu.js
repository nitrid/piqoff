export const menu = (e) => 
{
    return [
        //Stok
        {
            id: 'stk',
            text: e.t('menuOff.stk'),
            expanded: false,
            items: 
            [
                {
                    id: 'stk_01',
                    text : e.t('menuOff.stk_01'),//'Tanımlar'
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_01_001',
                            text: e.t('menuOff.stk_01_001'),//'Stok Tanımları',
                            path: 'items/cards/itemCard'
                        },
                        {
                            id: 'stk_01_002',
                            text: e.t('menuOff.stk_01_002'),//'Barkod Tanımları',
                            path: 'items/cards/barcodeCard'
                        },
                        // {
                        //     id: 'stk_01_003',
                        //     text: e.t('menuOff.stk_01_003'),//'Fiyat Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        // {
                        //     id: 'stk_01_004',
                        //     text: e.t('menuOff.stk_01_004'),//'Birim Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        // {
                        //     id: 'stk_01_005',
                        //     text: e.t('menuOff.stk_01_005'),//'Multi Kod Tanımları',
                        //     path: 'customers/cards/customerCard'
                        // },
                        {
                            id: 'stk_01_015',
                            text: e.t('menuOff.stk_01_015'), //'Fiyat Listesi Tanımları',
                            path: 'items/cards/itemPricingListCard'
                        },
                        {
                            id: 'stk_01_006',
                            text: e.t('menuOff.stk_01_006'),//'Depo Tanımları',
                            path: 'items/cards/depotCard'
                        },
                        {
                            id: 'stk_01_007',
                            text: e.t('menuOff.stk_01_007'),//'Hizmet Tanımları',
                            path: 'items/cards/serviceItemsCard'
                        },
                        {
                            id: 'stk_01_008',
                            text: e.t('menuOff.stk_01_008'),//'Ürün Grubu Tanımları',
                            path: 'items/cards/itemGroupCard.js',
                        },
                        {
                            id: 'stk_01_009',
                            text: e.t('menuOff.stk_01_009'),//'Ürün Alt Grup Tanımları',
                            path: 'items/cards/itemSubGroupCard.js',
                        },
                        {
                            id: 'stk_01_010',
                            text: e.t('menuOff.stk_01_010'),//'Birim Tanımları',
                            path: 'items/cards/unitCard.js',
                        },
                        {
                            id: 'stk_01_011',
                            text: e.t('menuOff.stk_01_011'),//'Vergi Tanımları',
                            path: 'items/cards/vatCard.js',
                        },
                        {
                            id: 'stk_01_012',
                            text: e.t('menuOff.stk_01_012'),//'Bağlı Ürün Tanımları',
                            path: 'items/cards/itemRelated.js',
                        },
                        {
                            id: 'stk_01_013',
                            text: e.t('menuOff.stk_01_013'),//'Ürün Resim Tanımları',
                            path: 'items/cards/itemImage.js',
                        },
                        {
                            id: 'stk_01_014',
                            text: e.t('menuOff.stk_01_014'),//'Cins Tanımları',
                            path: 'items/cards/genreCard'
                        },
                        {
                            id: 'stk_01_016',
                            text: e.t('menuOff.stk_01_016'),//'Ürün Recete Tanımları',
                            path: 'items/cards/productRecipeCard'
                        }
                    ]
                },
                {
                    id: 'stk_02',
                    text : e.t('menuOff.stk_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_02_004',
                            text: e.t('menuOff.stk_02_004'),//'Etiket Basım',
                            path: 'items/documents/labelPrinting'
                        },
                        {
                            id: 'stk_02_006',
                            text: e.t('menuOff.stk_02_006'),//'Etiket Basım',
                            path: 'items/documents/privatePrinting'
                        },
                        {
                            id: 'stk_02_001',
                            text: e.t('menuOff.stk_02_001'),//'Sayım Evrakı',
                            path: 'items/documents/itemCount'
                        },
                        {
                            id: 'stk_02_002',
                            text: e.t('menuOff.stk_02_002'),//'Depolar Arası Sevk',
                            path: 'items/documents/depotTransfer'
                        },
                        {
                            id: 'stk_02_003',
                            text: e.t('menuOff.stk_02_003'),//'Fire Giriş Çıkış Fişi',
                            path: 'items/documents/outageDoc'
                        },
                        {
                            id: 'stk_02_005',
                            text: e.t('menuOff.stk_02_005'),//'İade Deposuna Sevk',
                            path: 'items/documents/rebateDoc'
                        },
                        {
                            id: 'stk_02_007',
                            text: e.t('menuOff.stk_02_007'),//'SKT Girişi',
                            path: 'items/documents/expdateEntry'
                        },
                        {
                            id: 'stk_02_008',
                            text: e.t('menuOff.stk_02_008'), //'Stok Giriş',
                            path: 'items/documents/itemEntryDoc'
                        },
                        {
                            id: 'stk_02_009',
                            text: e.t('menuOff.stk_02_009'), //'Stok Çıkış',
                            path: 'items/documents/itemOutDoc'
                        },
                    ]
                },
                {
                    id: 'stk_03',
                    text : e.t('menuOff.stk_03'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_03_001',
                            text: e.t('menuOff.stk_03_001'),//'Stok Listesi',
                            path: 'items/lists/itemList'
                        },
                        // {
                        //     id: 'stk_03_002',
                        //     text: e.t('menuOff.stk_03_002'),//'Fiyat Listesi',
                        //     path: 'items/lists/priceList'
                        // },
                        // {
                        //     id: 'stk_03_003',
                        //     text: e.t('menuOff.stk_03_003'),//'Barkod Listesi',
                        //     path: 'items/lists/barcodeList'
                        // },
                        // {
                        //     id: 'stk_03_004',
                        //     text: e.t('menuOff.stk_03_004'),//'Depo Listesi',
                        //     path: 'items/lists/depotList'
                        // },
                        // {
                        //     id: 'stk_03_005',
                        //     text: e.t('menuOff.stk_03_005'),//'Multi Kod Listesi',
                        //     path: 'items/lists/multicodeList'
                        // },
                        {
                            id: 'stk_03_006',
                            text: e.t('menuOff.stk_03_006'),//'Stok Listesi',
                            path: 'items/lists/itemQuantityList'
                        },
                    ]
                },
                {
                    id: 'stk_04',
                    text: e.t('menuOff.stk_04'),//'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_04_001',
                            text : e.t('menuOff.stk_04_001'),//'Toplu Stok Düzenleme',
                            path: 'items/operations/collectiveItemEdit'
                        },
                        {
                            id: 'stk_04_006',
                            text: e.t('menuOff.stk_04_006'), //'Excel Ürün Girişi',
                            path: 'items/operations/excelItemImport'
                        },
                        {
                            id: 'stk_04_002',
                            text : e.t('menuOff.stk_04_002'),//'İade Operasyonları',
                            path: 'items/operations/rebateOperation'
                        },
                        {
                            id: 'stk_04_003',
                            text : e.t('menuOff.stk_04_003'),//'Sayım Kesinleştirme',
                            path: 'items/operations/countFinalization'
                        },
                        {
                            id: 'stk_04_004',
                            text : e.t('menuOff.stk_04_004'),//'SKT Operasyonu',
                            path: 'items/operations/expdateOperations'
                        },
                        {
                            id: 'stk_04_005',
                            text: e.t('menuOff.stk_04_005'), //'Stok Giriş Çıkış Operasyonu',
                            path: 'items/operations/itemEntryOutDoc'
                        },
                        {
                            id: 'stk_04_007',
                            text: e.t('menuOff.stk_04_007'), //'Ceopos Ürün gönderimi',
                            path: 'items/operations/ceoposWeightItemSend'
                        },
                        {
                            id: 'stk_04_008',
                            text: e.t('menuOff.stk_04_008'), //'Price Toplu Ürün gönderimi',
                            path: 'items/operations/pricerAllItemSend'
                        }
                    ]
                },
                {
                    id: 'stk_05',
                    text : e.t('menuOff.stk_05'),//'Raporlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_05_001',
                            text : e.t('menuOff.stk_05_001'),//'',
                            path: 'items/report/itemInventoryReport'
                        },
                        {
                            id: 'stk_05_002',
                            text : e.t('menuOff.stk_05_002'),//'',
                            path: 'items/report/itemPurcPriceReport'
                        },
                        {
                            id: 'stk_05_003',
                            text : e.t('menuOff.stk_05_003'),//'',
                            path: 'items/report/countInventoryReport'
                        },
                        {
                            id: 'stk_05_004',
                            text : e.t('menuOff.stk_05_004'),//'',
                            path: 'items/report/itemOutageReport'
                        },
                        {
                            id: 'stk_05_005',
                            text : e.t('menuOff.stk_05_005'),//'',
                            path: 'items/report/itemMoveReport'
                        },
                    ]
                }
            ]
        },
        //Cari
        {
            id: 'cri',
            text: e.t('menuOff.cri'),
            expanded: false,
            items: 
            [
                {
                    id: 'cri_01',
                    text : e.t('menuOff.cri_01'),//'Tanımlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_01_001',
                            text: e.t('menuOff.cri_01_001'),//'Cari Tanımları',
                            path: 'customers/cards/customerCard'
                        },
                        {
                            id: 'cri_01_002',
                            text: e.t('menuOff.cri_01_002'),//'Adres Tanımları',
                            path: 'customers/cards/customerAddressCard'
                        },
                        {
                            id: 'cri_01_003',
                            text: e.t('menuOff.cri_01_003'),//'Grup Tanımları',
                            path: 'customers/cards/customerGrpCard'
                        },
                        {
                            id: 'cri_01_004',
                            text: e.t('menuOff.cri_01_004'),//'Bölge Tanımları',
                            path: 'customers/cards/areaCard'
                        },
                        {
                            id: 'cri_01_005',
                            text: e.t('menuOff.cri_01_005'),//'Sektör Tanımları',
                            path: 'customers/cards/sectorCard'
                        },
                        {
                            id: 'cri_01_006',
                            text: e.t('menuOff.cri_01_006'),//'Alt Grup Tanımları',
                            path: 'customers/cards/customerSubGroupCard'
                        }
                    ]
                },
                {
                    id: 'cri_02',
                    text : e.t('menuOff.cri_02'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_02_001',
                            text: e.t('menuOff.cri_02_001'),//'Cari Listesi',
                            path: 'customers/lists/customerList'
                        },
                        {
                            id: 'cri_02_002',
                            text: e.t('menuOff.cri_02_002'),//'Adres Listesi',
                            path: 'customers/lists/customerAddressList'
                        },
                        // {
                        //     id: 'cri_02_003',
                        //     text: e.t('menuOff.cri_02_003'),//'Grup Listesi',
                        //     path: 'customers/cards/customerCard'
                        // }
                    ]
                },
                {
                    id: 'cri_03',
                    text : e.t('menuOff.cri_03'),//'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_03_001',
                            text: e.t('menuOff.cri_03_001'),//'Toplu Cari Ekleme',
                            path: 'customers/operations/collectiveCustomer'
                        },
                    ]
                },
                {
                    id: 'cri_04',
                    text : e.t('menuOff.cri_04'),//'Raporlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cri_04_001',
                            text: e.t('menuOff.cri_04_001'),//'Cari Ekstre Raporu',
                            path: 'customers/report/customerExtreReport'
                        },
                        {
                            id: 'cri_04_002',
                            text: e.t('menuOff.cri_04_002'),//'Cari Bakiye Bakiye Raporu',
                            path: 'customers/report/customerBalanceReport'
                        },
                        {
                            id: 'cri_04_004',
                            text: e.t('menuOff.cri_04_004'),// Cari Bakiyeli Extre Raporu
                            path: 'construction.js',
                        },
                        {
                            id: 'cri_04_003',
                            text: e.t('menuOff.cri_04_003'),//Müşteri Puan Raporu
                            path: 'pos/report/customerPointReport'
                        },
                        {
                            id: 'cri_04_005',
                            text: e.t('menuOff.cri_04_005'),//'Satış Faturası Yaşlandırma Raporu',
                            path: 'customers/report/saleInvoiceAgingReport'
                        },
                    ]
                }
            ]
        },
        //Anlaşmalar
        {
            id: 'cnt',
            text: e.t('menuOff.cnt'),
            expanded: false,
            items: 
            [
                {
                    id: 'cnt_02',
                    text : e.t('menuOff.cnt_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cnt_02_001',
                            text: e.t('menuOff.cnt_02_001'),//'Alış Anlaşma',
                            path: 'contracts/cards/purchaseContract'
                        },
                        {
                            id: 'cnt_02_002',
                            text: e.t('menuOff.cnt_02_002'),//'Şatış Anlaşma',
                            path: 'contracts/cards/salesContract'
                        }
                    ]
                },
                {
                    id: 'cnt_01',
                    text : e.t('menuOff.cnt_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cnt_01_001',
                            text: e.t('menuOff.cnt_01_001'),//'Alış Anlaşma Listesi',
                            path: 'contracts/lists/purchaseContList'
                        },
                        {
                            id: 'cnt_01_002',
                            text: e.t('menuOff.cnt_01_002'),//'Satış Anlaşma Listesi',
                            path: 'contracts/lists/salesContList'
                        },
                    ]
                },
                {
                    id: 'cnt_04',
                    text : e.t('menuOff.cnt_04'),//'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'cnt_04_001',
                            text: e.t('menuOff.cnt_04_001'),//Çoklu Satış Anlaşması',
                            path: 'contracts/operations/multipleSaleContract'
                        }
                    ]
                },
                {
                    id: 'cnt_03',
                    text : e.t('menuOff.cnt_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        //Satın Alma İşlemleri
        {
            id: 'purchase',
            text: e.t('menuOff.purchase'),
            expanded: false,
            items: 
            [
                {
                    id: 'purcoffer',
                    text : e.t('menuOff.purcoffer'),//'Teklif',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'purcoffer_01',
                            text : e.t('menuOff.purcoffer_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'tkf_02_001',
                                    text: e.t('menuOff.tkf_02_001'),//'Alış Teklif',
                                    path: 'offers/documents/purchaseOffer'
                                },
                                {
                                    id: 'tkf_02_003',
                                    text: e.t('menuOff.tkf_02_003'),//'Fiyat farkı talebi',
                                    path: 'offers/documents/priceDiffDemand'
                                },
                    
                            ]
                        },
                        {
                            id: 'purcoffer_02',
                            text : e.t('menuOff.purcoffer_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'tkf_01_001',
                                    text: e.t('menuOff.tkf_01_001'),//'Alış tkfariş Listesi',
                                    path: 'offers/lists/purchaseOrdList'
                                },
                            ]
                        },
                        {
                            id: 'purcoffer_03',
                            text : e.t('menuOff.purcoffer_03'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'purcorder',
                    text : e.t('menuOff.purcorder'),//'Teklif',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'purcorder_01',
                            text : e.t('menuOff.purcorder_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_02_001',
                                    text: e.t('menuOff.sip_02_001'),//'Alış Sİpariş',
                                    path: 'orders/documents/purchaseOrder'
                                },
                            ]
                        },
                        {
                            id: 'purcorder_02',
                            text : e.t('menuOff.purcorder_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_01_001',
                                    text: e.t('menuOff.sip_01_001'),//'Alış Sipariş Listesi',
                                    path: 'orders/lists/purchaseOrdList'
                                },
                            ]
                        },
                        {
                            id: 'purcorder_03',
                            text : e.t('menuOff.purcorder_03'),//'Operasyonlar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_04_001',
                                    text: e.t('menuOff.sip_04_001'),//'Toplu Sipariş Ayrıştırma',
                                    path: 'orders/operations/orderParsing'
                                },
                            ]
                        },
                        {
                            id: 'purcorder_04',
                            text : e.t('menuOff.purcorder_04'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'purcDispatch',
                    text : e.t('menuOff.purcDispatch'),//'İrsaliyeler',
                    expanded: false,
                    items: 
                    [   {
                            id: 'purcDispatch_01',
                            text : e.t('menuOff.purcDispatch_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'irs_02_001',
                                    text: e.t('menuOff.irs_02_001'),//'Alış İrsaliye',
                                    path: 'dispatch/documents/purchaseDispatch'
                                },
                                {
                                    id: 'irs_02_003',
                                    text: e.t('menuOff.irs_02_003'),//'İade İrsaliyesi',
                                    path: 'dispatch/documents/rebateDispatch'
                                },
                                {
                                    id: 'irs_02_006',
                                    text: e.t('menuOff.irs_02_006'),//'Şubeler Arası Alış',
                                    path: 'dispatch/documents/branchPurcDispatch'
                                },
                            ]
                        },
                        {
                            id: 'purcDispatch_02',
                            text : e.t('menuOff.purcDispatch_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'irs_01_001',
                                    text: e.t('menuOff.irs_01_001'),//'Alış İrsaliye Listesi',
                                    path: 'dispatch/lists/purchaseDisList'
                                },
                                {
                                    id: 'irs_01_003',
                                    text: e.t('menuOff.irs_01_003'),//'İade İrsaliye Listesi',
                                    path: 'dispatch/lists/rebateDisList'
                                },
                            ]
                        },
                        {
                            id: 'purcDispatch_03',
                            text : e.t('menuOff.purcDispatch_03'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'invoices',
                    text : e.t('menuOff.purcinvoices'),//'Faturalar',
                    expanded: false,
                    items: 
                    [   
                        {
                            id: 'purcinvoices_01',
                            text : e.t('menuOff.purcinvoices_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_02_001',
                                    text: e.t('menuOff.ftr_02_001'),//'Alış Faturası',
                                    path: 'invoices/documents/purchaseInvoice'
                                },
                                {
                                    id: 'ftr_02_003',
                                    text: e.t('menuOff.ftr_02_003'),//'İade Faturası',
                                    path: 'invoices/documents/rebateInvoice'
                                },
                                {
                                    id: 'ftr_02_004',
                                    text: e.t('menuOff.ftr_02_004'),//'Fiyat Farkı Faturası',
                                    path: 'invoices/documents/priceDifferenceInvoice'
                                },
                                {
                                    id: 'ftr_02_008',
                                    text: e.t('menuOff.ftr_02_008'),//'Şubeler Arası Alış',
                                    path: 'invoices/documents/branchPurcInvoice'
                                },
                            ]
                        },
                        {
                            id: 'purcinvoices_02',
                            text : e.t('menuOff.purcinvoices_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_01_001',
                                    text: e.t('menuOff.ftr_01_001'),//'Alış Fatura Listesi',
                                    path: 'invoices/lists/purchaseInvList'
                                },
                                {
                                    id: 'ftr_01_003',
                                    text: e.t('menuOff.ftr_01_003'),//'iade Fatura Listesi',
                                    path: 'invoices/lists/rebateInvList'
                                },
                                {
                                    id: 'ftr_01_004',
                                    text: e.t('menuOff.ftr_01_004'),//'Fiyat Farkı Fatura Listesi',
                                    path: 'invoices/lists/priceDiffInvList'
                                },
                            ]
                        },
                        {
                            id: 'purcinvoices_03',
                            text : e.t('menuOff.purcinvoices_03'),//'Proforma',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_04_003',
                                    text: e.t('menuOff.ftr_04_003'),//'proforma Alış Faturası',
                                    path: 'invoices/proforma/purchaseProInvoice'
                                },
                                {
                                    id: 'ftr_04_004',
                                    text: e.t('menuOff.ftr_04_004'),//'proforma İade Faturası',
                                    path: 'invoices/proforma/rebateProInvoice'
                                },
                                {
                                    id: 'ftr_04_001',
                                    text: e.t('menuOff.ftr_04_001'),//'proforma fiyat farkı',
                                    path: 'invoices/proforma/priceDifferenceProInvoice'
                                },
                            ]
                        },
                        {
                            id: 'purcinvoices_04',
                            text : e.t('menuOff.purcinvoices_04'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'purchaseReport',
                    text : e.t('menuOff.purchaseReport'),//'Raporlar',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'slsRpt_02_001',
                            text: e.t('menuOff.slsRpt_02_001'),//'Alış Fatura',
                            path: 'report/purchase/purchaseInvoiceReport'
                        },
                        {
                            id: 'slsRpt_02_003',
                            text: e.t('menuOff.slsRpt_02_003'),//'DEB Raporu',
                            path: 'report/purchase/taxSucreReport'
                        },
                        {
                            id: 'slsRpt_02_004',
                            text: e.t('menuOff.slsRpt_02_004'),//'Ürün Detaylı Alış Raporu',
                            path: 'report/purchase/itemInvoicePurchaseReport'
                        },
                        {
                            id: 'slsRpt_02_002',
                            text: e.t('menuOff.slsRpt_02_002'),//'DEB Raporu',
                            path: 'report/purchase/debReport'
                        },
                        {
                            id: 'slsRpt_02_005',
                            text: e.t('menuOff.slsRpt_02_005'),//'DEB Detay Raporu',
                            path: 'report/purchase/debDetailReport'
                        },
                        {
                            id: 'slsRpt_02_006',
                            text: e.t('menuOff.slsRpt_02_006'),//'Açik Alis Fatura Raporu',
                            path: 'report/purchase/openInvoicePurchaseReport'
                        },
                    ]
                }
            ]
        },
        //Satış İşlemleri
        {
            id: 'sales',
            text: e.t('menuOff.sales'),
            expanded: false,
            items: 
            [
                {
                    id: 'salesoffer',
                    text : e.t('menuOff.salesoffer'),//'Teklif',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'salesoffer_01',
                            text : e.t('menuOff.salesoffer_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'tkf_02_002',
                                    text: e.t('menuOff.tkf_02_002'),//'Satış teklif',
                                    path: 'offers/documents/salesOffer'
                                },
                    
                            ]
                        },
                        {
                            id: 'salesoffer_02',
                            text : e.t('menuOff.salesoffer_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'tkf_01_002',
                                    text: e.t('menuOff.tkf_01_002'),//'Satış teklif Listesi',
                                    path: 'offers/lists/salesOrdList'
                                },
                            ]
                        },
                        {
                            id: 'salesoffer_03',
                            text : e.t('menuOff.salesoffer_03'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'salesorder',
                    text : e.t('menuOff.salesorder'),//'Sipariş',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'salesorder_01',
                            text : e.t('menuOff.salesorder_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_02_002',
                                    text: e.t('menuOff.sip_02_002'),//'Satış Sipariş',
                                    path: 'orders/documents/salesOrder'
                                },
                                {
                                    id: 'sip_02_003',
                                    text: e.t('menuOff.sip_02_003'),//'Pos Satış Sipariş',
                                    path: 'orders/documents/posSalesOrder'
                                },
                            ]
                        },
                        {
                            id: 'salesorder_02',
                            text : e.t('menuOff.salesorder_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_01_002',
                                    text: e.t('menuOff.sip_01_002'),//'Satış Sipariş Listesi',
                                    path: 'orders/lists/salesOrdList'
                                },
                            ]
                        },
                        {
                            id: 'salesorder_04',
                            text : e.t('menuOff.salesorder_04'),//'Operasyonlar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'sip_04_002',
                                    text: e.t('menuOff.sip_04_002'),//'Satış Siparişi Dağıtım Operasyonu',
                                    path: 'orders/operations/salesOrderDistributionOperation'
                                },
                            ]
                        },
                        {
                            id: 'salesorder_03',
                            text : e.t('menuOff.salesorder_03'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'salesDispatch',
                    text : e.t('menuOff.salesDispatch'),//'İrsaliyeler',
                    expanded: false,
                    items: 
                    [   {
                            id: 'salesDispatch_01',
                            text : e.t('menuOff.salesDispatch_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'irs_02_002',
                                    text: e.t('menuOff.irs_02_002'),//'Satış İrsaliye',
                                    path: 'dispatch/documents/salesDispatch'
                                },
                                {
                                    id: 'irs_02_004',
                                    text: e.t('menuOff.irs_02_004'),//'Şubeler Arası Satış',
                                    path: 'dispatch/documents/branchSaleDispatch'
                                },
                                {
                                    id: 'irs_02_005',
                                    text: e.t('menuOff.irs_02_005'),//'İade Alış İrsaliye',
                                    path: 'dispatch/documents/rebatePurcDispatch'
                                }
                            ]
                        },
                        {
                            id: 'salesDispatch_02',
                            text : e.t('menuOff.salesDispatch_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'irs_01_002',
                                    text: e.t('menuOff.irs_01_002'),//'Satış İrsaliye Listesi',
                                    path: 'dispatch/lists/salesDisList'
                                },
                                {
                                    id: 'irs_01_004',
                                    text: e.t('menuOff.irs_01_004'),//'Şubeler Arası Sevk',
                                    path: 'dispatch/lists/bransSaleDisLİst'
                                },
                                // {
                                //     id: 'irs_01_005',
                                //     text: e.t('menuOff.irs_01_005'),//'İade Alış İrsaliye',
                                //     path: 'dispatch/lists/rebatePurcDispatch'
                                // }
                            ]
                        },
                        {
                            id: 'salesDispatch_03',
                            text : e.t('menuOff.salesDispatch_03'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'salesinvoices',
                    text : e.t('menuOff.salesinvoices'),//'Faturalar',
                    expanded: false,
                    items: 
                    [   {
                            id: 'salesinvoices_01',
                            text : e.t('menuOff.salesinvoices_01'),//'Evraklar',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_02_002',
                                    text: e.t('menuOff.ftr_02_002'),//'Satış Faturası',
                                    path: 'invoices/documents/salesInvoice'
                                },
                                {
                                    id: 'ftr_02_005',
                                    text: e.t('menuOff.ftr_02_005'),//'Şubeler Arası Satış',
                                    path: 'invoices/documents/branchSaleInvoice'
                                },
                                {
                                    id: 'ftr_02_006',
                                    text: e.t('menuOff.ftr_02_006'),//'Fiyat Farkı Alış Faturası',
                                    path: 'invoices/documents/priceDifferencePurcInvoice'
                                },
                                {
                                    id: 'ftr_02_007',
                                    text: e.t('menuOff.ftr_02_007'),//'İade Alış Faturası',
                                    path: 'invoices/documents/rebatePurcInvoice'
                                },
                                {
                                    id: 'ftr_02_009',
                                    text: e.t('menuOff.ftr_02_009'),//'Fire Alış Faturası',
                                    path: 'invoices/documents/outagePurcInvoice'
                                },
                            ]
                        },
                        {
                            id: 'salesinvoices_02',
                            text : e.t('menuOff.salesinvoices_02'),//'Listeler',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_01_002',
                                    text: e.t('menuOff.ftr_01_002'),//'Satış Fatura Listesi',
                                    path: 'invoices/lists/salesInvList'
                                },
                                {
                                    id: 'ftr_01_005',
                                    text: e.t('menuOff.ftr_01_005'),//'Şube satış  Fatura Listesi',
                                    path: 'invoices/lists/brancSaleInvList'
                                },
                                {
                                    id: 'ftr_01_006',
                                    text: e.t('menuOff.ftr_01_006'),//'Gelen İade  Fatura Listesi',
                                    path: 'invoices/lists/rebatePurcInvList'
                                },
                                {
                                    id: 'ftr_01_007',
                                    text: e.t('menuOff.ftr_01_007'),//'Fire  Fatura Listesi',
                                    path: 'invoices/lists/outageInvList'
                                },
                            ]
                        },
                        {
                            id: 'salesinvoices_03',
                            text : e.t('menuOff.salesinvoices_03'),//'Proforma',
                            expanded: false,
                            items: 
                            [
                                {
                                    id: 'ftr_04_002',
                                    text: e.t('menuOff.ftr_04_002'),//'proforma Satış Faturası',
                                    path: 'invoices/proforma/salesProInvoice'
                                },
                                {
                                    id: 'ftr_04_005',
                                    text: e.t('menuOff.ftr_04_005'),//'proforma Şube Satış Faturası',
                                    path: 'invoices/proforma/branchSaleProInvoice'
                                },
                            ]
                        },
                        {
                            id: 'salesinvoices_04',
                            text : e.t('menuOff.salesinvoices_04'),//'Raporlar',
                            expanded: false,
                        }
                    ]
                },
                {
                    id: 'salesReport',
                    text : e.t('menuOff.salesReport'),//'Raporlar',
                    expanded: false,
                    items: 
                    [ 
                        {
                            id: 'slsRpt_01_001',
                            text: e.t('menuOff.slsRpt_01_001'),//'Evrak Kıyas Raporu',
                            path: 'report/sales/docComparisonReport'
                        },
                        {
                            id: 'slsRpt_01_002',
                            text: e.t('menuOff.slsRpt_01_002'),//'Ürün Grubu Satış',
                            path: 'report/sales/itemGrpSalesReport'
                        },
                        {
                            id: 'slsRpt_01_003',
                            text: e.t('menuOff.slsRpt_01_003'),//'Ürün Grubu Satış',
                            path: 'report/sales/salesInvoiceReport'
                        },
                        {
                            id: 'slsRpt_01_004',
                            text: e.t('menuOff.slsRpt_01_004'),//'Ürün Grubu Satış',
                            path: 'report/sales/docSalesReport'
                        },
                        {
                            id: 'slsRpt_01_005',
                            text: e.t('menuOff.slsRpt_01_005'),//'Ürün Satış iade raporu',
                            path: 'report/sales/itemSaleRebateReport'
                        },
                        {
                            id: 'slsRpt_01_006',
                            text: e.t('menuOff.slsRpt_01_006'),//'Cari Bazlı Satış iade raporu',
                            path: 'report/sales/customerSaleRebateReport'
                        },
                        {
                            id: 'slsRpt_01_007',
                            text: e.t('menuOff.slsRpt_01_007'),//'İade Fatura raporu',
                            path: 'report/sales/rebateInvoiceReport'
                        },
                        {
                            id: 'slsRpt_01_008',
                            text: e.t('menuOff.slsRpt_01_008'),//'İade Fatura raporu',
                            path: 'report/sales/itemInvoiceSalesReport'
                        },
                        {
                            id: 'slsRpt_01_009',
                            text: e.t('menuOff.slsRpt_01_009'),//'Açik Fatura raporu',
                            path: 'report/sales/openInvoiceSalesReport'
                        },
                    ]
                }
            ]
        },
        //PiqX
        {
            id: 'piqx',
            text: e.t('menuOff.piqx'),
            expanded: false,
            items: 
            [
                {
                    id:'piqx_01',
                    text:e.t('menuOff.piqx_01'),//'Listeler',
                    expanded:false,
                    items:
                    [
                        {
                            id: 'piqx_01_001',
                            text: e.t('menuOff.piqx_01_001'), //'Gelen Fatura Listesi',
                            path: 'piqx/lists/piqXIncomingList'
                        }
                    ]
                }
            ]
        },
        //Finans
        {
            id: 'fns',
            text: e.t('menuOff.fns'),
            expanded: false,
            items: 
            [
                {
                    id: 'fns_02',
                    text : e.t('menuOff.fns_02'),//'Evraklar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_02_001',
                            text: e.t('menuOff.fns_02_001'),//'Ödeme',
                            path: 'finance/documents/payment'
                        },
                        {
                            id: 'fns_02_002',
                            text: e.t('menuOff.fns_02_002'),//'Tahsilat',
                            path: 'finance/documents/collection'
                        },
                    ]
                },
                {
                    id: 'fns_03',
                    text : e.t('menuOff.fns_03'),//'Kasa - Banka İşlemleri',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_03_001',
                            text: e.t('menuOff.fns_03_001'),//'Kasa Tanıtım',
                            path: 'finance/cards/safeCard'
                        },
                        {
                            id: 'fns_03_002',
                            text: e.t('menuOff.fns_03_002'),//'Tahsilat',
                            path: 'finance/cards/bankCard'
                        },
                        {
                            id: 'fns_03_003',
                            text: e.t('menuOff.fns_03_003'),//'Tahsilat',
                            path: 'finance/documents/virement'
                        },
                    ]
                },
                {
                    id: 'fns_01',
                    text : e.t('menuOff.fns_01'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_01_001',
                            text: e.t('menuOff.fns_01_001'),//'Ödeme Listesi',
                            path: 'finance/lists/paymentList'
                        },
                        {
                            id: 'fns_01_002',
                            text: e.t('menuOff.fns_01_002'),//'Tahsilat Listesi',
                            path: 'finance/lists/collectionList'
                        },
                        {
                            id: 'fns_01_003',
                            text: e.t('menuOff.fns_01_003'),//'Tahsilat Listesi',
                            path: 'finance/lists/bankList'
                        },
                        {
                            id: 'fns_01_004',
                            text: e.t('menuOff.fns_01_004'),//'Tahsilat Listesi',
                            path: 'finance/lists/safeList'
                        },
                    ]
                },
                {
                    id: 'fns_05',
                    text : e.t('menuOff.fns_05'), //'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_05_001',
                            text: e.t('menuOff.fns_05_001'), //'Toplu Tahsilat Girişi',
                            path: 'finance/operations/wholeCollectionEntry'
                        },
                        {
                            id: 'fns_05_002',
                            text: e.t('menuOff.fns_05_002'), //'Toplu Ödeme Girişi',
                            path: 'finance/operations/wholePaymentEntry'
                        },
                    ]
                },
                {
                    id: 'fns_04',
                    text : e.t('menuOff.fns_04'),//'Raporlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'fns_04_001',
                            text: e.t('menuOff.fns_04_001'),//'Banka Ekstre Raporu',
                            path: 'finance/report/bankEkstreReport'
                        },
                        {
                            id: 'fns_04_003',
                            text: e.t('menuOff.fns_04_003'),//'Banka Ekstre Raporu',
                            path: 'finance/report/safeEkstreReport'
                        },
                        {
                            id: 'fns_04_002',
                            text: e.t('menuOff.fns_04_002'),//'Cari Bakiye Bakiye Raporu',
                            path: 'customers/report/customerBalanceReport'
                        }
                    ]
                }
            ]
        },
        //Personel
        {
            id: 'prsnl',
            text: e.t('menuOff.prsnl'),
            expanded: false,
            items: 
            [
                {
                    id:'prsnl_01',
                    text:e.t('menuOff.prsnl_01'),//'TANIMLAR',
                    expanded:false,
                    items:
                    [
                        {
                            id: 'prsnl_01_001',
                            text: e.t('menuOff.prsnl_01_001'), //'Personel Tanımları',
                            path: 'employee/cards/employeeCards'
                        },
                        {
                            id: 'prsnl_01_002',
                            text: e.t('menuOff.prsnl_01_002'), //'Adres Tanımları',
                            path: 'employee/cards/employeeAddressCards'
                        },
                        
                    ]
                },
                {
                    id:'prsnl_02',
                    text:e.t('menuOff.prsnl_02'),//'Listeler',
                    expanded:false,
                    items:
                    [
                        {
                            id: 'prsnl_02_001',
                            text: e.t('menuOff.prsnl_02_001'), //'Gelen Fatura Listesi',
                            path: 'employee/lists/employeeLists'
                        }
                        
                    ]
                },
                {
                    id:'prsnl_03',
                    text:e.t('menuOff.prsnl_03'),//'OPERASYONLAR',
                    expanded:false,
                    items:
                    [
                        {
                            id: 'prsnl_03_001',
                            text: e.t('menuOff.prsnl_03_001'), //'',
                            path: 'employee/operations/collectiveEmployee'
                        }
                        
                    ]
                },

            ]
        },
        //Pos İşlemleri
        {
            id: 'pos',
            text: e.t('menuOff.pos'),
            expanded: false,
            items: 
            [
                //Tanımlar
                {
                    id: 'pos_01',
                    text : e.t('menuOff.pos_01'),
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'pos_01_001',
                            text: e.t('menuOff.pos_01_001'),//'Cihaz Tanımları',
                            path: 'pos/card/posDeviceCard'
                        },
                        {
                            id: 'pos_01_002',
                            text: e.t('menuOff.pos_01_002'),//'Plu Kopyalama',
                            path: 'pos/card/pluCopy'
                        },
                        {
                            id: 'pos_01_003',
                            text: e.t('menuOff.pos_01_003'),//'Fiş Sonu Açıklaması',
                            path: 'pos/card/printDescription'
                        },
                        {
                            id: 'pos_01_004',
                            text: e.t('menuOff.pos_01_004'),//'Pos Mesaj',
                            path: 'pos/card/posMsg'
                        },
                        {
                            id: 'pos_01_005',
                            text: e.t('menuOff.pos_01_005'),//'Pos ödeme tipi tanımlama',
                            path: 'pos/card/posPayType'
                        }
                    ]
                },
                //Operasyonlar
                 {
                    id: 'pos_03',
                    text : e.t('menuOff.pos_03'),
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'pos_03_001',
                            text: e.t('menuOff.pos_03_001'),//'Gün Sonu Operasyonu',
                            path: 'pos/operation/endOfDay'
                        },
                        {
                            id: 'pos_03_002',
                            text: e.t('menuOff.pos_03_002'),//'Çekiliş Operasyonu',
                            path: 'pos/operation/posLottery'
                        }
                    ]
                },
                //Raporlar
                {
                    id: 'pos_02',
                    text : e.t('menuOff.pos_02'),
                    expanded: false,
                    items: 
                    [
                        //Satış Fiş Raporu
                        {
                            id: 'pos_02_001',
                            text: e.t('menuOff.pos_02_001'),
                            path: 'pos/report/salesTicketReport'
                        },
                        //Müşteri Puan Raporu
                        {
                            id: 'pos_02_002',
                            text: e.t('menuOff.pos_02_002'),
                            path: 'pos/report/customerPointReport'
                        },
                        //Pos Satış Raporu
                        {
                            id: 'pos_02_003',
                            text: e.t('menuOff.pos_02_003'),
                            path: 'pos/report/posSalesReport'
                        },
                        //Pos Satış Detay Raporu
                        {
                            id: 'pos_02_004',
                            text: e.t('menuOff.pos_02_004'),
                            path: 'pos/report/posSalesDetailReport'
                        },
                         //Pos Değişmiş Fiş Raporu
                        {
                            id: 'pos_02_005',
                            text: e.t('menuOff.pos_02_005'),
                            path: 'pos/report/changeTicketReport'
                        },
                        //Pos Gün sonu raporu
                        {
                            id: 'pos_02_006',
                            text: e.t('menuOff.pos_02_006'),
                            path: 'pos/report/enddayReport'
                        },
                        //Pos Avans Raporu
                        {
                            id: 'pos_02_007',
                            text: e.t('menuOff.pos_02_007'),
                            path: 'pos/report/posAdvanceReport'
                        },
                        //Stok Seçimli Satış Raporu
                        {
                            id: 'pos_02_008',
                            text: e.t('menuOff.pos_02_008'),
                            path: 'pos/report/itemSaleReport'
                        },
                        //Ürün Grup Satış Raporu
                        {
                            id: 'pos_02_009',
                            text: e.t('menuOff.pos_02_009'),
                            path: 'pos/report/itemGrpSalesReport'
                        },
                        //Ürün Detaylı Satış Raporu
                        {
                            id: 'pos_02_010',
                            text: e.t('menuOff.pos_02_010'),
                            path: 'pos/report/itemDetailSalesReport'
                        },
                        //Ürün Karşılaştırma Raporu
                        {
                            id: 'pos_02_011',
                            text: e.t('menuOff.pos_02_011'),
                            path: 'pos/report/itemComparisonReport'
                        },
                        //Müşteri Bazlı Ürün Satış Raporu 
                        {
                            id: 'pos_02_015',
                            text: e.t('menuOff.pos_02_015'),
                            path: 'pos/report/customerItemSaleReport'
                        },
                        //Loyalty 
                        {
                            id: 'pos_02_012',
                            text: e.t('menuOff.pos_02_012'),
                            path: 'pos/report/loyaltyReport'
                        },
                        //Discount 
                        {
                            id: 'pos_02_013',
                            text: e.t('menuOff.pos_02_013'),
                            path: 'pos/report/discountReport'
                        },
                        //Okunmamış Terazi Fişleri Raporu 
                        {
                            id: 'pos_02_014',
                            text: e.t('menuOff.pos_02_014'),
                            path: 'pos/report/balanceTicket'
                        },
                        //Okunmamış Terazi Fişleri Raporu 
                        {
                            id: 'pos_02_016',
                            text: e.t('menuOff.pos_02_016'),
                            path: 'pos/report/usingPointReport'
                        }
                    ]
                },
            ]
        },
        //Restorant İşlemleri
        {
            id: 'rest',
            text: e.t('menuOff.rest'),
            expanded: false,
            items: 
            [
                //Tanımlar
                {
                    id: 'rest_01',
                    text : e.t('menuOff.rest_01'),
                    expanded: false,
                    items:
                    [
                        {
                            id: 'rest_01_001',
                            text: e.t('menuOff.rest_01_001'),//'Masa Tanımları',
                            path: 'rest/card/tableCard'
                        },
                        {
                            id: 'rest_01_002',
                            text: e.t('menuOff.rest_01_002'),//'Özellik Tanımları',
                            path: 'rest/card/propertyCard'
                        },
                        {
                            id: 'rest_01_003',
                            text: e.t('menuOff.rest_01_003'),//'Yazıcı Tanımları',
                            path: 'rest/card/printerCard'
                        }
                    ]
                },
                //Operasyonlar
                {
                    id: 'rest_02',
                    text : e.t('menuOff.rest_02'),
                    expanded: false,
                    items:
                    [
                        {
                            id: 'rest_02_001',
                            text: e.t('menuOff.rest_02_001'),//'Masa İzleme',
                            path: 'rest/operation/tableWatch'
                        }
                    ]
                }
            ]
        },
        //Promosyon
        {
            id: 'promo',
            text: e.t('menuOff.promo'),
            expanded: false,
            items: 
            [
                {
                    id: 'promo_01',
                    text : e.t('menuOff.promo_01'),//'Tanımlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'promo_01_001',
                            text: e.t('menuOff.promo_01_001'),//'Promosyon Tanımları',
                            path: 'promotion/cards/promotionCard'
                        },
                        {
                            id: 'promo_01_002',
                            text: e.t('menuOff.promo_01_002'),//'indirim Tanımları',
                            path: 'promotion/cards/discountCard'
                        },
                    ]
                },
                {
                    id: 'promo_02',
                    text : e.t('menuOff.promo_02'),//'Listeler',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'promo_02_001',
                            text: e.t('menuOff.promo_02_001'),//'Promosyon Listesi',
                            path: 'promotion/lists/promotionList'
                        },
                        {
                            id: 'promo_02_002',
                            text: e.t('menuOff.promo_02_002'),//'Promosyon Detay Listesi',
                            path: 'promotion/lists/promotionDetailList'
                        }
                    ]
                },
                {
                    id: 'promo_04',
                    text : e.t('menuOff.promo_04'),//'Operasyonlar',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'promo_04_001',
                            text: e.t('menuOff.promo_04_001'),//'Promosyon Listesi',
                            path: 'promotion/operation/promoPricerSend'
                        },
                    ]
                },
                {
                    id: 'promo_03',
                    text : e.t('menuOff.promo_03'),//'Raporlar',
                    expanded: false,
                }
            ]
        },
        //Toplu İşlemler
        {
            id: 'proces',
            text: e.t('menuOff.proces'),
            expanded: false,
            items: 
            [
                {
                    id: 'proces_01',
                    text : e.t('menuOff.proces_01'),//'Toplu Stok işlemleri',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'proces_01_001',
                            text: e.t('menuOff.proces_01_001'),//'Toplu Ürün Grubu Güncelle',
                            path: 'proces/itemProces/itemGroupProces'
                        }
                    ]
                },
            ]
        },
        //Ayarlar
        {
            id: 'setting',
            text: e.t('menuOff.set'),
            expanded: false,
            items: 
            [
                {
                    id: 'set_02',
                    text : e.t('menuOff.set_02'),//'Sistem Ayarları',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'set_02_001',
                            text: e.t('menuOff.set_02_001'),//'FirmaBilgileri',
                            path: 'setting/officialSettings/companyCard'
                        },
                        {
                            id: 'set_02_002',
                            text: e.t('menuOff.set_02_002'),//'hakkında',
                            path: 'construction.js',
                        },
                        {
                            id: 'set_02_004',
                            text: e.t('menuOff.set_02_004'),//'kullanım klavuzu',
                            path: 'construction.js',
                        },
                        {
                            id: 'set_02_005',
                            text: e.t('menuOff.set_02_005'),//'yenilikler',
                            path: 'construction.js',
                        },
                        {
                            id: 'set_02_006',
                            text: e.t('menuOff.set_02_006'),//'Destek Talebi Oluştur',
                            path: 'setting/officialSettings/serviceContact'
                        },
                        {
                            id: 'set_02_007',
                            text: e.t('menuOff.set_02_007'),//'Destek Talebi Geçmişi',
                            path: 'setting/officialSettings/serviceHistory'
                        },
                        {
                            id: 'set_02_003',
                            text: e.t('menuOff.set_02_003'),//'anydesk',
                            path: 'construction.js',
                        },
                        {
                            id: 'set_02_008',
                            text: e.t('menuOff.set_02_008'),//'Gümrük Kodu Excel',
                            path: 'setting/officialSettings/customsCodeImport'
                        },
                        {
                            id: 'set_02_009',
                            text: e.t('menuOff.set_02_009'),//'Mail ayarlari',
                            path: 'setting/officialSettings/mailSettings'
                        },
                    ]
                },
                {
                    id: 'set_01',
                    text : e.t('menuOff.set_01'),//'Maliyet ve Ek Vergi',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'set_01_001',
                            text: e.t('menuOff.set_01_001'),//'Tax Sugar Oranları',
                            path: 'setting/costandtax/taxSugar'
                        },
                        {
                            id: 'set_01_002',
                            text: e.t('menuOff.set_01_002'),//'Tax Sugar Oranları',
                            path: 'setting/costandtax/interfel'
                        }
                    ]
                },
                {
                    id: 'set_03',
                    text : e.t('menuOff.set_03'),//'Dokuman Ayarları',
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'set_03_001',
                            text: e.t('menuOff.set_03_001'),//'Silinmiş Evrak Operasyonları',
                            path: 'setting/documentSetting/deletedDocOperations'
                        },
                        {
                            id: 'set_03_002',
                            text: e.t('menuOff.set_03_002'),//'Silinmiş Satırlar',
                            path: 'setting/documentSetting/deletedDocRows'
                        },
                        {
                            id: 'set_03_003',
                            text: e.t('menuOff.set_03_003'),//'Taşıyıcı  Kodu',
                            path: 'setting/documentSetting/transportTypeCard'
                        }
                    ]
                },
            ]
        }
    ]
}
export const menu = (e) => 
{
    return [
          //Stok
          {
            id: 'stk',
            text: e.t('menu.stk'),
            expanded: false,
            items: 
            [
                {
                    id: 'stk_01',
                    text : e.t('menu.stk_01'), //'Tanımlar'
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_01_001',
                            text: e.t('menu.stk_01_001'),//'Fiyat Gör',
                            path: 'items/cards/checkPrice'
                        },
                        {
                            id: 'stk_01_005',
                            text: e.t('menu.stk_01_005'),//'Fiyat Gör',
                            path: 'items/cards/changePrice'
                        },
                        {
                            id: 'stk_01_002',
                            text: e.t('menu.stk_01_002'),//'Tedarikçi Gör',
                            path: 'items/cards/checkCustomer'
                        },
                        {
                            id: 'stk_01_006',
                            text: e.t('menu.stk_01_006'),//'Barkod Ekleme',
                            path: 'items/cards/barcodeAdd'
                        },
                        {
                            id: 'stk_01_003',
                            text: e.t('menu.stk_01_003'),//'Barkod Tanımları',
                            path: 'items/cards/barcodeCard'
                        },
                        {
                            id: 'stk_01_004',
                            text: e.t('menu.stk_01_004'),//'Ürün Grubu Değiştir',
                            path: 'items/cards/itemGrpChange'
                        },
                        {
                            id: 'stk_01_007',
                            text: e.t('menu.stk_01_007'),//'Barkod Tanımları',
                            path: 'items/cards/itemGrpUpdate'
                        },
                    ]
                },
                {
                    id: 'stk_02',
                    text : e.t('menu.stk_02'), //'evraklar'
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'stk_02_001',
                            text: e.t('menu.stk_02_001'),//'Etiket Basım',
                            path: 'items/documents/labelPrinting'
                        },
                        {
                            id: 'stk_02_002',
                            text: e.t('menu.stk_02_002'),//'İade Ürün Toplama',
                            path: 'items/documents/rebateDoc'
                        },
                        {
                            id: 'stk_02_004',
                            text: e.t('menu.stk_02_004'),// Skt Giriş',
                            path: 'items/documents/expdateEntry'
                        },
                    ]
                },
            ]
        },
        {
            id: 'ord',
            text: e.t('menu.ord'),
            expanded: false,
            items: 
            [
                {
                    id: 'ord_01',
                    text : e.t('menu.ord_01'),//'Evraklar'
                    expanded: false,
                    items: 
                    [
                        {
                            id: 'ord_01_001',
                            text: e.t('menu.ord_01_001'),//'Satış Sipariş',
                            path: 'orders/documents/salesOrder'
                        },
                        {
                            id: 'ord_01_002',
                            text: e.t('menu.ord_01_002'),//'Satış Sipariş',
                            path: 'orders/documents/purchaseOrder'
                        },
                    ]
                },
            ]
        },
    ]
}
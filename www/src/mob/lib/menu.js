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
                            text: e.t('menu.stk_01_001'),//'Stok Tanımları',
                            path: 'items/cards/itemCard'
                        },
                        {
                            id: 'stk_01_002',
                            text: e.t('menu.stk_01_002'),//'Etiket Basım',
                            path: 'items/documents/labelPrinting'
                        },
                        {
                            id: 'stk_01_003',
                            text: e.t('menu.stk_01_003'),//'Fiyat Gör',
                            path: 'items/cards/checkPrice'
                        },
                        {
                            id: 'stk_01_004',
                            text: e.t('menu.stk_01_004'),//'Tedarikçi Gör',
                            path: 'items/cards/checkCustomer'
                        },
                        {
                            id: 'stk_01_005',
                            text: e.t('menu.stk_01_005'),//'Barkod Tanımları',
                            path: 'items/cards/barcodeCard'
                        },
                        {
                            id: 'stk_01_006',
                            text: e.t('menu.stk_01_006'),//'Ürün Grubu Değiştir',
                            path: 'items/cards/itemGrpChange'
                        },
                        {
                            id: 'stk_01_007',
                            text: e.t('menu.stk_01_007'),//'İade Ürün Toplama',
                            path: 'items/documents/rebateDoc'
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
                    ]
                },
            ]
        },
    ]
}
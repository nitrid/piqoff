export const testData = (e) => 
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
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
                            text: e.t('menu.stk_01_002'),//'Stok Tanımları',
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
                    ]
                },
            ]
        },
    ]
}
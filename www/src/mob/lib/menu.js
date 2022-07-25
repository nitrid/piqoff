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
    ]
}
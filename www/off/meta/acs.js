export const acs =
[
    {
        TYPE : 1,
        ID :"txtSeri",
        VALUE : {visible:false,editable:true},
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "txtSeri",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sipariş",
            CAPTION : "Seri"
        }
    },
    {
        TYPE : 1,
        ID :"txtSira",
        VALUE : {visible:false,editable:true},
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "txtSira",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sipariş",
            CAPTION : "Sıra"
        }
    },
    {
        TYPE : 1,
        ID :"txtBelge",
        VALUE : {visible:false,editable:true},
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "txtBelge",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sipariş",
            CAPTION : "Belge No"
        }
    },
    {
        TYPE : 1,
        ID :"test",
        VALUE : 
        {
            visible : true,
            columns :
            {
                CODE : 
                {
                    editable : false
                },
                NAME : 
                {
                    visible : true
                }
            }
        },
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "test",
        APP : "ADMIN"
    },
    {
        TYPE : 1,
        ID :"pop_stok",
        VALUE : 
        {
            visible : true,
            columns :
            {
                CODE : 
                {
                    editable : false
                },
                NAME : 
                {
                    visible : true
                }
            }
        },
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "test",
        APP : "ADMIN"
    },
    {
        TYPE : 1,
        ID :"popgrid",
        VALUE : 
        {
            btn:
            {
                visible: true
            },
            grid:
            {
                visible : true,
                columns :
                {
                    VALUE : 
                    {
                        visible : true
                    },
                    ID : 
                    {
                        visible : false
                    }
                }
            }
        },
        SPECIAL : "",
        PAGE : "P0002",
        ELEMENT : "popgrid",
        APP : "ADMIN"
    },
    {
        TYPE : 1,
        ID :"StokGrid",
        VIEW : {PAGE_NAME :'STOK GRID'},
        VALUE : 
        {
            btn:
            {
                CAPTION :"Buton Görünürlüğü",
                visible: true
            },
            grid:
            {
                CAPTION : "GRİD Görünürlüğü",
                visible : true,
                columns :
                {
                    VALUE : 
                    {
                        visible : true
                    },
                    ID : 
                    {
                        visible : false
                    }
                }
            }
        },
        SPECIAL : "",
        PAGE : "stk_03_001",
        ELEMENT : "popgrid",
        APP : "OFF  "
    },
]
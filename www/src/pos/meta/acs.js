export const acs =
[
    //TYPE = 0 => SISTEM TYPE = 1 => EVRAK TYPE = 2 => ELEMENT
    //#region Pos
    //btnPluEdit
    {
        TYPE : 2,
        ID :"btnPluEdit",
        VALUE : {dialog:{type:1}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPluEdit",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "PLU Düzenle"
        }
    },
    //btnSafeOpen
    {
        TYPE : 2,
        ID :"btnSafeOpen",
        VALUE : {dialog:{type:1}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSafeOpen",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "Kasa Aç"
        }
    },
    //PriceEdit
    {
        TYPE : 1,
        ID :"PriceEdit",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Düzenle"
        }
    },
    //#endregion
]
export const acs =
[
    //TYPE = 0 => SISTEM TYPE = 1 => EVRAK TYPE = 2 => ELEMENT
    //#region Pos
    //btnDeviceEntry
    {
        TYPE : 2,
        ID :"btnDeviceEntry",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDeviceEntry",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "Cihaz Giriş"
        }
    },
    //btnPluEdit
    {
        TYPE : 2,
        ID :"btnPluEdit",
        VALUE : {dialog:{type:0}},
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
    //btnPopParkListAll
    {
        TYPE : 2,
        ID :"btnPopParkListAll",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPopParkListAll",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "Parktaki Tüm Liste"
        }
    },
    //btnDiscount
    {
        TYPE : 2,
        ID :"btnDiscount",
        VALUE : {dialog:{type:1}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDiscount",
        APP : "POS",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Pos",
            CAPTION : "İskonto Giriş Butonu"
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
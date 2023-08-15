export const prm =
[
    //#region Sistem
    //Bütük Harf
    {
        TYPE : 0,
        ID :"onlyBigChar",
        VALUE : 
        {
            value : true
        },
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Sadece Büyük Harf Kullanımı"
        }
    },
    //#endregion
    //#region Sale
    //defaultUnit
    {
        TYPE : 1,
        ID :"defaultUnit",
        VALUE : 
        {
            value : "Kilogramme"
        },
        SPECIAL : "",
        PAGE : "sale.js",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış",
            CAPTION : "Sabit Birim"
        }
    },
    //#endregion
]
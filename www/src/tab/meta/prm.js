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
     // Ödeme ve tahsilat için fatura zorunluluğu
     {
        TYPE : 0,
        ID :"invoicesForPayment",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Ödeme İşlemleri İçin Fatura Seçme Zorunluluğu"
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
            value : "Colis"
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
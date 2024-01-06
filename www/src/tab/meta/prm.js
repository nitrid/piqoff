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
    //cmbDepot
    {
        TYPE : 1,
        ID :"cmbDepot",
        VALUE : 
        {
            value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
        },
        SPECIAL : "",
        PAGE : "sale.js",
        ELEMENT : "cmbDepot",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Satış",
            CAPTION : "Depo",
            DISPLAY : "NAME",
            FIELD : "GUID",
            DATA :
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME FROM DEPOT WHERE STATUS = 1 AND DELETED = 0 ORDER BY CODE ASC"
                },
            }
        }
    },
    //Fiyat Listesi
    {
        TYPE : 1,
        ID :"PricingListNo",
        VALUE : 1,
        SPECIAL : "",
        PAGE : "sale.js",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış",
            CAPTION : "Fiyat Liste No"
        }
    },
    //#endregion
]
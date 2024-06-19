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
            value : "EEB85132-6BCB-4C18-B6FA-46A1E0C1C813"
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
    // Satis menü
    {
        TYPE : 3,
        ID :"saleCard",
        VALUE : true,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "menu",
            CAPTION : "Satış menü"
        }
    },
    // Müsteri ekstresi menü
    {
        TYPE : 3,
        ID :"customerExtractCard",
        VALUE : true,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "menu",
            CAPTION : "Müşteri ekstresi menü"
        }
    },
    // Ürün info menü
    {
        TYPE : 3,
        ID :"productCard",
        VALUE : true,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "menu",
            CAPTION : "Ürün info menü"
        }
    },
    // tahsilat menü
    {
        TYPE : 3,
        ID :"collectionCard",
        VALUE : true,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "menu",
            CAPTION : "tahsilat menü"
        }
    },
    // Müsteri tanimlama menü
    {
        TYPE : 3,
        ID :"customerCard",
        VALUE : true,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "menu",
            CAPTION : "Müşteri tanimlama menü"
        }
    },
    //#endregion
]
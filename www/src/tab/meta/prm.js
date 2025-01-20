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
            value : false
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Ödeme İşlemleri İçin Fatura Seçme Zorunluluğu"
        }
    },
        // Ödeme ve tahsilat için Fatura secme durumu
    {
        TYPE : 0,
        ID :"invoicesForFacture",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Ödeme İşlemleri İçin Fatura Seçme durumu"
        }
    },
    // Şipariş kayıt ederken fatura ozellıgı olması veya olmaması
    {
        TYPE : 0,
        ID :"salesİnvoicesForFacture",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Şipariş kayıt ederken fatura ozellıgı olması"
        }
    },
    // Şipariş Sayfası Ürünler Listelenirken "Name" mi Gore "Code" mı gore Listelensin
    {
        TYPE : 0,
        ID :"salesİtemsType",
        VALUE : 
        {
            value : "NAME"
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Şipariş Sayfası Ürünler Listelenirken mi Name Gore Code mı gore Listelensin"
        }
    },
     // Şipariş Sayfası kayır edince yeni evraka gecsin
     {
        TYPE : 0,
        ID :"autoNewOrder",
        VALUE : true,
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Şipariş Sayfası kayır edince yeni evraka gecsin mi?"
        }
    },
    // Satış Sayfasında Evrak Nunamarası en son evrak numarasından artarak devam etsin
    {
        TYPE : 0,
        ID :"docNoAuto",
        VALUE : true,
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Satış Sayfasında Evrak Nunamarası en son evrak numarasından artarak devam etsin mi?"
        }
    },
    // Birim kilitli mi
    {
        TYPE : 0,
        ID :"unitLock",
        VALUE : true,
        SPECIAL : "",
        ELEMENT : "",
        APP : "TAB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Sabit Birim"
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
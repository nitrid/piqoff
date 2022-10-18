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
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Sadece Büyük Harf Kullanımı"
        }
    },
    {
        TYPE : 0,
        ID :"refForCustomerCode",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Seri Numarası İçin Cari Kodu Kullan"
        }
    },
    //#endregion


     //#region Depo Sevk
     // negativeQuantity
     {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_02_002",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Depolar Arası Transfer",
            CAPTION : "Eksiye Düşemeye İzin Verme"
        }
    },
    //#endregion
    //#region İade Ürün Toplama
     // negativeQuantity
     {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_02_005",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "Eksiye Düşemeye İzin Verme"
        }
    },
    // cmbDepot1
    {
        TYPE : 2,
        ID :"cmbDepot1",
        VALUE : 
        {
            value : '1A428DFC-48A9-4AC6-AF20-4D0A4D33F316'
        },
        SPECIAL : "",
        PAGE : "stk_02_002",
        ELEMENT : "cmbDepot1",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "Çıkış Depo"
        }
    },
     // cmbDepot2
     {
        TYPE : 2,
        ID :"cmbDepot2",
        VALUE : 
        {
            value : '1A428DFC-48A9-4AC6-AF20-4D0A4D33F816'
        },
        SPECIAL : "",
        PAGE : "stk_02_002",
        ELEMENT : "cmbDepot2",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "İade Depo"
        }
    },
    //#endregion

    //#region Fiyat Değiştir
     //Satış Fiyatı Maliyet Kontrolü
     {
        TYPE : 1,
        ID :"SalePriceCostCtrl",
        VALUE : true,
        SPECIAL : "",
        PAGE : "stk_01_005",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Fiyat Değiştir",
            CAPTION : "Satış Fiyatı Maliyet Kontrolü"
        }
    },
    //#endregion


]
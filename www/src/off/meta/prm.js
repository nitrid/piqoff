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
    //Tedarikçi kodu Seri olsun
    {
        TYPE : 0,
        ID :"refForCustomerCode",
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
            CAPTION : "Seri Numarası İçin Cari Kodu Kullan"
        }
    },
    // Alış Faturasından Fiyat Güncelleme
    {
        TYPE : 0,
        ID :"purcInvoıcePriceSave",
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
            CAPTION : "Alış Faturasından Alış Fiyatı Güncelleme"
        }
    },
    //Para Sembolu
    {
        TYPE : 0,
        ID :"MoneySymbol",
        VALUE : {code:"EUR",sign:"€"},
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Para Sembolü"
        }
    },
    //Para Sembolu
    {
        TYPE : 0,
        ID :"pruchasePriceAlert",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "Daha Düşük Fiyatlı Tedarikçi Uyarısı"
        }
    },
    //#endregion
    //#region Stok Tanıtım
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Referans"
        }
    },
    //cmbItemGrp
    {
        TYPE : 2,
        ID :"cmbItemGrp",
        VALUE : 
        {
            value : "",
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbItemGrp",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grup"
        }
    },
    //txtCustomer
    {
        TYPE : 2,
        ID :"txtCustomer",
        VALUE : 
        {
            value : "",
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCustomer",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tedarikçi"
        }
    },
    //cmbItemGenus
    {
        TYPE : 2,
        ID :"cmbItemGenus",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbItemGenus",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Cinsi"
        }
    },
    //txtBarcode
    {
        TYPE : 2,
        ID :"txtBarcode",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtBarcode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Barkod"
        }
    },
    //cmbTax
    {
        TYPE : 2,
        ID :"cmbTax",
        VALUE : 
        {
            value : "5.5"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbTax",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Vergi"
        }
    },
    //cmbMainUnit
    {
        TYPE : 2,
        ID :"cmbMainUnit",
        VALUE : 
        {
            value : "001"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbMainUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Tipi"
        }
    },
    //txtMainUnit
    {
        TYPE : 2,
        ID :"txtMainUnit",
        VALUE : 
        {
            value : 1,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required"
                    },
                    {
                        type : "numeric",
                    },
                    {
                        type : "range",
                        msg : "Le multiplicateur d'unité pricipale ne peut pas être inférieur à un !!",
                        min : 1
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMainUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Çarpan"
        }
    },
    //cmbOrigin
    {
        TYPE : 2,
        ID :"cmbOrigin",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbOrigin",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Menşei"
        }
    },
    //cmbUnderUnit
    {
        TYPE : 2,
        ID :"cmbUnderUnit",
        VALUE : 
        {
            value : "002"
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbUnderUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Tipi"
        }
    },
    //txtUnderUnit
    {
        TYPE : 2,
        ID :"txtUnderUnit",
        VALUE : 
        {
            value : 1,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "required",
                    },
                    {
                        type : "numeric",
                    },
                    {
                        type : "range",
                        msg : "Le contenue ne peut pas être nul ou inférieur à zéro !",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtUnderUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Çarpan"
        }
    },
    //txtItemName
    {
        TYPE : 2,
        ID :"txtItemName",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtItemName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Adı"
        }
    },
    //txtShortName
    {
        TYPE : 2,
        ID :"txtShortName",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtShortName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kısa Adı"
        }
    },
    //chkActive
    {
        TYPE : 2,
        ID :"chkActive",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkActive",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Aktif"
        }
    },
    //chkCaseWeighed
    {
        TYPE : 2,
        ID :"chkCaseWeighed",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkCaseWeighed",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kasada Tartılsın"
        }
    },
    //chkLineMerged
    {
        TYPE : 2,
        ID :"chkLineMerged",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkLineMerged",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Satır Birleştir"
        }
    },
    //chkTicketRest
    {
        TYPE : 2,
        ID :"chkTicketRest",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkTicketRest",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest."
        }
    },
    //txtCostPrice
    {
        TYPE : 2,
        ID :"txtCostPrice",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Ne peut pas saisir 0!",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCostPrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest."
        }
    },
    //txtMinSalePrice
    {
        TYPE : 2,
        ID :"txtMinSalePrice",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Ne peut pas saisir 0!",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMinSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Min. Satış Fiyatı"
        }
    },
    //txtMaxSalePrice
    {
        TYPE : 2,
        ID :"txtMaxSalePrice",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmItems",
                val : 
                [
                    {
                        type : "range",
                        msg : "Ne peut pas saisir 0!",
                        min : 0.01
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMaxSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Max. Satış Fiyatı"
        }
    },
    //txtLastBuyPrice
    {
        TYPE : 2,
        ID :"txtLastBuyPrice",
        VALUE : 0,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastBuyPrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Alış Fiyatı"
        }
    },
    //txtLastSalePrice
    {
        TYPE : 2,
        ID :"txtLastSalePrice",
        VALUE : 0,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Satış Fiyatı"
        }
    },
    //Urun Grubuna Göre Menşei Validation
    {
        TYPE : 1,
        ID :"ItemGrpForOrginsValidation",
        VALUE : ['017'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Menşei Validation"
        }
    },
    //Urun Grubuna Göre Min Max Yetki
    {
        TYPE : 1,
        ID :"ItemGrpForMinMaxAccess",
        VALUE : ['017'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Min Max Yetki"
        }
    },
    //Urun Grubuna Fiyatsız Girebilme
    {
        TYPE : 1,
        ID :"ItemGrpForNotPriceSave",
        VALUE : ['209','210','002','033'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Fiyatsız Kayıt"
        }
    },
    //Otomatik Min Fiyat Atama
    {
        TYPE : 1,
        ID :"ItemMinPricePercent",
        VALUE : 10,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Minimum Satış Yüzdesi"
        }
    },
    //Otomatik Max Fiyat Atama 
    {
        TYPE : 1,
        ID :"ItemMaxPricePercent",
        VALUE : 400,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün MAximum Satış Yüzdesi"
        }
    },
    //Satış Fiyatı Maliyet Kontrolü
    {
        TYPE : 1,
        ID :"SalePriceCostCtrl",
        VALUE : true,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Satış Fiyatı Maliyet Kontrolü"
        }
    },
    //Tedarikçi Fiyatı Satış Fiyatından Yüksek Olamaz Kontrolü
    {
        TYPE : 1,
        ID :"SalePriceToCustomerPriceCtrl",
        VALUE : true,
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ted. Fiyatı Yüksek Olamaz Kontrolü"
        }
    },
    //Tax Sugar
    {
        TYPE : 1,
        ID :"taxSugarGroupValidation",
        VALUE : ['105','106','007'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tax Sugar Uygulanacak Gruplar"
        }
    },
    //#endregion

    //#region Stok Liste
    {
        TYPE : 1,
        ID :"emptyCode",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "stk_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Stok Listesi",
            CAPTION : "Bulunamayan Ürünler İçin Boş Satır Atılsın"
        }
    },
    //#endregion
    //#region Cari Tanıtım
    //cmbType
    {
        TYPE : 2,
        ID :"cmbType",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbType",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Tip"
        }
    },
    //cmbType
    {
        TYPE : 2,
        ID :"cmbGenus",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbGenus",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Cinsi"
        }
    },
    //txtCode
    {
        TYPE : 2,
        ID :"txtCode",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Vous ne pouvez pas laisser le code vide!"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Cinsi"
        }
    },
    //txtTitle
    {
        TYPE : 2,
        ID :"txtTitle",
        VALUE : 
        {
            
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtTitle",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Ünvan"
        }
    },
     //txtCustomerName
     {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Vous ne pouvez pas laisser le nom vide. !"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Adı"
        }
    },
     //txtCustomerLastname
     {
        TYPE : 2,
        ID :"txtCustomerLastname",
        VALUE : 
        {
            validation :
            {
                grp : "frmCustomers",
                val : 
                [
                    {
                        type : "required",
                        msg : "Vous ne pouvez pas laisser le nom vide"
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerLastname",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Soyadı"
        }
    },
    //#endregion

    //#region Satış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Faturası",
            CAPTION : "Seri"
        }
    },
    //txtRefno
    {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "number",
            PAGE_NAME : "Satış Faturası",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Faturası",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Faturası",
            CAPTION : "Cari Kodu"
        }
    },
    // txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Faturası",
            CAPTION : "Cari Adı"
        }
    },
    // negativeQuantity
    {
    TYPE : 1,
    ID :"negativeQuantity",
    VALUE : 
    {
        value : false
    },
    SPECIAL : "",
    PAGE : "ftr_02_002",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "checkbox",
        PAGE_NAME : "Satış Faturası",
        CAPTION : "Eksiye Düşemeye İzin Verme"
    }
    },
    //#endregion

    //#region Alış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Seri"
        }
    },
    //txtRefno
    {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : 
        {
            value : "0"
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "number",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Cari Kodu"
        }
    },
    // txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Cari Adı"
        }
    },
       //#endregion
    
    //#region Promosyon
    //txtRef
    {
        TYPE : 2,
        ID :"txtCode",
        VALUE : 
        {
            validation :
            {
                grp : "frmPromo",
                val : 
                [
                    {
                        type : "required",
                    }
                ]
            }
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Promosyon Tanımları",
            CAPTION : "Kodu"
        }
    },
    //#endregion

    //#region Satış Anlaşması
    // maxDiscount
    {
        TYPE : 1,
        ID :"maxDiscount",
        VALUE : 
        {
            value : 30
        },
        SPECIAL : "",
        PAGE : "cnt_02_002",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Anlaşması",
            CAPTION : "İzin Verilen En Yüksek İndirim Yüzde"
        }
    },
    //#endregion

    //#region Depo Miktar Listesi
    // maxDiscount
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : '1A428DFC-48A9-4AC6-AF20-4D0A4D33F316'
        },
        SPECIAL : "",
        PAGE : "stk_03_006",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Depo Miktar Listesi",
            CAPTION : "Varsayılan Depo"
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
    //cmbDepot1
    {
    TYPE : 2,
    ID :"cmbDepot1",
    VALUE : 
    {
        value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
    },
    SPECIAL : "",
    PAGE : "stk_02_005",
    ELEMENT : "cmbDepot1",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "text",
        PAGE_NAME : "İade Ürün Toplama",
        CAPTION : "Çıkış Depo"
    }
    },
    //cmbDepot2
    {
    TYPE : 2,
    ID :"cmbDepot2",
    VALUE : 
    {
        value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F816"
    },
    SPECIAL : "",
    PAGE : "stk_02_005",
    ELEMENT : "cmbDepot2",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "text",
        PAGE_NAME : "İade Ürün Toplama",
        CAPTION : "Giriş Depo"
    }
    },
    //#endregion

    //#region Kayıp Ürün
     // Zorunlu Açıklama
     {
        TYPE : 1,
        ID :"descriptionControl",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "stk_02_003",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Kayıp Ürün Fişi",
            CAPTION : "Satır Açıklamalarını Zorunlu Kıl"
        }
    },
     // negativeQuantity
     {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_02_003",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME :  "Kayıp Ürün Fişi",
            CAPTION : "Eksiye Düşemeye İzin Verme"
        }
    },
    //#endregion
    //#region Gün sonu
    // Merkez kasa 
    {
        TYPE : 1,
        ID :"SafeCenter",
        VALUE : "df8b4f69-9e2d-449a-996a-0001abcf0308",
        SPECIAL : "",
        PAGE : "pos_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa"
        }
    },
     // Anavas Tutar
     {
        TYPE : 1,
        ID :"advanceAmount",
        VALUE : "450",
        SPECIAL : "",
        PAGE : "pos_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Avans Tutarı"
        }
    },
    //#endregion
    //#region Satış İrsaliye
     // negativeQuantity
    {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
    {
        TYPE : "checkbox",
        PAGE_NAME : "Satış İrsaliye",
        CAPTION : "Eksiye Düşemeye İzin Verme"
        }
    },
    //#endregion
    //#region Alış Anlaşması
     //cmbDepot
     {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
        },
        SPECIAL : "",
        PAGE : "cnt_02_001",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Anlaşması",
            CAPTION : "Depo"
        }
    },
    //#endregion
    //#region Satış Anlaşması
     //cmbDepot
     {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
        },
        SPECIAL : "",
        PAGE : "cnt_02_002",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Anlaşması",
            CAPTION : "Depo"
        }
    },
    //#endregion
]
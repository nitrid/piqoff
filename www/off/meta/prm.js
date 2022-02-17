export const prm =
[
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
            value : "1"
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
                        msg : "Ana birim çarpanı bir den küçük olamaz !",
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
            value : "001"
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
                        msg : "Alt birim çarpanı sıfır ve sıfır dan küçük olamaz !",
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
            value : false
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
                        msg : "Sıfır değer giremezsiniz !",
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
                        msg : "Sıfır değer giremezsiniz !",
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
                        msg : "Sıfır değer giremezsiniz !",
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
    //Urun Grubuna Göre Menşei Validation
    {
        TYPE : 1,
        ID :"ItemGrpForOrginsValidation",
        VALUE : ['019','021'],
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
        VALUE : ['019','021'],
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
                        msg : "Kodu'ı boş geçemezsiniz !"
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
    //txtCode
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
                        msg : "Adı boş geçemezsiniz !"
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
                        msg : "Soyadı boş geçemezsiniz !"
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
    {
        TYPE : 1,
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
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Seri Numarası İçin Cari Kodu Kullan"
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
    {
        TYPE : 1,
        ID :"refForCustomerCode",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Seri Numarası İçin Cari Kodu Kullan"
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
]
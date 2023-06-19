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
        APP : "MOB",
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
        PAGE : "",
        ELEMENT : "",
        APP : "MOB",
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
        APP : "MOB",
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
        APP : "MOB",
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
            TYPE : "combobox",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "Çıkış Depo",
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
            TYPE : "combobox",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "İade Depo",
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
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Fiyat Değiştir",
            CAPTION : "Satış Fiyatı Maliyet Kontrolü"
        }
    },
    //#endregion
    //#region Satış Sipariş
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_01",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Sipariş",
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
    //chkAutoAdd
    {
        TYPE : 2,
        ID :"chkAutoAdd",
        VALUE : false,
        SPECIAL : "",
        PAGE : "sip_01",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Satış Sipariş",
            CAPTION : "Otomatik Ekle",
        }
    },
    //txtQuantity
    {
        TYPE : 2,
        ID :"txtQuantity",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmBarcode",
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
        PAGE : "sip_01",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Satış Sipariş",
            CAPTION : "Miktar",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtQuantity"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtQuantityValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtQuantityGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtQuantityVal",
                                    form:
                                    {
                                        width:"800",
                                        height:"600",
                                        formWidth:"600",
                                        formHeight:"260",
                                        allowAdding : false,
                                        allowUpdating : true,
                                        allowDeleting : false
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        }
    },
    //#endregion
    //#region Alış Sipariş
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_02",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Sipariş",
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
    //chkAutoAdd
    {
        TYPE : 2,
        ID :"chkAutoAdd",
        VALUE : false,
        SPECIAL : "",
        PAGE : "sip_02",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Alış Sipariş",
            CAPTION : "Otomatik Ekle",
        }
    },
    //txtQuantity
    {
        TYPE : 2,
        ID :"txtQuantity",
        VALUE : 
        {
            value : 0,
            validation :
            {
                grp : "frmBarcode",
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
        PAGE : "sip_02",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış Sipariş",
            CAPTION : "Miktar",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtQuantity"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtQuantityValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtQuantityGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtQuantityVal",
                                    form:
                                    {
                                        width:"800",
                                        height:"600",
                                        formWidth:"600",
                                        formHeight:"260",
                                        allowAdding : false,
                                        allowUpdating : true,
                                        allowDeleting : false
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        }
    },
    //#endregion
]
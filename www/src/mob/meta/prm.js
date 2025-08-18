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
    //LIMIT QUANTITY
    {
        TYPE : 0,
        ID :"limitQuantity",
        VALUE : 
        {
            value : 10000
        },
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "Miktar 9 999 dan büyük olamaz!"
        }
    },
    //Sadece Onaylı Siparişler
    {
        TYPE : 0,
        ID :"onlyApprovedPairing",
        VALUE : 
        {
            value : 'true'
        },
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "Sadece Onaylı Siparişler"
        }
    },
    {
        TYPE : 0,
        ID :"refForCustomerCode",
        VALUE : true,
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
  //SAYFA YÜKLENMEDEN ÖNCE HANGİ SAYFANIN ACILACAGI PARAMETRE
  {
    TYPE : 0,
    ID :"deafultPage",
    VALUE : 
    {
        value : "",
        pageId: ""
    },
    SPECIAL : "",
    PAGE : "",
    ELEMENT : "",
    APP : "MOB",
    VIEW : 
    {
        TYPE : "popInput",
        PAGE_NAME : "Sistem",
        CAPTION : "Girişte açılacak sayfa",
        DISPLAY : "active",
        FORM: 
        {
            width:"400",
            height:"220",
            colCount:1,
            item:
            [
                {type:"text",caption:"Girişte açılacak sayfa yolu",field:"value",id:"txtPopDeafultPage"},
                {type:"text",caption:"Girişte açılacak sayfa ID",field:"pageId",id:"txtPopDeafultPageId"},
            ]
        }
    }
    
},
    //BarcodePattern
    {
        TYPE : 0,
        ID :"BarcodePattern",
        VALUE : 
        [
            '20NNNNMMMCCF',
            '21NNNNNMMMCCF',
            '29NNNNMMMCCF',
            '29NNNNNMMMCCF',
            '020NNNNMMMCCF',
            '27NNNNNKKGGGF',
        ],
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popTextList",
            PAGE_NAME : "Pos Satış Sipariş",
            CAPTION : "Barkod Desenleri",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
        }
    },
    //Terazi Fiyat Çarpanı
    {
        TYPE : 0,
        ID :"ScalePriceFactory",
        VALUE : 1,
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos Satış Sipariş",
            CAPTION : "Terazi Fiyat Çarpanı"
        }
    },
    //#endregion

    //#region Alış Sipariş
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_02",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış Sipariş",
            CAPTION : "Ref",           
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
        PAGE : "sip_02",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "sip_02",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Alış Sipariş",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
     //#region Özel Alış Sipariş
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_99",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Özel Alış Sipariş",
            CAPTION : "Ref",           
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : 
        {
            value : "1A428DFC-48A9-4AC6-AF20-4D0A4D33F316"
        },
        SPECIAL : "",
        PAGE : "sip_99",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Özel Alış Sipariş",
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
        PAGE : "sip_99",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Özel Alış Sipariş",
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
        PAGE : "sip_99",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Özel Alış Sipariş",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "sip_99",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Özel Alış Sipariş",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
     //rowMerge
     {
        TYPE : 1,
        ID :"customer",
        VALUE : 
        {
            value : "1697898160"
        },
        SPECIAL : "",
        PAGE : "sip_99",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Özel Alış Sipariş",
            CAPTION : "Otomatik Tedarikçi",
        }
    },
    //#endregion
    //#region Satış Sipariş
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_01",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış Sipariş",
            CAPTION : "Ref",           
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
        PAGE : "sip_01",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "sip_01",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Satış Sipariş",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Pos Satış Sipariş
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_04",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos Satış Sipariş",
            CAPTION : "Ref",           
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
        PAGE : "sip_04",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos Satış Sipariş",
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
        PAGE : "sip_04",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos Satış Sipariş",
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
        PAGE : "sip_04",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "sip_04",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos Satış Sipariş",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },

    //#region Toplu Sipariş
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "sip_03",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Toplu Sipariş",
            CAPTION : "Ref",           
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
        PAGE : "sip_03",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Toplu Sipariş",
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
        PAGE : "sip_03",
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
        PAGE : "sip_03",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Toplu Sipariş",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "sip_03",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Toplu Sipariş",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Sayım
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_05",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sayım",
            CAPTION : "Ref",           
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
        PAGE : "stk_05",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Sayım",
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
        PAGE : "stk_05",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sayım",
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
        PAGE : "stk_05",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Sayım",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "stk_05",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Sayım",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Etiket Bas
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_06",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Etiket Bas",
            CAPTION : "Ref",           
        }
    },
    //chkAutoAdd
    {
        TYPE : 2,
        ID :"chkAutoAdd",
        VALUE : false,
        SPECIAL : "",
        PAGE : "stk_06",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Etiket Bas",
            CAPTION : "Otomatik Ekle",
        }
    },
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "stk_06",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Etiket Bas",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region İade Depo sevk
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_08",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "İade Depo Sevk",
            CAPTION : "Ref",           
        }
    },
    //cmbOutDepot
    {
        TYPE : 2,
        ID :"cmbOutDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_08",
        ELEMENT : "cmbOutDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "İade Depo Sevk",
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
    //cmbInDepot
    {
        TYPE : 2,
        ID :"cmbInDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_08",
        ELEMENT : "cmbInDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "İade Depo Sevk",
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
        PAGE : "stk_08",
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
        PAGE : "stk_08",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "İade Depo Sevk",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "stk_08",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "İade Depo Sevk",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Depolar Arası Sevk
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "dep_01",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Depolar Arası Sevk",
            CAPTION : "Ref",           
        }
    },
    //cmbOutDepot
    {
        TYPE : 2,
        ID :"cmbOutDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "dep_01",
        ELEMENT : "cmbOutDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Depolar Arası Sevk",
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
    //cmbInDepot
    {
        TYPE : 2,
        ID :"cmbInDepot",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "dep_01",
        ELEMENT : "cmbInDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Depolar Arası Sevk",
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

    //#region Fire cikisi
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_09",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Fire cikisi",
            CAPTION : "Ref",           
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
        PAGE : "stk_09",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Fire cikisi",
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
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "stk_09",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Fire cikisi",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
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
        PAGE : "stk_09",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Fire cikisi",
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

    // Traitement DLC
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "stk_10",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Son Kullanma Tarihi İşlemleri",
            CAPTION : "Ref",           
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
        PAGE : "stk_10",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Son Kullanma Tarihi İşlemleri",
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
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "stk_10",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Son Kullanma Tarihi İşlemleri",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
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
        PAGE : "stk_10",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Son Kullanma Tarihi İşlemleri",
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
    //chkAutoAdd
    {
        TYPE : 2,
        ID :"chkAutoAdd",
        VALUE : false,
        SPECIAL : "",
        PAGE : "dep_01",
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
        PAGE : "dep_01",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Depolar Arası Sevk",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "dep_01",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Depolar Arası Sevk",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Alış İrsaliye
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "irs_01",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Alış İrsaliye",
            CAPTION : "Ref",           
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
        PAGE : "irs_01",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Alış İrsaliye",
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
        PAGE : "irs_01",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Alış İrsaliye",
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
        PAGE : "irs_01",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış İrsaliye",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "irs_01",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Alış İrsaliye",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Satış İrsaliye
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "irs_02",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Satış İrsaliye",
            CAPTION : "Ref",           
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
        PAGE : "irs_02",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Satış İrsaliye",
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
        PAGE : "irs_02",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Satış İrsaliye",
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
        PAGE : "irs_02",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış İrsaliye",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "irs_02",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Satış İrsaliye",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Şube Satış İrsaliye
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "irs_03",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şube Satış İrsaliye",
            CAPTION : "Ref",           
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
        PAGE : "irs_03",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Şube Satış İrsaliye",
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
        PAGE : "irs_03",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Şube Satış İrsaliye",
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
        PAGE : "irs_03",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış İrsaliye",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "irs_03",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Şube Satış İrsaliye",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region İade İrsaliye
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "irs_04",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "İade İrsaliye",
            CAPTION : "Ref",           
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
        PAGE : "irs_04",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "İade İrsaliye",
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
        PAGE : "irs_04",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "İade İrsaliye",
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
        PAGE : "irs_04",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış İrsaliye",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "irs_04",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "İade İrsaliye",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
    //#endregion
    //#region Sipariş Eşleştirme
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "kar_01",
        ELEMENT : "txtRef",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sipariş Eşleştirme",
            CAPTION : "Ref",           
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
        PAGE : "kar_01",
        ELEMENT : "cmbDepot",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Sipariş Eşleştirme",
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
        PAGE : "kar_01",
        ELEMENT : "chkAutoAdd",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sipariş Eşleştirme",
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
        PAGE : "kar_01",
        ELEMENT : "txtQuantity",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış İrsaliye",
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
    //rowMerge
    {
        TYPE : 1,
        ID :"rowMerge",
        VALUE : 
        {
            value : 2
        },
        SPECIAL : "",
        PAGE : "kar_01",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Sipariş Eşleştirme",
            CAPTION : "Satır Birleştir",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA : [{CODE:0,NAME:"Birleştir"},{CODE:1,NAME:"Birleştirme"},{CODE:2,NAME:"Kullanıcıya Sor"}]
        }
    },
        //Şipariş satır göstergesi
    {
        TYPE : 1,
        ID :"showOrderLine",
        VALUE : true,
        APP : "MOB",
        PAGE : "kar_01",
        ELEMENT : "",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Eşleştirme",
            CAPTION : "Şipariş satır göstergesi"
        }
    },
    //
    {
        TYPE : 1,
        ID :"GetOldDispatch",
        VALUE : true,
        SPECIAL : "",
        PAGE : "kar_01",
        ELEMENT : "",
        APP : "MOB",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Şipariş eşleştirme",
            CAPTION : "Daha önce irsaliye oluşmuşsa getir",
        }
    },
    //#endregion
]
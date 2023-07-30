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
]
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
]
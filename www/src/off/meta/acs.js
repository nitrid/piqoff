export const acs =
[
    //#region Stok Tanıtım
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Referans",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtRefVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtRefEditable"}
                ]
            }
        }
    },
    //cmbItemGrp
    {
        TYPE : 2,
        ID :"cmbItemGrp",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbItemGrp",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Urun Grubu",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbItemGrpVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbItemGrpEditable"}
                ]
            }
        }
    },
    //txtCustomer
    {
        TYPE : 2,
        ID :"txtCustomer",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCustomer",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tedarikçi",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtCustomerVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtCustomerEditable"}
                ]
            }
        }
    },
    //cmbItemGenus
    {
        TYPE : 2,
        ID :"cmbUrunCins",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbUrunCins",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Urun Cinsi",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbUrunCinsVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbUrunCinsEditable"}
                ]
            }
        }
    },
    //txtBarcode
    {
        TYPE : 2,
        ID :"txtBarcode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtBarcode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Barkod",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtBarcodeVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtBarcodeEditable"}
                ]
            }
        }
    },
    //cmbTax
    {
        TYPE : 2,
        ID :"cmbTax",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbTax",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Vergi",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbTaxVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbTaxEditable"}
                ]
            }
        }
    },
    //cmbMainUnit
    {
        TYPE : 2,
        ID :"cmbMainUnit",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbMainUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbMainUnitVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbMainUnitEditable"}
                ]
            }
        }
    },
    //txtMainUnit
    {
        TYPE : 2,
        ID :"txtMainUnit",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMainUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Carpan",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtMainUnitVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtMainUnitEditable"}
                ]
            }
        }
    },
    //cmbOrigin
    {
        TYPE : 2,
        ID :"cmbOrigin",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbOrigin",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Menşei",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbOriginVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbOriginEditable"}
                ]
            }
        }
    },
    //cmbUnderUnit
    {
        TYPE : 2,
        ID :"cmbUnderUnit",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbUnderUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbUnderUnitVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbUnderUnitEditable"}
                ]
            }
        }
    },
    //txtUnderUnit
    {
        TYPE : 2,
        ID :"txtUnderUnit",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtUnderUnit",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Carpan",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtUnderUnitVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtUnderUnitEditable"}
                ]
            }
        }
    },
    //txtItemName
    {
        TYPE : 2,
        ID :"txtItemName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtItemName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Urun Adı",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtItemNameVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtItemNameEditable"}
                ]
            }
        }
    },
    //txtShortName
    {
        TYPE : 2,
        ID :"txtShortName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtShortName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kısa Adı",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtShortNameVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtShortNameEditable"}
                ]
            }
        }
    },
    //chkActive
    {
        TYPE : 2,
        ID :"chkActive",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkActive",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Aktif",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopChkActiveVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopChkActiveEditable"}
                ]
            }
        }
    },
    //chkCaseWeighed
    {
        TYPE : 2,
        ID :"chkCaseWeighed",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkCaseWeighed",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Kasada Tartılsın",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopChkCaseWeighedVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopChkCaseWeighedEditable"}
                ]
            }
        }
    },
    //chkLineMerged
    {
        TYPE : 2,
        ID :"chkLineMerged",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkLineMerged",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Satır Birleştir",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopChkLineMergedVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopChkLineMergedEditable"}
                ]
            }
        }
    },
    //chkTicketRest
    {
        TYPE : 2,
        ID :"chkTicketRest",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkTicketRest",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopChkTicketRestVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopChkTicketRestEditable"}
                ]
            }
        }
    },
    //txtCostPrice
    {
        TYPE : 2,
        ID :"txtCostPrice",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCostPrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Maliyet Fiyatı"
        }
    },
    //txtMinSalePrice
    {
        TYPE : 2,
        ID :"txtMinSalePrice",
        VALUE : {visible:true,editable:false},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMinSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Min. Satış Fiyatı"
        }
    },
    //txtMaxSalePrice
    {
        TYPE : 2,
        ID :"txtMaxSalePrice",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMaxSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Max. Satış Fiyatı"
        }
    },
    //txtLastBuyPrice
    {
        TYPE : 2,
        ID :"txtLastBuyPrice",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastBuyPrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Alış Fiyatı"
        }
    },
    //txtLastSalePrice
    {
        TYPE : 2,
        ID :"txtLastSalePrice",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastSalePrice",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Satış Fiyatı"
        }
    },
    //#endregion
    //#region Cari Tanıtım
    //cmbType
    {
        TYPE : 2,
        ID :"cmbType",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbType",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Tip",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbTypeVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbTypeEditable"}
                ]
            }
        }
    },
    //cmbGenus
    {
        TYPE : 2,
        ID :"cmbGenus",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "cmbGenus",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Cinsi"
        }
    },
    //txtCode
    {
        TYPE : 2,
        ID :"txtCode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Kodu"
        }
    },
     //txtCustomerName
     {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Adı"
        }
    },
    //txtCustomerLastname
    {
        TYPE : 2,
        ID :"txtCustomerLastname",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtCustomerLastname",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Soyadı"
        }
    },
    //txtPhone1
    {
        TYPE : 2,
        ID :"txtPhone1",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtPhone1",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Telefon 1"
        }
    },
    //txtPhone2
    {
        TYPE : 2,
        ID :"txtPhone2",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtPhone2",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Telefon 2"
        }
    },
    //txtGsmPhone
    {
        TYPE : 2,
        ID :"txtGsmPhone",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtGsmPhone",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Gsm Tel"
        }
    },
    //txtOtherPhone
    {
        TYPE : 2,
        ID :"txtOtherPhone",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtOtherPhone",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Diğer Tel"
        }
    },
    //txtEmail
    {
        TYPE : 2,
        ID :"txtEmail",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtEmail",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "E-Mail"
        }
    },
    //txtWeb
    {
        TYPE : 2,
        ID :"txtWeb",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "cri_01_001",
        ELEMENT : "txtWeb",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Web"
        }
    },
    //#endregion
    //#region Satış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış Farurası",
            CAPTION : "Seri"
        }
    },
     //txtRefno
     {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış Farurası",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış Farurası",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış Farurası",
            CAPTION : "Cari Kodu"
        }
    },
    //txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış Farurası",
            CAPTION : "Cari Adı"
        }
    },
    //#endregion
    //#region Alış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış Farurası",
            CAPTION : "Seri"
        }
    },
     //txtRefno
     {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış Farurası",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış Farurası",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış Farurası",
            CAPTION : "Cari Kodu"
        }
    },
    //txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış Farurası",
            CAPTION : "Cari Adı"
        }
    },
    //#endregion
    //#region Satış İrsaliyesi
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış İrsaliyesi",
            CAPTION : "Seri"
        }
    },
     //txtRefno
     {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış İrsaliyesi",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış İrsaliyesi",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış İrsaliyesi",
            CAPTION : "Cari Kodu"
        }
    },
    //txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_002",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Satış İrsaliyesi",
            CAPTION : "Cari Adı"
        }
    },
    //#endregion
    //#region Alış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış İrsaliyesi",
            CAPTION : "Seri"
        }
    },
     //txtRefno
     {
        TYPE : 2,
        ID :"txtRefno",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış İrsaliyesi",
            CAPTION : "Sıra"
        }
    },
    //cmbDepot
    {
        TYPE : 2,
        ID :"cmbDepot",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış İrsaliyesi",
            CAPTION : "Depo"
        }
    },
    //txtCustomerCode
    {
        TYPE : 2,
        ID :"txtCustomerCode",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış İrsaliyesi",
            CAPTION : "Cari Kodu"
        }
    },
    //txtCustomerName
    {
        TYPE : 2,
        ID :"txtCustomerName",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Alış İrsaliyesi",
            CAPTION : "Cari Adı"
        }
    },
]
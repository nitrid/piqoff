export const acs =
[
    //#region Stok Tanıtım
    //txtRefLy
    {
        TYPE : 2,
        ID :"txtRefLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtRefLy",
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
    //cmbItemGrpLy
    {
        TYPE : 2,
        ID :"cmbItemGrpLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbItemGrpLy",
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
    //txtCustomerLy
    {
        TYPE : 2,
        ID :"txtCustomerLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:1}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCustomerLy",
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
    //cmbItemGenusLy
    {
        TYPE : 2,
        ID :"cmbItemGenusLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:1}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbItemGenusLy",
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
    //txtBarcodeLy
    {
        TYPE : 2,
        ID :"txtBarcodeLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:2}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtBarcodeLy",
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
    //cmbTaxLy
    {
        TYPE : 2,
        ID :"cmbTaxLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:2}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbTaxLy",
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
    //cmbMainUnitLy
    {
        TYPE : 2,
        ID :"cmbMainUnitLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:3}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbMainUnitLy",
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
    //txtMainUnitLy
    {
        TYPE : 2,
        ID :"txtMainUnitLy",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMainUnitLy",
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
    //cmbOriginLy
    {
        TYPE : 2,
        ID :"cmbOriginLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:3}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbOriginLy",
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
    //cmbUnderUnitLy
    {
        TYPE : 2,
        ID :"cmbUnderUnitLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:4}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "cmbUnderUnitLy",
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
    //txtUnderUnitLy
    {
        TYPE : 2,
        ID :"txtUnderUnitLy",
        VALUE : {visible:true,editable:true},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtUnderUnitLy",
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
    //txtTaxSugarLy
    {
        TYPE : 2,
        ID :"txtTaxSugarLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:4}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtTaxSugarLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Şeker Vergisi",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbSugarVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbSugarEditable"}
                ]
            }
        }
    },
    //txtItemNameLy
    {
        TYPE : 2,
        ID :"txtItemNameLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:5}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtItemNameLy",
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
    //txtItemNameLy
    {
        TYPE : 2,
        ID :"txtShortNameLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:5}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtShortNameLy",
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
    //chkActiveLy
    {
        TYPE : 2,
        ID :"chkActiveLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkActiveLy",
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
    //chkCaseWeighedLy
    {
        TYPE : 2,
        ID :"chkCaseWeighedLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkCaseWeighedLy",
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
    //chkLineMergedLy
    {
        TYPE : 2,
        ID :"chkLineMergedLy",
        VALUE : {visible:true,editable:true,position:{x:2,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkLineMergedLy",
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
    //chkTicketRestLy
    {
        TYPE : 2,
        ID :"chkTicketRestLy",
        VALUE : {visible:true,editable:true,position:{x:3,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkTicketRestLy",
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
    //chkInterfelLy
    {
        TYPE : 2,
        ID :"chkInterfelLy",
        VALUE : {visible:true,editable:true,position:{x:4,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "chkInterfelLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Interfel",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopChkInterfelVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopChkInterfelEditable"}
                ]
            }
        }
    },
    //txtCostPriceLy
    {
        TYPE : 2,
        ID :"txtCostPriceLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtCostPriceLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Maliyet Fiyatı"
        }
    },
    //txtTotalExtraCostLy
    {
        TYPE : 2,
        ID :"txtTotalExtraCostLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtTotalExtraCostLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ek Maliyetler"
        }
    },
    //txtMinSalePriceLy
    {
        TYPE : 2,
        ID :"txtMinSalePriceLy",
        VALUE : {visible:true,editable:true,position:{x:2,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMinSalePriceLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Min. Satış Fiyatı"
        }
    },
    //txtMaxSalePriceLy
    {
        TYPE : 2,
        ID :"txtMaxSalePriceLy",
        VALUE : {visible:true,editable:true,position:{x:3,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtMaxSalePriceLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Max. Satış Fiyatı"
        }
    },
    //txtLastBuyPriceLy
    {
        TYPE : 2,
        ID :"txtLastBuyPriceLy",
        VALUE : {visible:true,editable:true,position:{x:4,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastBuyPriceLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Alış Fiyatı"
        }
    },
    //txtLastSalePriceLy
    {
        TYPE : 2,
        ID :"txtLastSalePriceLy",
        VALUE : {visible:true,editable:true,position:{x:5,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "txtLastSalePriceLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Satış Fiyatı"
        }
    },
    //tabPanel
    {
        TYPE : 2,
        ID :"tabPanel",
        VALUE : 
        {
            tbPrice : true,
            tbUnit : true,
            tbBarcode : true,
            tbCustomer : true,
            tbCustomPrice : true,
            tbSalePriceHistory : true,
            tbSaleContract : true,
            tbExtraCost : true,
            tbDetail : true,
            tbInfo : true,
            tbOtherShop : true
        },
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "tabPanel",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Son Satış Fiyatı"
        }
    },
    //sellPriceAddLy
    {
        TYPE : 2,
        ID :"sellPriceAddLy",
        VALUE : {visible:true,editable:true,position:{x:10,y:0,h:1,w:2,minW:2,maxW:2}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "sellPriceAddLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "boolean",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Satış Fiyatı"
        }
    },
    //grdPriceLy
    {
        TYPE : 2,
        ID :"grdPriceLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "grdPriceLy",
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
    //#region Alış İrsaliyesi
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
    //#endregion
    //#region Ürün Recete Tanımları
    //txtItemCodeLy
    {
        TYPE : 2,
        ID :"txtItemCodeLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "txtItemCodeLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Ürün Kodu",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtItemCodeVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtItemCodeEditable"}
                ]
            }
        }
    },
    //txtItemNameLy
    {
        TYPE : 2,
        ID :"txtItemNameLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:0}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "txtItemNameLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Ürün Adı",
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
    //dtDateLy
    {
        TYPE : 2,
        ID :"dtDateLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:1}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "dtDateLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Tarih",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopDtDateVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopDtDateEditable"}
                ]
            }
        }
    },
    //txtQuantityLy
    {
        TYPE : 2,
        ID :"txtQuantityLy",
        VALUE : {visible:true,editable:true,position:{x:1,y:1}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "txtQuantityLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Miktar",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopTxtQuantityVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopTxtQuantityEditable"}
                ]
            }
        }
    },
    //grdListLy
    {
        TYPE : 2,
        ID :"grdListLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:3,h:13,w:2}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "grdListLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Liste",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //ButtonBarLy
    {
        TYPE : 2,
        ID :"ButtonBarLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:2,h:1,w:2}},
        SPECIAL : "",
        PAGE : "stk_01_016",
        ELEMENT : "ButtonBarLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Recete Tanımları",
            CAPTION : "Button Bar",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //#endregion
    //#region Ürün Giriş Çıkış Operasyonu
    //txtRefLy
    {
        TYPE : 2,
        ID :"txtRefLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0,h:1,w:2}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "txtRefLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
            CAPTION : "Ref",
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
    //cmbDepotLy
    {
        TYPE : 2,
        ID :"cmbDepotLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:1,h:1,w:2}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "cmbDepotLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
            CAPTION : "Depo",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopCmbDepotVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopCmbDepotEditable"}
                ]
            }
        }
    },
    //dtDocDateLy
    {
        TYPE : 2,
        ID :"dtDocDateLy",
        VALUE : {visible:true,editable:true,position:{x:2,y:0,h:1,w:2}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "dtDocDateLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
            CAPTION : "Tarih",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopDtDocDateVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopDtDocDateEditable"}
                ]
            }
        }
    },
    //txtBarcodeLy
    {
        TYPE : 2,
        ID :"txtBarcodeLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:2,h:1,w:2}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "txtBarcodeLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
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
    //ButtonBarLy
    {
        TYPE : 2,
        ID :"ButtonBarLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:3,h:1,w:4}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "ButtonBarLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
            CAPTION : "Buton Bar",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopButtonBarVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopButtonBarEditable"}
                ]
            }
        }
    },
    //grdListLy
    {
        TYPE : 2,
        ID :"grdListLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:4,h:10,w:4}},
        SPECIAL : "",
        PAGE : "stk_04_005",
        ELEMENT : "grdListLy",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Ürün Giriş Çıkış Operasyonu",
            CAPTION : "Grid List",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"checkbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"checkbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //#endregion
    //grdSlsInv
    {
        TYPE : 2,
        ID :"grdSlsInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_002",
        ELEMENT : "grdSlsInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdContractsState
    {
        TYPE : 2,
        ID :"grdContractsState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "cnt_04_001",
        ELEMENT : "grdContractsState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdListesState
    {
        TYPE : 2,
        ID :"grdListesState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "cnt_04_001",
        ELEMENT : "grdListesState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsDispatchState
    {
        TYPE : 2,
        ID :"grdSlsDispatchState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "irs_02_006",
        ELEMENT : "grdSlsDispatchState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsDispatchState
    {
        TYPE : 2,
        ID :"grdSlsDispatchState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "irs_02_004",
        ELEMENT : "grdSlsDispatchState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdPurcDispatchState
    {
        TYPE : 2,
        ID :"grdPurcDispatchState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "irs_02_001",
        ELEMENT : "grdPurcDispatchState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdRebtDispatchState
    {
        TYPE : 2,
        ID :"grdRebtDispatchState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "irs_02_003",
        ELEMENT : "grdRebtDispatchState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsInvState
    {
        TYPE : 2,
        ID :"grdSlsInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_008",
        ELEMENT : "grdSlsInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdRebtDispatchState
    {
        TYPE : 2,
        ID :"grdRebtDispatchState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "irs_02_005",
        ELEMENT : "grdRebtDispatchState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsInvState
    {
        TYPE : 2,
        ID :"grdSlsInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_005",
        ELEMENT : "grdSlsInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdRebtInvState
    {
        TYPE : 2,
        ID :"grdRebtInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_009",
        ELEMENT : "grdRebtInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdDiffInvState
    {
        TYPE : 2,
        ID :"grdDiffInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_004",
        ELEMENT : "grdDiffInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdDiffInvState
    {
        TYPE : 2,
        ID :"grdDiffInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_006",
        ELEMENT : "grdDiffInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdPurcInvState
    {
        TYPE : 2,
        ID :"grdPurcInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "grdPurcInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdRebtInvState
    {
        TYPE : 2,
        ID :"grdRebtInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_003",
        ELEMENT : "grdRebtInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdRebtInvState
    {
        TYPE : 2,
        ID :"grdRebtInvState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "ftr_02_007",
        ELEMENT : "grdRebtInvState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdDiffOffState
    {
        TYPE : 2,
        ID :"grdDiffOffState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "tkf_02_003",
        ELEMENT : "grdDiffOffState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsOrderState
    {
        TYPE : 2,
        ID :"grdSlsOrderState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "sip_02_003",
        ELEMENT : "grdSlsOrderState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdPurcOrdersState
    {
        TYPE : 2,
        ID :"grdPurcOrdersState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "sip_02_001",
        ELEMENT : "grdPurcOrdersState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
    //grdSlsOrderState
    {
        TYPE : 2,
        ID :"grdSlsOrderState",
        VALUE : {},
        SPECIAL : "",
        PAGE : "sip_02_002",
        ELEMENT : "grdSlsOrderState",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "",
            CAPTION : "",
            DISPLAY : "visible",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"textbox",caption:"Visible",field:"visible",id:"chkPopGrdListVisible"},
                    {type:"textbox",caption:"Editable",field:"editable",id:"chkPopGrdListEditable"}
                ]
            }
        }
    },
]
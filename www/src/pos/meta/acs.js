export const acs =
[
    //TYPE = 0 => SISTEM TYPE = 1 => EVRAK TYPE = 2 => ELEMENT
    //#region Pos
    //btnDeviceEntry
    {
        TYPE : 2,
        ID :"btnDeviceEntry",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDeviceEntry",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Cihaz Giriş",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnDeviceEntryDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnDeviceEntryType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnReturnEntry
    {
        TYPE : 2,
        ID :"btnReturnEntry",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnReturnEntry",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "İade Giriş",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnReturnEntryDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnReturnEntryType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnFullDelete
    {
        TYPE : 2,
        ID :"btnFullDelete",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnFullDelete",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Evrak Silme",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnFullDeleteDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnFullDeleteType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnPluEdit
    {
        TYPE : 2,
        ID :"btnPluEdit",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPluEdit",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "PLU Düzenle",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnPluEditDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnPluEditType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnSafeOpen
    {
        TYPE : 2,
        ID :"btnSafeOpen",
        VALUE : {dialog:{type:1}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSafeOpen",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Kasa Aç",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnSafeOpenDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnSafeOpenType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnPopParkListAll
    {
        TYPE : 2,
        ID :"btnPopParkListAll",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPopParkListAll",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Parktaki Tüm Liste",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnPopParkListAllDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnPopParkListAllType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnDiscount
    {
        TYPE : 2,
        ID :"btnDiscount",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDiscount",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "İskonto Giriş Butonu",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnDiscountDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnDiscountType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //PriceEdit
    {
        TYPE : 1,
        ID :"PriceEdit",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Düzenle",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popPriceEditDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popPriceEditType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnPCForceAcs
    {
        TYPE : 2,
        ID :"btnPCForceAcs",
        VALUE : {dialog:{type:-1}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPCForceAcs",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Ödeme Zorla Yetkisi",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnPCForceAcsDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnPCForceAcsType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnPCCancelAcs
    {
        TYPE : 2,
        ID :"btnPCCancelAcs",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPCCancelAcs",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Ödeme İptal Yetkisi",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popPCCancelAcsDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popPCCancelAcsType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //btnSystem
    {
        TYPE : 2,
        ID :"btnSystem",
        VALUE : {dialog:{type:0}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSystem",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Sistem",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Dialog",field:"dialog",id:"popBtnSystemDialog",display:"type",
                        form : 
                        {
                            width:"400",
                            height:"180",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"type",id:"popBtnSystemType"},
                            ]
                        }
                    },
                ]
            }
        }
    },
    //txtBarcodeLy
    {
        TYPE : 2,
        ID :"txtBarcodeLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:0,h:10,w:35,minH:10,maxH:10,minW:15,maxW:35}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "txtBarcodeLy",
        APP : "POS"
    },
    //grdListLy
    {
        TYPE : 2,
        ID :"grdListLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:10,h:70,w:35,minH:2,maxH:140,minW:20,maxW:35}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "grdListLy",
        APP : "POS"
    },
    //grandTotalLy
    {
        TYPE : 2,
        ID :"grandTotalLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:80,h:15,w:35,minH:15,maxH:30,minW:35,maxW:35}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "grandTotalLy",
        APP : "POS"
    },
    //lblTotalLy
    {
        TYPE : 2,
        ID :"lblTotalLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:95,h:10,w:35,minH:10,maxH:30,minW:5,maxW:35}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "lblTotalLy",
        APP : "POS"
    },
    //btnTotalLy
    {
        TYPE : 2,
        ID :"btnTotalLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnTotalLy",
        APP : "POS"
    },
    //btnCreditCardLy
    {
        TYPE : 2,
        ID :"btnCreditCardLy",
        VALUE : {visible:true,editable:true,position:{x:5,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCreditCardLy",
        APP : "POS"
    },
    //btnKey7Ly
    {
        TYPE : 2,
        ID :"btnKey7Ly",
        VALUE : {visible:true,editable:true,position:{x:10,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey7Ly",
        APP : "POS"
    },
    //btnKey8Ly
    {
        TYPE : 2,
        ID :"btnKey8Ly",
        VALUE : {visible:true,editable:true,position:{x:15,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey8Ly",
        APP : "POS"
    },
    //btnKey9Ly
    {
        TYPE : 2,
        ID :"btnKey9Ly",
        VALUE : {visible:true,editable:true,position:{x:20,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey9Ly",
        APP : "POS"
    },
    //btnCheckLy
    {
        TYPE : 2,
        ID :"btnCheckLy",
        VALUE : {visible:true,editable:true,position:{x:25,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCheckLy",
        APP : "POS"
    },
    //btnSafeOpenLy
    {
        TYPE : 2,
        ID :"btnSafeOpenLy",
        VALUE : {visible:true,editable:true,position:{x:5,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSafeOpenLy",
        APP : "POS"
    },
    //btnCashLy
    {
        TYPE : 2,
        ID :"btnCashLy",
        VALUE : {visible:true,editable:true,position:{x:5,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCashLy",
        APP : "POS"
    },
    //btnExchangeLy
    {
        TYPE : 2,
        ID :"btnExchangeLy",
        VALUE : {visible:false,editable:true,position:{x:55,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnExchangeLy",
        APP : "POS"
    },
    //btnCardTicketLy
    {
        TYPE : 2,
        ID :"btnCardTicketLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCardTicketLy",
        APP : "POS"
    },
    //btnKey4Ly
    {
        TYPE : 2,
        ID :"btnKey4Ly",
        VALUE : {visible:true,editable:true,position:{x:10,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey4Ly",
        APP : "POS"
    },
    //btnKey5Ly
    {
        TYPE : 2,
        ID :"btnKey5Ly",
        VALUE : {visible:true,editable:true,position:{x:15,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey5Ly",
        APP : "POS"
    },
    //btnKey6Ly
    {
        TYPE : 2,
        ID :"btnKey6Ly",
        VALUE : {visible:true,editable:true,position:{x:20,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey6Ly",
        APP : "POS"
    },
    //btnKeyBsLy
    {
        TYPE : 2,
        ID :"btnKeyBsLy",
        VALUE : {visible:true,editable:true,position:{x:25,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKeyBsLy",
        APP : "POS"
    },
    //btnDiscountLy
    {
        TYPE : 2,
        ID :"btnDiscountLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDiscountLy",
        APP : "POS"
    },
    //btnCheqpayLy
    {
        TYPE : 2,
        ID :"btnCheqpayLy",
        VALUE : {visible:true,editable:true,position:{x:5,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCheqpayLy",
        APP : "POS"
    },
    //btnKey1Ly
    {
        TYPE : 2,
        ID :"btnKey1Ly",
        VALUE : {visible:true,editable:true,position:{x:10,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey1Ly",
        APP : "POS"
    },
    //btnKey2Ly
    {
        TYPE : 2,
        ID :"btnKey2Ly",
        VALUE : {visible:true,editable:true,position:{x:15,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey2Ly",
        APP : "POS"
    },
    //btnKey3Ly
    {
        TYPE : 2,
        ID :"btnKey3Ly",
        VALUE : {visible:true,editable:true,position:{x:20,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey3Ly",
        APP : "POS"
    },
    //btnKeyXLy
    {
        TYPE : 2,
        ID :"btnKeyXLy",
        VALUE : {visible:true,editable:true,position:{x:25,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKeyXLy",
        APP : "POS"
    },
    //btnCustomerPointLy
    {
        TYPE : 2,
        ID :"btnCustomerPointLy",
        VALUE : {visible:true,editable:true,position:{x:0,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCustomerPointLy",
        APP : "POS"
    },
    //btnInfoLy
    {
        TYPE : 2,
        ID :"btnInfoLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnInfoLy",
        APP : "POS"
    },
    //btnKeyDotLy
    {
        TYPE : 2,
        ID :"btnKeyDotLy",
        VALUE : {visible:true,editable:true,position:{x:10,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKeyDotLy",
        APP : "POS"
    },
    //btnKey0Ly
    {
        TYPE : 2,
        ID :"btnKey0Ly",
        VALUE : {visible:true,editable:true,position:{x:15,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnKey0Ly",
        APP : "POS"
    },
    //btnNegative1Ly
    {
        TYPE : 2,
        ID :"btnNegative1Ly",
        VALUE : {visible:true,editable:true,position:{x:20,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnNegative1Ly",
        APP : "POS"
    },
    //btnPlus1Ly
    {
        TYPE : 2,
        ID :"btnPlus1Ly",
        VALUE : {visible:true,editable:true,position:{x:25,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPlus1Ly",
        APP : "POS"
    },
    //lblAboutLy
    {
        TYPE : 2,
        ID :"lblAboutLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:0,h:10,w:35,minH:10,maxH:10,minW:35,maxW:35}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "lblAboutLy",
        APP : "POS"
    },
    //btnUpLy
    {
        TYPE : 2,
        ID :"btnUpLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:10,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnUpLy",
        APP : "POS"
    },
    //btnDownLy
    {
        TYPE : 2,
        ID :"btnDownLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:26,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDownLy",
        APP : "POS"
    },
    //btnDeleteLy
    {
        TYPE : 2,
        ID :"btnDeleteLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:42,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnDeleteLy",
        APP : "POS"
    },
    //btnLineDeleteLy
    {
        TYPE : 2,
        ID :"btnLineDeleteLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:58,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnLineDeleteLy",
        APP : "POS"
    },
    //btnItemReturnLy
    {
        TYPE : 2,
        ID :"btnItemReturnLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:74,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnItemReturnLy",
        APP : "POS"
    },
    //pluBtnGrpLy
    {
        TYPE : 2,
        ID :"pluBtnGrpLy",
        VALUE : {visible:true,editable:true,position:{x:40,y:10,h:80,w:30,minH:80,maxH:80,minW:30,maxW:30}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "pluBtnGrpLy",
        APP : "POS"
    },
    //btnPriceDiffLy
    {
        TYPE : 2,
        ID :"btnPriceDiffLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:90,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPriceDiffLy",
        APP : "POS"
    },
    //btnItemSearchLy
    {
        TYPE : 2,
        ID :"btnItemSearchLy",
        VALUE : {visible:true,editable:true,position:{x:40,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnItemSearchLy",
        APP : "POS"
    },
    //btnZReportLy
    {
        TYPE : 2,
        ID :"btnZReportLy",
        VALUE : {visible:true,editable:true,position:{x:50,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnZReportLy",
        APP : "POS"
    },
    //btnGrdListLy
    {
        TYPE : 2,
        ID :"btnGrdListLy",
        VALUE : {visible:true,editable:true,position:{x:50,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnGrdListLy",
        APP : "POS"
    },
    //btnFormationLy
    {
        TYPE : 2,
        ID :"btnFormationLy",
        VALUE : {visible:true,editable:true,position:{x:55,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnFormationLy",
        APP : "POS"
    },
    //btnOrderListLy
    {
        TYPE : 2,
        ID :"btnOrderListLy",
        VALUE : {visible:true,editable:true,position:{x:60,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnOrderListLy",
        APP : "POS"
    },
    //btnAdvanceLy
    {
        TYPE : 2,
        ID :"btnAdvanceLy",
        VALUE : {visible:true,editable:true,position:{x:45,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnAdvanceLy",
        APP : "POS"
    },
    //btnParkListLy
    {
        TYPE : 2,
        ID :"btnParkListLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnParkListLy",
        APP : "POS"
    },
    //btnSubtotalLy
    {
        TYPE : 2,
        ID :"btnSubtotalLy",
        VALUE : {visible:true,editable:true,position:{x:30,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSubtotalLy",
        APP : "POS"
    },
    //btnCustomerAddLy
    {
        TYPE : 2,
        ID :"btnCustomerAddLy",
        VALUE : {visible:true,editable:true,position:{x:45,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCustomerAddLy",
        APP : "POS"
    },
    //btnCustomerListLy
    {
        TYPE : 2,
        ID :"btnCustomerListLy",
        VALUE : {visible:true,editable:true,position:{x:40,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCustomerListLy",
        APP : "POS"
    },
    //btnGetCustomerLy
    {
        TYPE : 2,
        ID :"btnGetCustomerLy",
        VALUE : {visible:true,editable:true,position:{x:30,y:106,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnGetCustomerLy",
        APP : "POS"
    },
    //btnCalculatorLy
    {
        TYPE : 2,
        ID :"btnCalculatorLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnCalculatorLy",
        APP : "POS"
    },
    //btnOfflineLy
    {
        TYPE : 2,
        ID :"btnOfflineLy",
        VALUE : {visible:true,editable:true,position:{x:65,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnOfflineLy",
        APP : "POS"
    },
    //btnParkLy
    {
        TYPE : 2,
        ID :"btnParkLy",
        VALUE : {visible:true,editable:true,position:{x:35,y:122,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnParkLy",
        APP : "POS"
    },
    //btnPrintLy
    {
        TYPE : 2,
        ID :"btnPrintLy",
        VALUE : {visible:true,editable:true,position:{x:30,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnPrintLy",
        APP : "POS"
    },
    //btnLastPrintLy
    {
        TYPE : 2,
        ID :"btnLastPrintLy",
        VALUE : {visible:true,editable:true,position:{x:30,y:154,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnLastPrintLy",
        APP : "POS"
    },
    //btnSystemLy
    {
        TYPE : 2,
        ID :"btnSystemLy",
        VALUE : {visible:true,editable:true,position:{x:65,y:138,h:16,w:5,minH:16,maxH:32,minW:3,maxW:10}},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "btnSystemLy",
        APP : "POS"
    },
    //#endregion
]
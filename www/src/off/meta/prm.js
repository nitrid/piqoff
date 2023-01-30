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
            CAPTION : "Seri  İçin Cari Kodu Kullan"
        }
    },
    //Seri Numarası Rastgele Oluştursun
    {
        TYPE : 0,
        ID :"randomRefNo",
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
            CAPTION : "Seri Numarası Rastgele Oluştursun"
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
    // Ödeme ve tahsilat için fatura zorunluluğu
    {
        TYPE : 0,
        ID :"invoicesForPayment",
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
            CAPTION : "Ödeme İşlemleir İçin Fatura Seçme Zorunluluğu"
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
            TYPE : "popInput",
            PAGE_NAME : "Sistem",
            CAPTION : "Para Sembolü",
            DISPLAY : "code",
            FORM: 
            {
                width:"400",
                height:"180",
                item:
                [
                    {type:"text",caption:"Code",field:"code",id:"txtPopMoneySymbolCode"},
                    {type:"text",caption:"Sign",field:"sign",id:"txtPopMoneySymbolSign"}
                ]
            }
        }
    },
    //Daha Düşük Fiyatlı Tedarikçi Uyarısı
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
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Daha Düşük Fiyatlı Tedarikçi Uyarısı"
        }
    },
    //Faturadaki Hizmetten maliyet ekle
    {
        TYPE : 0,
        ID :"costForInvoıces",
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
            CAPTION : "Faturadaki Hizmetten Maliyet Ekle"
        }
    },
    // underMinCostPrice
    {
        TYPE : 0,
        ID :"underMinCostPrice",
        VALUE : false,
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Sistem",
            CAPTION : "Maliyetten Düşük Fiyata Satış Yapabilir"
        }
    },
    // maxRoundAmount
    {
        TYPE : 0,
        ID :"maxRoundAmount",
        VALUE : 0.05,
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "En fazla uygulanabilcek yuvarlama tutarı"
        }
    },
    // maxUnitQuantity
    {
        TYPE : 0,
        ID :"maxUnitQuantity",
        VALUE : 100000,
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "En fazla izin verilen miktar"
        }
    },
    // maxItemPrice
    {
        TYPE : 0,
        ID :"maxItemPrice",
        VALUE : 100,
        SPECIAL : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Sistem",
            CAPTION : "En fazla izin verilen birim fiyatı."
        }
    },
    //Zorunlu Evrak Silme Açıklaması
    {
        TYPE : 0,
        ID :"docDeleteDesc",
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
            CAPTION : "Zorunlu Evrak Silme Açıklaması"
        }
    },
    //Evrak Sil Açıklama
    {
        TYPE : 0,
        ID :"DocDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Course annulé.",
                    text:"Le client ne veux plus son produit."
                },
                {
                    id:"btn02",
                    title:"Montant insuffisant!",
                    text:"Le client n'a pas le montant requis pour payer ses produits."
                },
                {
                    id:"btn03",
                    title:"Refus CB.",
                    text:"Paiement Refusée de la banque CB du client."
                },
                {
                    id:"btn04",
                    title:"La responsable teste.",
                    text:"La responsable teste des produits."
                },
                {
                    id:"btn05",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn06",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn07",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn08",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn09",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn10",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn11",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn12",
                    title:"TEST.",
                    text:"Produit scanné suite à test pour une mise à jour."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Sistem",
            CAPTION : "Evrak Sil Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopDocDelDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopDocDelDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopDocDelDescriptionDesc",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Referans",
            FORM: 
            {
                width:"400",
                height:"180",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtRefValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtRefGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtRefVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grup",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopCmbItemGrpValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopCmbItemGrpValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopCmbItemGrpGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopCmbItemGrpVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tedarikçi",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtCustomerValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCustomerValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCustomerGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCustomerVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ana Birim Çarpan",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtMainUnitValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtMainUnitValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtMainUnitGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtMainUnitVal",
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
                        min : 0.001
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Alt Birim Çarpan",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtUnderUnitValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtUnderUnitValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtUnderUnitGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtUnderUnitVal",
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
            TYPE : "checkbox",
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
            TYPE : "checkbox",
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
            TYPE : "checkbox",
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
            TYPE : "checkbox",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ticket Rest.",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtCostPriceValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCostPriceValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCostPriceGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCostPriceVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Min. Satış Fiyatı",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtMinSalePriceValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtMinSalePriceValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtMinSalePriceGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtMinSalePriceVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Max. Satış Fiyatı",
            DISPLAY : "value",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"text",caption:"Value",field:"value",id:"txtPopTxtMaxSalePriceValue"},
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtMaxSalePriceValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtMaxSalePriceGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtMaxSalePriceVal",
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
        VALUE : ['882CE752-8DE1-4574-8243-B74C8CE32B87','75DF8E2B-D3D2-439A-A751-A2BA2D2A962A'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popTextList",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Menşei Validation",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
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
            TYPE : "popTextList",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Min Max Yetki",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
        }
    },
    //Urun Grubuna Fiyatsız Girebilme
    {
        TYPE : 1,
        ID :"ItemGrpForNotPriceSave",
        VALUE : ['209','210','002','033','FFC7456F-D75B-4B54-800A-45C8C882137D'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popTextList",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ürün Grubuna Göre Fiyatsız Kayıt",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
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
            CAPTION : "Ürün Maximum Satış Yüzdesi"
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
            TYPE : "checkbox",
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
            TYPE : "checkbox",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Ted. Fiyatı Yüksek Olamaz Kontrolü"
        }
    },
    //Tax Sugar
    {
        TYPE : 1,
        ID :"taxSugarGroupValidation",
        VALUE : ['DA5704B6-D1A3-490B-BE86-E3FBCAF2EA29','1E4E0371-11E4-4FB3-828D-9D6E408EE0C9','60fe2360-029b-4284-b7fb-6d5dd842ea58'],
        SPECIAL : "",
        PAGE : "stk_01_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popTextList",
            PAGE_NAME : "Stok Tanımları",
            CAPTION : "Tax Sugar Uygulanacak Gruplar",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
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
            TYPE : "popInput",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Kodu",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCodeValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCodeGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCodeVal",
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
    //txtTitle
    {
        TYPE : 2,
        ID :"txtTitle",
        VALUE : "",
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
            TYPE : "popInput",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Adı",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCustomerNameValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCustomerNameGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCustomerNameVal",
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
            TYPE : "popInput",
            PAGE_NAME : "Cari Tanımları",
            CAPTION : "Soyadı",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCustomerLastnameValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCustomerLastnameGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCustomerLastnameVal",
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
    //#region Satış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
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
            TYPE : "text",
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
    //#region Satış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_009",
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
        PAGE : "ftr_02_009",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
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
        PAGE : "ftr_02_009",
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
        PAGE : "ftr_02_009",
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
        PAGE : "ftr_02_009",
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
        PAGE : "ftr_02_009",
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
    //#region Şubeler ArasıSatış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_02_005",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
        PAGE : "ftr_02_005",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
        PAGE : "ftr_02_005",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
        PAGE : "ftr_02_005",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
        PAGE : "ftr_02_005",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
        PAGE : "ftr_02_005",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Şubeler Arası Satış Faturası",
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
            value : ""
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
            TYPE : "text",
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
    // excelFormat
    {
        TYPE : 1,
        ID :"excelFormat",
        VALUE : 
        {
            CODE:'CODE',QTY:'QTY',PRICE:'PRICE',DISC:'DISC',DISC_PER:'DISC_PER',TVA:'TVA'
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Excel Formatı",
            DISPLAY : "CODE",
            FORM: 
            {
                width:"400",
                height:"280",
                item:
                [
                    {type:"text",caption:"CODE",field:"CODE",id:"txtPopExcelFormatCode"},
                    {type:"text",caption:"QTY",field:"QTY",id:"txtPopExcelFormatQty"},
                    {type:"text",caption:"PRICE",field:"PRICE",id:"txtPopExcelFormatPrice"},
                    {type:"text",caption:"DISC",field:"DISC",id:"txtPopExcelFormatDisc"},
                    {type:"text",caption:"DISC_PER",field:"DISC_PER",id:"txtPopExcelFormatDiscPer"},
                    {type:"text",caption:"TVA",field:"TVA",id:"txtPopExcelFormatTva"},
                ]
            }
        }
    },
    // excelFormat
    {
        TYPE : 1,
        ID :"compulsoryCustomer",
        VALUE : 
        {
            value : true
        },
        SPECIAL : "",
        PAGE : "ftr_02_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Alış Faturası",
            CAPTION : "Tedarikçişi olmayan ürünü kaydetme"
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
            TYPE : "popInput",
            PAGE_NAME : "Promosyon Tanımları",
            CAPTION : "Kodu",
            FORM: 
            {
                width:"400",
                height:"200",
                colCount : 1,
                item:
                [
                    {type:"popInput",caption:"Validation",field:"validation",id:"txtPopTxtCodeValidation",display:"grp",
                        form : 
                        {
                            width:"400",
                            height:"230",
                            colCount:1,
                            item:
                            [
                                {type:"text",caption:"Grp",field:"grp",id:"txtPopTxtCodeGrp"},
                                {type:"popObjectList",caption:"Validation",field:"val",id:"lstPopTxtCodeVal",
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
    //#region Proforma  Satış Faturası
    //txtRef
    {
        TYPE : 2,
        ID :"txtRef",
        VALUE : 
        {
            value : ""
        },
        SPECIAL : "",
        PAGE : "ftr_04_002",
        ELEMENT : "txtRef",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Proforma Satış Faturası",
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
        PAGE : "ftr_04_002",
        ELEMENT : "txtRefno",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Proforma Satış Faturası",
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
        PAGE : "ftr_04_002",
        ELEMENT : "cmbDepot",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Proforma Satış Faturası",
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
        PAGE : "ftr_04_002",
        ELEMENT : "txtCustomerCode",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Proforma Satış Faturası",
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
        PAGE : "ftr_04_002",
        ELEMENT : "txtCustomerName",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Proforma Satış Faturası",
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
    PAGE : "ftr_04_002",
    ELEMENT : "",
    APP : "OFF",
    VIEW : 
    {
        TYPE : "checkbox",
        PAGE_NAME : "Proforma Satış Faturası",
        CAPTION : "Eksiye Düşemeye İzin Verme"
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
            TYPE : "combobox",
            PAGE_NAME : "Depo Miktar Listesi",
            CAPTION : "Varsayılan Depo",
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
            TYPE : "combobox",
            PAGE_NAME : "İade Ürün Toplama",
            CAPTION : "Giriş Depo",
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
            TYPE : "combobox",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa",
            DISPLAY : "NAME",
            FIELD : "GUID",
            DATA :
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
                },
            }
        }
    },
    // Kredi Kartı kasa 
    {
        TYPE : 1,
        ID :"BankSafe",
        VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
        SPECIAL : "",
        PAGE : "pos_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos",
            CAPTION : "Kredi Kartı Kasası",
            DISPLAY : "NAME",
            FIELD : "GUID",
            DATA :
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
                },
            }
        }
    },
    // Ticket Restorant Kasası kasa 
    {
        TYPE : 1,
        ID :"TicketRestSafe",
        VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
        SPECIAL : "",
        PAGE : "pos_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Restorant Kasası",
            DISPLAY : "NAME",
            FIELD : "GUID",
            DATA :
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
                },
            }
        }
    },
    // Çek Kasası 
    {
        TYPE : 1,
        ID :"CheckSafe",
        VALUE : "3848A862-D4FF-4BAD-9AB1-C1A29D9BC7F3",
        SPECIAL : "",
        PAGE : "pos_03_001",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos",
            CAPTION : "Çek Kasası",
            DISPLAY : "NAME",
            FIELD : "GUID",
            DATA :
            {
                select:
                {
                    query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 1 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
                },
            }
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
    //#region Şube Satış İrsaliye
    //negativeQuantity
    {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "irs_02_004",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Şube Satış İrsaliye",
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
            TYPE : "combobox",
            PAGE_NAME : "Alış Anlaşması",
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
            TYPE : "combobox",
            PAGE_NAME : "Satış Anlaşması",
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
    //#region Özel Etiket Basımı 
    //
    {
        TYPE : 1,
        ID :"underMinCostPrice",
        VALUE : false,
        SPECIAL : "",
        PAGE : "stk_02_006",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Özel Etiket Basımı",
            CAPTION : "Maliyet Fiyatından Düşük Etikete İzin Verme"
        }
    },
    //#endregion
    //#region Stok Çıkış Fişi
    //negativeQuantity
    {
        TYPE : 1,
        ID :"negativeQuantity",
        VALUE : 
        {
            value : false
        },
        SPECIAL : "",
        PAGE : "stk_02_009",
        ELEMENT : "",
        APP : "OFF",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Şube Satış İrsaliye",
            CAPTION : "Eksiye Düşemeye İzin Verme"
        }
    },
    //#endregion
]
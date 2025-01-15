export const prm = 
[
    //#region Pos
    //Para Sembolu
    {
        TYPE : 0,
        ID :"MoneySymbol",
        VALUE : {code:"EUR",sign:"€"},
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
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
    //BarcodePattern
    {
        TYPE : 0,
        ID :"BarcodePattern",
        VALUE : 
        [
            '20XXXXXMMMCCF',
            '21NNNNNMMMCCF',
            '29NNNNMMMCCF',
            '29NNNNNMMMCCF',
            '020NNNNMMMCCF',
            '27NNNNKKKGGGMMMMCCXXXXXX',
            '26NNNNKKKKKKMMMMCCXXXXXX',
        ],
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popTextList",
            PAGE_NAME : "Pos",
            CAPTION : "Barkod Desenleri",
            FORM: 
            {
                width:"400",
                height:"400",
                textHeight:"260"
            }
        }
    },
    //Ticket Rest. Sadakat Puan Kullanımı
    {
        TYPE : 0,
        ID :"UseTicketRestLoyalty",
        VALUE : 0, //0: Kullanamaz. 1: Kullanılır Puan İşlemez. 2: Kullanılır 
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "combobox",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Rest. Puan Kullanımı",
            DISPLAY : "NAME",
            FIELD : "CODE",
            DATA :[{CODE:0,NAME:"Kullanılmaz"},{CODE:1,NAME:"Kullanılır Puan İşlemez"},{CODE:2,NAME:"Kullanılır"}]
        }
    },
    //Ticket Rest. Kullanım Süresi
    {
        TYPE : 0,
        ID :"UseTicketRest",
        VALUE : 0, //Ticket Geçerlilik Süresi 
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Rest. Süresi"
        }
    },
    //Fiyat Açıklama
    {
        TYPE : 0,
        ID :"PriceDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:5,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Pas identique.",
                    text:"Le prix affiché en rayon et celle du système n'est pas identique."
                },
                {
                    id:"btn02",
                    title:"Accord responsable.",
                    text:"Avec accord du responsable, il y a eu une baisse du prix pour le client."
                },
                {
                    id:"btn03",
                    title:"Erreur Prix boucherie.",
                    text:"L'etiquette de boucherie est fausse."
                },
                {
                    id:"btn04",
                    title:"Prix pour quantité.",
                    text:"Un prix a été fait pour une quantité importante."
                },
                {
                    id:"btn05",
                    title:"Etiquette est illisible",
                    text:"L'etiquette du produit est illisible. Saisir manuellement."
                },
                {
                    id:"btn06",
                    title:"Produit defectueux.",
                    text:"Un prix a été fait car le produit etait defectueux."
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
                    title:"Description vide.",
                    text:"Description non saisie."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopPriceDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopPriceDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopPriceDescriptionDesc",
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
    //İade Açıklama
    {
        TYPE : 0,
        ID :"RebateDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Double du code barre.",
                    text:"Erreur de saisie lecture double du code barre."
                },
                {
                    id:"btn02",
                    title:"Défectueux ou en panne.",
                    text:"Le client a fait un retour, le produit est défectueux ou en panne."
                },
                {
                    id:"btn03",
                    title:"Retour du produit.",
                    text:"Le client fait retour du produit car il ne lui a pas plu."
                },
                {
                    id:"btn04",
                    title:"Erreur d'achat.",
                    text:"Le client s´est trompé sur son achat il souhaite faire un retour."
                },
                {
                    id:"btn05",
                    title:"Scanné 2 fois le produit",
                    text:"La caissière a scanné 2 fois le produit."
                },
                {
                    id:"btn06",
                    title:"Oublié de Supprimer.",
                    text:"La caissière a oublié de supprimer le produit non voulu."
                },
                {
                    id:"btn07",
                    title:"Pas sélectionné le bon produit.",
                    text:"La caissière n’a pas sélectionné le bon produit."
                },
                {
                    id:"btn08",
                    title:"Pas vu l’étiquette jaune.",
                    text:"La caissière n’a pas vu l’étiquette jaune sur le produit."
                },
                {
                    id:"btn09",
                    title:"Erreur d’étiquetage.",
                    text:"Le client a retourné le produit car erreur d’étiquetage."
                },
                {
                    id:"btn10",
                    title:"Trop cher.",
                    text:"Le client a retourné le produit car trop cher."
                },
                {
                    id:"btn11",
                    title:"Mauvaise étiquette jaune.",
                    text:"Mauvaise étiquette jaune sur le produit."
                },
                {
                    id:"btn12",
                    title:"Boucherie s’est trompée.",
                    text:"La boucherie s’est trompée d’étiquette."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "İade Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopRebateDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopRebateDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopRebateDescriptionDesc",
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
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
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
    //Evrak Satır Sil Açıklama
    {
        TYPE : 0,
        ID :"DocRowDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"A cause du prix.",
                    text:"Le client ne veux plus le produit, le prix ne lui convient plus."
                },
                {
                    id:"btn02",
                    title:"Erreur du prix affiché.",
                    text:"Le prix du rayon et celle du systhème n'est pas identique."
                },
                {
                    id:"btn03",
                    title:"Scanné 2 fois.",
                    text:"La caissière a scanné 2 fois le produit."
                },
                {
                    id:"btn04",
                    title:"Erreur Saisie dans la liste.",
                    text:"Caissière a fait une erreur dans la saisie de la liste du produit."
                },
                {
                    id:"btn05",
                    title:"Saisie fruits et légumes.",
                    text:"Caissière a fait une erreur dans la saisie de la liste des fruits et légumes. "
                },
                {
                    id:"btn06",
                    title:"Client s'est Tromper",
                    text:"Le client s'est tromper sur le produit."
                },
                {
                    id:"btn07",
                    title:"Vu l’étiquette jaune.",
                    text:"La caissière n’a pas vu l’étiquette jaune sur le produit ."
                },
                {
                    id:"btn08",
                    title:"Produit cher.",
                    text:"Le client ne veut pas le produit car produit cher."
                },
                {
                    id:"btn09",
                    title:"Mauvaise étiquette jaune.",
                    text:"Mauvaise étiquette jaune sur le produit ."
                },
                {
                    id:"btn10",
                    title:"La boucherie trompée.",
                    text:"La boucherie s’est trompée d’étiquette."
                },
                {
                    id:"btn11",
                    title:"La responsable teste.",
                    text:"La responsable teste des produits."
                },
                {
                    id:"btn12",
                    title:"Le client ne veut plus",
                    text:"Le client ne ne veut plus du produit."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Satır Sil Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopDocRowDelDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopDocRowDelDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopDocRowDelDescriptionDesc",
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
    //Terazi Kontrol Aciklamasi
    {
        TYPE : 0,
        ID :"popBalanceCounterDesc",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn02",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn03",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn04",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn05",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description. "
                },
                {
                    id:"btn06",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn07",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn08",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn09",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn10",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn11",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                },
                {
                    id:"btn12",
                    title:"Veuillez indiquer une description.",
                    text:"Veuillez indiquer une description."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Terazi Kontrol Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopBalanceCounterDescDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopBalanceCounterDescMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopBalanceCounterDesc",
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
    //Park Açıklama
    {
        TYPE : 0,
        ID :"ParkDelDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Montant insuffisent retour du client.",
                    text:"Le client n'a pas le montant requis, il va venir payer et récupérer ses courses."
                },
                {
                    id:"btn02",
                    title:"Rajout d´achat...",
                    text:"Produit manquant retour du client instantannée."
                },
                {
                    id:"btn03",
                    title:"Personnel du magasin.",
                    text:"Mise en attente achat du personnel."
                },
                {
                    id:"btn04",
                    title:"Refus CB.",
                    text:"Refus CB client ... retour journée.."
                },
                {
                    id:"btn05",
                    title:"TEST.",
                    text:"Produit scanné suite à test pour une mise à jour."
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
                    title:"Description vide.",
                    text:"Description non saisie."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Park Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopParkDelDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopParkDelDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopParkDelDescriptionDesc",
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
    //Avans Açıklama
    {
        TYPE : 0,
        ID :"AdvanceDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn02",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn03",
                    title:"Description vide.",
                    text:"Description non saisie."
                },
                {
                    id:"btn04",
                    title:"Description vide.",
                    text:"Description non saisie."
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
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Avans Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopAdvanceDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopAdvanceDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopAdvanceDescriptionDesc",
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
    //RePrint Açıklama
    {
        TYPE : 0,
        ID :"RePrintDescription",
        VALUE : 
        {
            disable:false,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title:"justifier un remboursement..",
                    text:"Impression du ticket car non lisible sur le ticket initial Duplicata pour justifier un remboursement."
                },
                {
                    id:"btn02",
                    title:"La responsable demande.",
                    text:"La responsable demande un duplicata pour un contrôle prix."
                },
                {
                    id:"btn03",
                    title:" Plus de papiers.",
                    text:"Réimpression du ticket car plus de papiers."
                },
                {
                    id:"btn04",
                    title:"Client souhaite.",
                    text:"Le client souhaite avoir un ticket car perte de ticket."
                },
                {
                    id:"btn05",
                    title:"Cartouche.",
                    text:"Cartouche."
                },
                {
                    id:"btn06",
                    title:"Rôtisserie.",
                    text:"Rôtisserie."
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
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "RePrint Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopRePrintDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopRePrintDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopRePrintDescriptionDesc",
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
    //İndirim Açıklama
    {
        TYPE : 0,
        ID :"DiscountDescription",
        VALUE : 
        {
            disable:true,
            minCharSize:10,
            buttons:
            [
                {
                    id:"btn01",
                    title:"Garantie Cordo.",
                    text:"Garantie Cordo."
                },
                {
                    id:"btn02",
                    title:"Promo en cours",
                    text:"Promo en cours."
                },
                {
                    id:"btn03",
                    title:"Remise quantitative clés.",
                    text:"Remise quantitative clés."
                },
                {
                    id:"btn04",
                    title:"Remise quantitative autre.",
                    text:"Remise quantitative autre produit"
                },
                {
                    id:"btn05",
                    title:"Remise suite a incident.",
                    text:"Remise suite a incident."
                },
                {
                    id:"btn06",
                    title:"Produit endommagé.",
                    text:"Produit endommagé."
                },
                {
                    id:"btn07",
                    title:"Erreur tarif.",
                    text:"Erreur tarif."
                },
                {
                    id:"btn08",
                    title:"Offre ponctuelle.",
                    text:"Offre ponctuelle."
                },
                {
                    id:"btn09",
                    title:"Remise premiére sur complet.",
                    text:"Remise premiére sur complet."
                },
                {
                    id:"btn10",
                    title:"Remise billet à gratter.",
                    text:"Remise billet à gratter."
                },
                {
                    id:"btn11",
                    title:"Remise Facebook...",
                    text:"Remise Facebook Cordonnerie/Clés/Smartphones/Horlogerie/Pressing."
                },
                {
                    id:"btn12",
                    title:"Description non saisie.",
                    text:"Description non saisie."
                }
            ]
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "İndirim Açıklama",
            DISPLAY : "disable",
            FORM: 
            {
                width:"400",
                height:"280",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Pasif",field:"disable",id:"chkPopDiscountDescriptionDisable"},
                    {type:"text",caption:"Min.Karakter",field:"minCharSize",id:"txtPopDiscountDescriptionMinChar"},
                    {type:"popObjectList",caption:"Açıklama",field:"buttons",id:"lstPopDiscountDescriptionDesc",
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
    //Açılış da Park Getir
    {
        TYPE : 0,
        ID :"OpeningPark",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Açılış Park Getir"
        }
    },
    //Miktar Düzenle
    {
        TYPE : 0,
        ID :"QuantityEdit",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Miktar Düzenle"
        }
    },
    //Fiyat Düzenle
    {
        TYPE : 0,
        ID :"PriceEdit",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Düzenle"
        }
    },
    //Miktar Sıfır Kontrolü
    {
        TYPE : 0,
        ID :"QuantityCheckZero",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Sıfır Miktar Kontrolü"
        }
    },
    //Fiyat Sıfır Kontrolü
    {
        TYPE : 0,
        ID :"PriceCheckZero",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Sıfır Fiyat Kontrolü"
        }
    },
    //Min Fiyat Kontrolü
    {
        TYPE : 0,
        ID :"MinPriceCheck",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Min. Fiyat Kontrolü"
        }
    },
    //Maliyet Fiyat Kontrolü
    {
        TYPE : 0,
        ID :"CostPriceCheck",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Maliyet Fiyat Kontrolü"
        }
    },
    //Barkod Okutulduğunda Uyarı
    {
        TYPE : 0,
        ID : "ItemsWarning",
        VALUE : 
        [
            {
                items : "299997MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisie manuel boucherie.",
            },
            {
                items : "0299997MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisie manuel boucherie.",
            },
            {
                items : "102000MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisie manuel boucherie.",
            },
            {
                items : "0102000MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisie manuel boucherie.",
            },
        ],
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popObjectList",
            PAGE_NAME : "Pos",
            CAPTION : "Barkod Okutma Uyarısı",
            FORM: 
            {
                width:"800",
                height:"600",
                formWidth:"600",
                formHeight:"260",
                allowAdding : true,
                allowUpdating : true,
                allowDeleting : false
            }
        }
    },
    //Avans vs İşlemleri İçin Merkez Kasa
    {
        TYPE : 0,
        ID :"SafeCenter",
        VALUE : "df8b4f69-9e2d-449a-996a-0001abcf0308",
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popSelect",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa",
            FIELD : "GUID",
            FORM: 
            {
                selection:{mode:"single"},
                width:"600",
                height:"500",
                data:
                {
                    select:
                    {
                        query : "SELECT GUID,CODE,NAME FROM SAFE WHERE TYPE = 0 AND STATUS = 1 AND DELETED = 1 ORDER BY CODE ASC"
                    },
                },
            }
        }
    },
    //Aktarım Süresi
    {
        TYPE : 0,
        ID :"TransferTime",
        VALUE : 6000,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Aktarım Süresi"
        }
    },
    //Ekran Zaman Aşımı
    {
        TYPE : 0,
        ID :"ScreenTimeOut",
        VALUE : 600000,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Ekran Zaman Aşımı"
        }
    },
    //Fiş Çıktısı Sorulsun
    {
        TYPE : 0,
        ID :"PrintAlert",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Fiş Çıktısı Sorulsun"
        }
    },
    //Terazi Fiyat Çarpanı
    {
        TYPE : 0,
        ID :"ScalePriceFactory",
        VALUE : 1,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Terazi Fiyat Çarpanı"
        }
    },
    //Satış Sonu Yazdır
    {
        TYPE : 0,
        ID :"SaleClosePrint",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Satış Sonu Yazdır"
        }
    },
    //TSE Usb
    {
        TYPE : 0,
        ID :"TSEUsb",
        VALUE : false,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "TSE Usb"
        }
    },
    //Terazi Barkod Kontrolü
    {
        TYPE : 0,
        ID :"ScaleBarcodeControl",
        VALUE : 
        {
            active : false,
            dbControl:false,
            tolerans : 0.030
        },
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "popInput",
            PAGE_NAME : "Pos",
            CAPTION : "Terazi Barkod Kontrolü",
            DISPLAY : "active",
            FORM: 
            {
                width:"400",
                height:"220",
                colCount:1,
                item:
                [
                    {type:"checkbox",caption:"Aktif",field:"active",id:"chkPopScaleBarcodeControlActive"},
                    {type:"checkbox",caption:"Databese Fiş Kontrolü",field:"dbControl",id:"chkPopScaleBarcodeControlTicket"},
                    {type:"text",caption:"Tolerans",field:"tolerans",id:"txtPopScaleBarcodeControlTolerans"},
                ]
            }
        }
    },
    //Z Raporu
    {
        TYPE : 0,
        ID :"ZReport",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Z Raporu"
        }
    },
    //Z Raporu Yazdırma Dizaynı
    {
        TYPE : 0,
        ID :"ZReportPrintDesign",
        VALUE : "zreport.js",
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Z Raporu Dizaynı"
        }
    },
    //Müşteri Puan Çarpanı
    {
        TYPE : 0,
        ID :"CustomerPointFactory",
        VALUE : 100,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Müşteri Puan Katsayısı"
        }
    },
    //Mail Kontrolü
    {
        TYPE : 0,
        ID :"mailControl",
        VALUE : true,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Mail Kontrolü"
        }
    },
    //Fiyat Listesi
    {
        TYPE : 0,
        ID :"PricingListNo",
        VALUE : 1,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Liste No"
        }
    },
    //Fiyat Liste Seçim
    {
        TYPE : 0,
        ID :"PricingListNoChoice",
        VALUE : false,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Liste Seçimi"
        }
    },
    //Fiyat Bilgisi Sıfır Mesajı
    {
        TYPE : 0,
        ID :"PriceNotFoundAlert",
        VALUE : false,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Fiyat Bilgisi Sıfır Mesajı"
        }
    },
    //KeyType
    {
        TYPE : 0,
        ID :"KeyType",
        VALUE : "azert",
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Klavye Deseni"
        }
    },
    //#Lcd kucuk ekrana giriş yazısı eklemek
    {
        TYPE : 0,
        ID :"LcdEcranText",
        VALUE : "Bonjour",
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Pos lcd Ekran Çıkacak yazısı"
        }
    },
    //Adisyon Kullanım 
    {
        TYPE : 0,
        ID :"PosAddition",
        VALUE : false,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "checkbox",
            PAGE_NAME : "Pos",
            CAPTION : "Pos Adisyon kullanımı"
        }
    },
]
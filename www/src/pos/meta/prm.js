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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Para Sembolü"
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
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Barkod Desenleri"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Ticket Rest. Puan Kullanımı"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "İade Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "İade Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Evrak Sil Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Satır Sil Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Park Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Avans Açıklama"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Park Açıklama"
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
            TYPE : "text",
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
            TYPE : "text",
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
            TYPE : "text",
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
            TYPE : "text",
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
            TYPE : "text",
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
            TYPE : "text",
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
            TYPE : "text",
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
                msg : "Attention prix saisse en manuel boucherie.",
            },
            {
                items : "0299997MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisse en manuel boucherie.",
            },
            {
                items : "102000MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisse en manuel boucherie.",
            },
            {
                items : "0102000MMMCCF",
                title : "Attention Prix Boucherie Manuel",
                msg : "Attention prix saisse en manuel boucherie.",
            },
        ],
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa"
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
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Merkez Kasa"
        }
    },
    //Aktarım Süresi
    {
        TYPE : 0,
        ID :"TransferTime",
        VALUE : 1800,
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
        VALUE : false,
        SPECIAL : "",
        PAGE : "pos",
        ELEMENT : "",
        APP : "POS",
        VIEW : 
        {
            TYPE : "text",
            PAGE_NAME : "Pos",
            CAPTION : "Fiş Çıktısı Sorulsun"
        }
    }
    //#endregion
]
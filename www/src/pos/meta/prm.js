export const prm =
[
    //#region Pos
    //Para Sembolu
    {
        TYPE : 0,
        ID :"MoneySymbol",
        VALUE : {code:"CHF",sign:"CHF"},
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
            '27NNNNNKKGGGF',
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
                    title: "Nicht identisch.",
                    text: "Der Preis am Regal und der Preis im System sind nicht identisch."
                },
                {
                    id:"btn02",
                    title: "Vereinbarung mit dem Verantwortlichen.",
                    text: "Mit Zustimmung des Managers gab es eine Preissenkung für den Kunden."
                },
                {
                    id:"btn03",
                    title: "Fehler Metzgereipreis.",
                    text: "Das Metzgerei-Etikett ist falsch."
                },
                {
                    id:"btn04",
                    title: "Preis für Menge.",
                    text: "Es wurde ein Preis für eine große Menge gemacht."
                },
                {
                    id:"btn05",
                    title: "Etikett ist unleserlich",
                    text: "Das Etikett des Produkts ist unleserlich. Manuell eingeben."
                },
                {
                    id:"btn06",
                    title: "Produkt war defekt.",
                    text: "Ein Preis wurde gemacht, weil das Produkt fehlerhaft war."
                },
                {
                    id:"btn07",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn08",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn09",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn10",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn11",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn12",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
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
            disable:true,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title: "Doppelter Barcode.",
                    text: "Eingabefehler beim Lesen des doppelten Barcodes."
                },
                {
                    id:"btn02",
                    title: "Defekt oder defekt.",
                    text: "Der Kunde hat eine Rücksendung gemacht, das Produkt ist defekt oder ausgefallen."
                },
                {
                    id:"btn03",
                    title: "Rücksendung des Produkts.",
                    text: "Der Kunde schickt das Produkt zurück, weil es ihm nicht gefallen hat."
                },
                {
                    id:"btn04",
                    title: "Fehler beim Kauf.",
                    text: "Der Kunde hat sich beim Kauf geirrt und möchte eine Rücksendung machen."
                },
                {
                    id:"btn05",
                    title: "Hat das Produkt zweimal gescannt",
                    text: "Die Kassiererin hat das Produkt zweimal gescannt."
                },
                {
                    id:"btn06",
                    title: "Vergessen zu löschen.",
                    text: "Die Kassiererin hat vergessen, den unerwünschten Artikel zu löschen."
                },
                {
                    id:"btn07",
                    title: "Nicht das richtige Produkt ausgewählt.",
                    text: "Die Kassiererin hat nicht das richtige Produkt ausgewählt."
                },
                {
                    id:"btn08",
                    title: "Gelbes Etikett nicht gesehen.",
                    text: "Die Kassiererin hat das gelbe Etikett auf dem Produkt nicht gesehen."
                },
                {
                    id:"btn09",
                    title: "Etikettenfehler.",
                    text: "Der Kunde hat das Produkt wegen eines Etikettenfehlers zurückgegeben."
                },
                {
                    id:"btn10",
                    title: "Zu teuer.",
                    text: "Der Kunde hat das Produkt zurückgegeben, weil es zu teuer war."
                },
                {
                    id:"btn11",
                    title: "Falsches gelbes Etikett.",
                    text: "Falsches gelbes Etikett auf dem Produkt."
                },
                {
                    id:"btn12",
                    title: "Metzgerei hat sich geirrt.",
                    text: "Die Metzgerei hat sich in der Etikette geirrt."
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
            disable:true,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title: "Rennen abgebrochen.",
                    text: "Der Kunde will sein Produkt nicht mehr."
                },
                {
                    id:"btn02",
                    title: "Unzureichender Betrag!",
                    text: "Der Kunde hat nicht genug Geld, um seine Waren zu bezahlen."
                },
                {
                    id:"btn03",
                    title: "CB-Verweigerung.",
                    text: "Zahlung von der CB-Bank des Kunden abgelehnt."
                },
                {
                    id:"btn04",
                    title: "Die Leiterin testet.",
                    text: "Die Leiterin testet Produkte."
                },
                {
                    id:"btn05",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn06",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn07",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn08",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn09",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn10",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn11",
                    title: "Beschreibung nicht eingegeben.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id:"btn12",
                    title: "TEST.",
                    text: "Produkt wurde gescannt, um auf ein Update zu testen."
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
            disable:true,
            minCharSize:25,
            buttons:
            [
                {
                    id:"btn01",
                    title: "Wegen des Preises.",
                    text: "Der Kunde will das Produkt nicht mehr, weil ihm der Preis nicht mehr passt."
                },
                {
                    id:"btn02",
                    title: "Fehler beim angezeigten Preis.",
                    text: "Der Preis im Regal und im System ist nicht identisch."
                },
                {
                    id:"btn03",
                    title: "Zweimal gescannt.",
                    text: "Die Kassiererin hat das Produkt zweimal gescannt."
                },
                {
                    id:"btn04",
                    title: "Fehler bei der Eingabe der Liste.",
                    text: "Kassiererin hat einen Fehler bei der Eingabe der Produktliste gemacht."
                },
                {
                    id:"btn05",
                    title: "Eingabe von Obst und Gemüse.",
                    text: "Kassiererin hat einen Fehler bei der Eingabe der Obst- und Gemüseliste gemacht. "
                },
                {
                    id:"btn06",
                    title: "Kunde hat sich getäuscht",
                    text: "Der Kunde hat sich über das Produkt getäuscht."
                },
                {
                    id:"btn07",
                    title: "Das gelbe Etikett gesehen.", 
                    text: "Die Kassiererin hat das gelbe Etikett auf dem Produkt nicht gesehen."
                },
                {
                    id:"btn08",
                    title: "Teures Produkt.",
                    text: "Der Kunde will das Produkt nicht, weil das Produkt teuer ist."
                },
                {
                    id: "btn09",
                    title: "Falsches gelbes Etikett.",
                    text: "Falsches gelbes Etikett auf dem Produkt."
                },
                {
                    id: "btn10",
                    title: "Die Metzgerei hat sich geirrt.",
                    text: "Die Metzgerei hat das Etikett verwechselt."
                },
                {
                    id: "btn11",
                    title: "Die Managerin testet.",
                    text: "Die Leiterin testet Produkte."
                },
                {
                    id: "btn12",
                    title: "Der Kunde will nicht mehr",
                    text: "Der Kunde will das Produkt nicht mehr."
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
                    id: "btn01",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn02",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn03",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn04",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn05",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an. "
                },
                { 
                    id: "btn06",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn07",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn08",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn09",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn10",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an. "
                },
                { 
                    id: "btn11",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
                },
                {
                    id: "btn12",
                    title: "Bitte geben Sie eine Beschreibung an.",
                    text: "Bitte geben Sie eine Beschreibung an."
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
            disable:true,
            minCharSize:25,
            buttons:
            [
                { 
                    id: "btn01",
                    title: "Unzureichender Betrag, wenn der Kunde zurückkommt.",
                    text: "Der Kunde hat nicht den erforderlichen Betrag, er wird kommen, um zu bezahlen und seine Einkäufe abzuholen."
                },
                {
                    id: "btn02",
                    title: "Nachkauf ...",
                    text: "Fehlende Ware wird sofort an den Kunden zurückgeschickt."
                },
                {
                    id: "btn03",
                    title: "Mitarbeiter im Geschäft.",
                    text: "Warten auf Personalkauf."
                },
                {
                    id: "btn04",
                    title: "Verweigerte Kreditkarte.",
                    text: "Verweigerung der Bankkarte ... zurück Tag ..."
                },
                {
                    id: "btn05",
                    title: "TEST.",
                    text: "Produkt wurde gescannt, um für ein Update getestet zu werden."
                },
                { 
                    id: "btn06",
                    title: "Beschreibung leer.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn07",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn08",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn09",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn10",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn11",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
                },
                {
                    id: "btn12",
                    title: "Leere Beschreibung.",
                    text: "Beschreibung nicht eingegeben."
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
            disable:true,
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
            disable:true,
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
        VALUE : 600,
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
    //#endregion
]
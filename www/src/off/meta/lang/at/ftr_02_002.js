// "Satış Faturası"
const  ftr_02_002 =
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundencode",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt" ,
    txtDiscount : "Zeilenrabatt", 
    LINE_NO: "Zeilennummer",   
    txtDocDiscount : "Belegrabatt",   
    txtSubTotal : "Zwischensumme",   
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getDispatch : "Lieferschein suchen",
    getPayment : "Kassierung",
    cash : "Gesamt" ,
    description :"Grund",
    checkReference : "Referenz",
    checkDate : "Datum",
    btnCash : "Bargeld",
    btnCheck : "Scheck",
    btnBank : "Überweisung",
    cmbCashSafe : "Bargeldkasse",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankauswahl",
    txtPayInvoıceTotal : "Rechnungssumme",
    txtPayTotal : "Kassierungssumme",
    txtRemainder : "Rest",
    txtBarcode: "Strichcode",
    txtBarcodePlace: "Strichcode scannen...",
    txtQuantity : "Menge", 
    getOrders : "Bestellung suchen", 
    tabTitleSubtotal : "Rechnungssumme",  
    tabTitlePayments : "Zahlungsinformationen",  
    tabTitleOldInvoices : "Informationen zu früheren Rechnungen",  
    getRemainder : "Restbetrag suchen",  
    txtbalance : "Aktueller Gesamtsaldo",   
    txtUnitFactor : "Einheitsfaktor",  
    txtUnitQuantity : "Einheitsmenge",  
    txtTotalQuantity : "Gesamtmenge",  
    txtUnitPrice : "Stückpreis",
    txtExpFee : "Verzugsstrafe", 
    dtExpDate : "Fälligkeitsdatum", 
    getOffers : "Angebot suchen",  
    getProforma : "Proforma suchen", 
    btnView : "Vorschau", 
    btnMailsend : "E-Mail senden", 
    placeMailHtmlEditor : "Bitte geben Sie Ihren Text ein.", 
    validDesign : "Bitte wählen Sie ein Design.",   
    txtTotalHt : "Gesamt ohne MwSt.",
    txtDocNo : "Belegnummer", 
    extraCost : "Zuschlag",
    cmbPricingList : "Preisliste",
    txtTransport : "Transportart",
    tabTitleDetail : "Detailinformationen",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor : "Sie können eine Beschreibung Ihrer E-Mail eingeben.",
    msgControlOfFacture:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dieses Lieferschein wurde bereits in eine Rechnung umgewandelt. Wenn Sie eine Rechnung erstellen möchten, wählen Sie bitte die Rechnung im Verkaufsrechnungsmodul. Diese Aktion wird geschlossen."
    },
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang ohne Speichern des Dokuments nicht möglich!"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "E-Mail senden fehlgeschlagen!"
    },
    popMailSend :
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail Betreff",
        txtSendMail : "E-Mail Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Absender E-Mail Adresse"
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Nummer",
        clmInputName : "Kundenname",
        clmInputCode  : "Kundencode",
        clmTotal : "Gesamt inkl. MwSt."
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    pg_txtItemsCode : 
    {
        title : "Artikel auswählen",
        clmCode :  "Artikelreferenz",
        clmName : "Artikelname",
        clmPrice : "Verkaufspreis" 
    },
    pg_dispatchGrid : 
    {
        title : "Lieferschein auswählen" ,
        clmReferans : "Referenzen",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Gesamt",
        clmDate : "Datum",
        clmDocNo : "Belegnummer",

    },
    grdSlsInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "MwSt.",
        clmAmount : "Gesamt",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamt ohne MwSt.",
        clmDispatch : "Lieferschein Nr.",
        clmCreateDate: "Registrierungsdatum",
        clmMargin :"Marge",
        clmDescription : "Grund",
        clmCuser :"Benutzer",
        clmVatRate : "MwSt. %",
        clmOrigin : "Herkunft",
        clmSubQuantity : "Einheitsmenge",  
        clmSubPrice : "Stückpreis", 
        clmSubFactor : "Faktor",
        clmPartiLot : "Chargennummer",
    },
    msgControlOfDispatch: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dieses Angebot wurde bereits in einen Lieferschein umgewandelt. Wenn Sie eine Rechnung erstellen möchten, erstellen Sie bitte eine neue Rechnung im Verkaufsrechnungsmodul."
    },
    pg_partiLot : 
    {
        title : "Chargenauswahl",
        clmLotCode : "Chargennummer",
        clmSkt : "MHD",
    },
    grdRebtInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "MwSt.",
        clmAmount : "Gesamt",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamt ohne MwSt.",
        clmDispatch : "Lieferschein Nr.",
        clmCreateDate: "Registrierungsdatum",
        clmMargin :"Marge",
        clmDescription :"Grund",
        clmCuser :"Benutzer",
        clmMulticode : "LFR.Code",    
        clmBarcode : "Strichcode",    
        clmVatRate :"MwSt. %",
        clmSubQuantity : "Einheitsmenge",
        clmSubPrice : "Stückpreis",
        clmSubFactor : "Faktor",  
        clmPartiLot : "Chargennummer",
    },
    pg_partiLot : 
    {
        title : "Chargenauswahl",
        clmLotCode : "Chargennummer",
        clmSkt : "MHD",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Typ",
        clmPrice: "Preis",
        clmCreateDate: "Registrierungsdatum",

    },
    popPayment:
    {
        title: "Kassierung",
    },
    popDiscount : 
    {
       title: "Zeilenrabatt", 
        chkFirstDiscount : "Rabatte der 1. Zeile nicht ändern",
        chkDocDiscount : "Belegrabatt",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabatt",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabatt",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabatt"
    },
    popDocDiscount : 
    {
       title: "Belegrabatt",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabatt",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabatt",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabatt"
    },
    popPassword : 
    {
        title: "Bitte Administrator-Passwort für Dokumentzugriff eingeben",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie die Kopfzeile vor dem Abschluss ein!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der eingegebene Betrag kann nicht höher als der Saldo sein!"
    },
    msgInterfel:
    {
        title: "Achtung",
        btn01: "Ja",
        btn02: "Nein",
        msg: "Möchten Sie die Interfel-Anwendung?"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    isMsgSave: {  
        title: "Achtung",
        btn01: "OK",
        msg: "Der Vorgang kann nicht ohne Speichern des Dokuments durchgeführt werden!"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgMaxPriceAlert:
    {
        title: "Achtung",    
        btn01: "OK",   
        msg: "Sie sind nicht berechtigt, einen höheren Preis einzugeben!"
    },
    msgMaxUnitQuantity:
    {
        title: "Achtung",  
        btn01: "OK", 
        msg: "Sie sind nicht berechtigt, eine höhere Menge einzugeben!" 
    },
    msgRowNotUpdate:
    {
        title: "Achtung",  
        btn01: "OK",  
        msg: "Da diese Zeile von der Lieferung übertragen wurde, kann ihr Betrag nicht geändert werden."  
    },  
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die MwSt. auf Null setzen möchten!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt höher als den Gesamtbetrag gewähren!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt höher als den Gesamtbetrag gewähren!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolg",
        btn01: "OK",
        msg: "Dokument entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Falsches Passwort"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Änderung oder Löschung ist unmöglich, da Ihr Dokument signiert und archiviert wurde!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument kann nicht gelöscht werden, da Zahlung erfasst!" 
    },
    msgDoclocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können nicht speichern, ohne zu entsperren!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Rabatt kann nicht höher als die Summe sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Unbekannter Kunde"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenfassen",
        btn02: "Neu hinzufügen",
        msg: "Artikel bereits im Dokument vorhanden! Möchten Sie zusammenfassen?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen Kunden ein!"
    },
    popCash : 
    {
        title: "Bargeld-Eintrag",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheck-Eintrag",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Überweisungseintrag",
        btnApprove : "Hinzufügen"
    },
    popDesign : 
    {
        title: "Design-Auswahl",
        design : "Design",
        lang : "Dokumentsprache" 
    },
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Code nicht gefunden"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl hinzugefügter Artikel"
    },
    popMultiItem:
    {
        title: "Sammel-Artikelzufügung",
        btnApprove: "Artikel suchen",
        btnClear : "Löschen",
        btnSave : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmodus",
        customerCode : "Nach Lieferantencode",
        ItemCode : "Nach Artikelcode"
    },
    grdMultiItem : 
    {
        clmCode : "Artikelreferenz",
        clmMulticode : "LFR.Code",
        clmName : "Artikelname",
        clmQuantity : "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste leeren und alles hinzufügen",
        btn02: "Neue Eingaben zur Liste hinzufügen",
        msg: "Artikel bereits in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Einheitsauswahl",
        btn01: "Bestätigen",
    }, 
    validRef :"Referenz eingeben",
    validRefNo : "Ref Nr eingeben",
    validDepot : "Lager auswählen",
    validCustomerCode : "Lieferanten-Kundencode kann nicht leer sein",
    validDocDate : "Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    msgNotQuantity: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument kann nicht gelöscht werden, da Zahlung erfasst!" 
    },
    pg_txtBarcode : 
    {
        title : "Strichcode auswählen",
        clmCode :  "Artikelreferenz",
        clmName : "Artikelname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Strichcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge hinzufügen"
    },
    cmbPayType : 
    {
        title : "Zahlungsart",   
        cash : "Bargeld",   
        check : "Scheck",   
        bankTransfer : "Kontoüberweisung",   
        otoTransfer : "Lastschrift",   
        foodTicket : "Essensgutschein",   
        bill : "Rechnung",   
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count:  "Zeilenanzahl",
        quantity: "Gesamtmenge",
        quantity2: "2. Einheit Gesamt",
        margin: "Marge"
    },
    popUnit2 : 
    {
        title : "Inhaltsdetails"
    },
    grdUnit2 : 
    {
        clmName : "Name",
        clmQuantity : "Menge"
    },
    pg_adress : 
    {
        title : "Adressauswahl",   
        clmAdress : "Adresse",   
        clmCiyt : "Stadt",   
        clmZipcode : "Postleitzahl",   
        clmCountry : "Land",   
    },
    msgCode : 
    {
        title: "Achtung",
        btn01:"Zum Dokument gehen",
        msg: "Dokument gefunden!"
    },
    pg_offersGrid : 
    {
        title : "Angebot auswählen",    
        clmReferans : "Ref. Ref Nr:",  
        clmCode : "Code",  
        clmName : "Name",  
        clmQuantity : "Menge",  
        clmTotal : "Gesamt",  
        clmPrice : "Preis",  
    },
    pg_proformaGrid : 
    {
        title : "Proforma-Auswahl",   
        clmReferans : "Ref. Ref Nr:",   
        clmCode : "Code",   
        clmName : "Name",   
        clmQuantity : "Menge",   
        clmPrice : "Preis",   
        clmTotal : "Gesamt"   
    },
    msgUnderPrice1:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Preis unter Einkaufspreis!!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können nicht unter dem Einkaufspreis verkaufen!!"
    },
    popMailSend : 
    {
        title :"E-Mail senden",   
        txtMailSubject : "E-Mail Betreff",   
        txtSendMail : "E-Mail Adresse",   
        btnSend : "Senden",
        cmbMailAddress : "Absender E-Mail Adresse"
    },
    msgMailSendResult:
    {
        title: "Achtung",   
        btn01: "OK",   
        msgSuccess: "E-Mail erfolgreich gesendet!",   
        msgFailed: "E-Mail senden fehlgeschlagen!"   
    },
    msgPrintforLocked:
    {
        title: "Achtung",  
        btn01: "OK",  
        msg: "Das Dokument kann nicht gedruckt werden, ohne gesperrt zu sein!"  
    },
    popRound : 
    {
        title : "Bitte geben Sie den Betrag ein, den Sie runden möchten",  
        total : "Betrag", 
    },
    msgWorngRound:
    {  
        title: "Achtung",  
        btn01: "OK", 
        msg1: "Der Betrag, den Sie runden möchten, beträgt maximal",  
        msg2: " Es kann einen Unterschied geben!" 
    },
    msgDiscountEntry : 
    {
        title : "Rabattbetrag eingeben",  
        btn01 : "Bestätigen" 
    },
    txtDiscount1 : "1. Rabatt", 
    txtDiscount2 : "2. Rabatt", 
    txtDiscount3 : "3. Rabatt", 
    txtTotalDiscount :"Gesamtrabatt", 
    msgDiscountPerEntry : 
    {
        title : "Rabatt in % eingeben", 
        btn01 : "Bestätigen" 
    },
    txtDiscountPer1 : "1. Rabatt %", 
    txtDiscountPer2 : "2. Rabatt %", 
    txtDiscountPer3 : "3. Rabatt %", 
    serviceAdd : "Service hinzufügen",  
    pg_service : 
    {
        title : "Dienstleistungen",   
        clmCode : "Code",   
        clmName : "Name"   
    },
    popExtraCost: 
    {
        title : "Zuschlag",  
        interfel : "Interfel", 
        calculateInterfel : "Interfel-Berechnung",
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Kunde kann nach Hinzufügen des Artikels nicht geändert werden!" 
    },
    cmbExpiryType : "MwSt.-Option",
    cmbTypeData : 
    {
        encaissement : "Kassierung",   
        debit : "Lastschrift",   
    },
}
export default ftr_02_002
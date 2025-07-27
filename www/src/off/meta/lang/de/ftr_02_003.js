// "İade Faturası"
const ftr_02_003 =
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Lieferantencode",
    txtCustomerName : "Lieferantenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt" ,
    txtDiscount : "Zeilenrabatt",    
    txtDocDiscount : "Belegrabatt",   
    txtSubTotal : "Zwischensumme",    
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getPayment : "Kassierung",
    getDispatch : "Lieferschein suchen",
    getRebate: "Mit Rechnung verknüpfen",
    cash : "Gesamt" ,
    description :"Grund",
    checkReference : "Referenz",
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
    getProforma : "Proforma suchen", 
    btnView : "Vorschau", 
    btnMailsend : "E-Mail senden", 
    placeMailHtmlEditor : "Bitte geben Sie Ihren Text ein.", 
    validDesign : "Bitte wählen Sie ein Design.",  
    validMail : "Bitte lassen Sie das Feld nicht leer.",  
    txtTotalHt : "Gesamt ohne MwSt.",
    txtDocNo : "Belegnummer", 
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Nummer",
        clmInputName : "Lieferantenname",
        clmInputCode  : "Kundencode",
        clmTotal : "Gesamt inkl. MwSt."
    },
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    pg_txtItemsCode : 
    {
        title : "Artikel auswählen",
        clmCode :  "Artikelreferenz",
        clmName : "Artikelname",
        clmPrice : "Einkaufspreis" 
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
    pg_getRebate : 
    {
        title : "Rechnung auswählen" ,
        clmReferans : "Referenzen",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Gesamt",
        clmDate : "Datum",
        clmDocNo : "Belegnummer",
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
        msg: "Der Restbetrag kann nicht höher als die Summe sein!"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
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
        msg: "Dokument gesperrt! \n Bitte entsperren Sie es, um Änderungen zu speichern!"
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
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Der ausgewählte Artikel ist nicht mit dem Kunden verknüpft! Möchten Sie fortfahren?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Unbekannter Lieferant"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenfassen",
        btn02: "Neu hinzufügen",
        msg: "Artikel bereits im Dokument vorhanden! Möchten Sie kombinieren?"
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
    cmbPayType : {
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
    pg_proformaGrid : 
    {
        title : "Proforma-Auswahl",   
        clmReferans : "Ref. Ref Nr",   
        clmCode : "Code",   
        clmName : "Name",   
        clmQuantity : "Menge",   
        clmPrice : "Preis",   
        clmTotal : "Gesamt"   
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
    msgMailSendResult:
    {
        title: "Achtung",   
        btn01: "OK",   
        msgSuccess: "E-Mail erfolgreich gesendet!",   
        msgFailed: "E-Mail senden fehlgeschlagen!"  
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
        btnClear : "Liste leeren",
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
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    msgPrintforLocked:
    {
        title: "Achtung",   
        btn01: "OK",   
        msg: "Das Dokument kann nicht gedruckt werden, ohne gesperrt zu sein!"  
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Lieferant kann nach Hinzufügen des Artikels nicht geändert werden!" 
    },
}
export default ftr_02_003
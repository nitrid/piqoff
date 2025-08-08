// "Proforma Fiyat Farkı Faturası"
const ftr_04_001 =
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Lieferantencode",
    txtCustomerName : "Lieferantenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Belegrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    getContract : "Einkaufsrechnung auswählen",
    getPayment : "Zahlungseintrag",
    cash : "Gesamt",
    description :"Grund",
    checkReference : "Referenz",
    btnCash : "Zahlung hinzufügen",
    btnCheck : "Scheck",
    btnBank : "Überweisung",
    cmbCashSafe : "Kassenauswahl",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankauswahl",
    txtPayInvoıceTotal : "Rechnungssumme",
    txtPayTotal : "Zahlungssumme",
    txtRemainder : "Rest",
    txtBarcode : "Strichcode hinzufügen",
    txtBarcodePlace: "Strichcode scannen",
    txtQuantity :"Menge",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungsdetails",
    tabTitleOldInvoices : "Frühere Rechnungsinformationen",
    getRemainder : "Restbetrag suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtTotalHt : "Gesamt ohne MwSt.",
    validDesign : "Bitte wählen Sie ein Design",
    txtDocNo : "Belegnummer",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang kann ohne Speichern des Dokuments nicht durchgeführt werden!"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
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
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Betrag kann nicht kleiner als 0 sein!"
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Ref.Nr",
        clmInputName : "Kundenname",
        clmInputCode  : "Kundencode",
        clmTotal : "Gesamt inkl. MwSt."
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Modus",
        clmGenusName : "Art"
    },
    pg_txtItemsCode : 
    {
        title : "Lagerauswahl",
        clmCode :  "LAGERCODE",
        clmName : "LAGERNAME",
        clmPrice : "Verkaufspreis"
    },
    pg_contractGrid : 
    {
        title : "Rechnungsauswahl",
        clmReferans : "Ref.Nr.-Ref.",
        clmDocDate : "Rechnungsdatum",
        clmTotal : "Gesamt"
    },
    grdDiffInv: 
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
        clmCreateDate: "Registrierungsdatum",
        clmInvNo : "Rechnungsnummer",
        clmInvDate : "Rechnungsdatum",
        clmDescription :"Grund",
        clmCuser :"Benutzer",
        clmMulticode : "LFR Code",
        clmCustomerPrice : "Gesamtbetrag",
        clmPurcPrice : "Rechnungsbetrag",
        clmVatRate : "MwSt. %"
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Modus",
        clmPrice: "Preis",
        clmCreateDate: "Registrierungsdatum",

    },
    popPayment:
    {
        title: "Zahlungen",
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
        title: "Bitte Administrator-Passwort zum Entsperren eingeben",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können den Lagerbestand nicht eingeben, ohne alle Dokumentfelder auszufüllen!"
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
        msg: "Bitte füllen Sie die leeren Felder aus!"
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
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keine Zahlung höher als den Restbetrag eingeben!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Rabatt kann nicht höher als der Betrag sein!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Rabatt kann nicht höher als der Betrag sein!"
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
        msg: "Falsches Passwort!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gesperrt! \n Um Änderungen zu speichern, müssen Sie das Administrator-Passwort eingeben!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ohne Entsperren des Dokuments können keine Aktionen durchgeführt werden!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Rabatt kann nicht höher als der Betrag sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lager nicht gefunden!!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Das hinzuzufügende Produkt ist bereits im Dokument vorhanden! Zeilen zusammenführen?"
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
    validRef :"Referenz darf nicht leer sein",
    validRefNo : "Zeile darf nicht leer sein",
    validDepot : "Bitte wählen Sie ein Lager",
    validCustomerCode : "Kundencode kann nicht leer sein",
    validDocDate : "Datum auswählen",
    pg_txtBarcode : 
    {
        title : "Strichcode-Auswahl",
        clmCode :  "Lagercode",
        clmName : "Lagername",
        clmMulticode : "Lieferantencode",
        clmBarcode : "Strichcode"
    },
    msgQuantity:
    {
        title: "Betrag",
        btn01: "Hinzufügen",
        msg: "Betrag eingeben"
    },
    cmbPayType : 
    {
        title : "Zahlungsart",
        cash : "Bargeld",
        check : "Scheck",
        bankTransfer : "Überweisung",
        otoTransfer : "Lastschrift",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt, Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt, Sie können sie nicht löschen!"
    },
    msgdocNotDelete : 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ihr Dokument enthält eine in eine Rechnung umgewandelte Zeile. Sie können das Dokument nicht löschen!"
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
    serviceAdd : "Service hinzufügen",  
    pg_service : 
    {
        title : "Dienstleistungen",   
        clmCode : "Code",   
        clmName : "Name"   
    },
    msgCustomerLock: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde kann nach Hinzufügen des Artikels nicht geändert werden!"
    },
}
export default ftr_04_001
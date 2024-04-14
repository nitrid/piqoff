// "Proforma Fiyat Farkı Faturası"
const ftr_04_001 =
{
    txtRefRefno : "Reihenfolge",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Dokumentenrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "..",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    getContract : "Einkaufsrechnung auswählen",
    getPayment : "Zahlungseingang",
    cash : "Betrag",
    description :"Beschreibung",
    checkReference : "Referenz",
    btnCash : "Zahlung hinzufügen",
    btnCheck : "Scheck",
    btnBank : "Überweisung",
    cmbCashSafe : "Kassenauswahl",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankauswahl",
    txtPayInvoiceTotal : "Rechnungsbetrag",
    txtPayTotal : "Gesamtzahlung",
    txtRemainder : "Restbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    tabTitleSubtotal : "Gesamtsumme der Rechnung",
    tabTitlePayments : "Zahlungen",
    tabTitleOldInvoices : "Historische Rechnungsinformationen",
    getRemainder : "Restbetrag Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtTotalHt : "Rabattierter Betrag",
    validDesign : "Bitte Design auswählen",
    txtDocNo : "Belge Nr.",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang kann nicht ohne Speicherung des Dokuments durchgeführt werden!"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail-Versand erfolgreich!",
        msgFailed: "E-Mail-Versand fehlgeschlagen!"
    },
    popMailSend :
    {
        title :"E-Mail senden",
        txtMailSubject : "Betreff der E-Mail",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: " Betrag darf nicht kleiner als 0 sein!"
    },
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "REIHE",
        clmRefNo : "FOLGE",
        clmInputName : "KUNDENNAME",
        clmInputCode  : "KUNDENNUMMER",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENNUMMER",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode : 
    {
        title : "Artikelauswahl",
        clmCode :  "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmPrice : "VERKAUFSPREIS"
    },
    pg_contractGrid : 
    {
        title : "Rechnungsauswahl",
        clmReferans : "Reihe - Folge",
        clmDocDate : "Dokumentdatum",
        clmTotal : "Betrag"
    },
    grdDiffInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Anzahl",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmTotalHt : "Gesamtbetrag ohne. ..",
        clmCreateDate: "Erstellungsdatum",
        clmInvNo : "Rechnungsnummer",
        clmInvDate : "Rechnungsdatum",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmMulticode : "Kundenpreis",
        clmCustomerPrice : "Kundenpreis",
        clmPurcPrice : "Rechnungspreis",
        clmVatRate : ".. %"
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Typ",
        clmPrice: "Preis",
        clmCreateDate: "Erstellungsdatum",

    },
    popPayment:
    {
        title: "Zahlungen",
    },
    popDiscount : 
    {
        title: "Zeilenrabatt",
        chkFirstDiscount : "1. Rabatt in der Zeile aktualisieren",
        chkDocDiscount : "Als Dokumentenrabatt anwenden",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentenrabatt",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabattbetrag"
    },
    popPassword:
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password: "Passwort",
        btnApprove: "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Bestände erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag speichern?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Der Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Der Eintrag konnte nicht gespeichert werden!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag löschen?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Steuer zurücksetzen?"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen mehr als der ausstehende Betrag eingegeben werden!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der den Betrag übersteigt!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der den Betrag übersteigt!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Die Dokumentsperre wurde aufgehoben!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Das eingegebene Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen vorzunehmen, müssen Sie es mit dem Administratorpasswort entsperren!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag kann den Gesamtbetrag nicht überschreiten!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Das gewünschte Artikel ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    popCash:
    {
        title: "Bargeld-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popCheck:
    {
        title: "Scheck-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popBank:
    {
        title: "Überweisungs-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popDesign:
    {
        title: "Design-Auswahl",
        design: "Design",
        lang: "Dokumentsprache"
    },
    msgUnit:
    {
        title: "Auswahlfeld",
        btn01: "Bestätigen"
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihenfolgenummer darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Die Kundennummer darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "Artikelnummer",
        clmName: "Artikelbezeichnung",
        clmMulticode: "Lieferantennummer",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Geben Sie die Menge ein"
    },
    cmbPayType: 
    {
        title: "Zahlungsart",
        cash: "Bargeld",
        check: "Scheck",
        bankTransfer: "Banküberweisung",
        otoTransfer: "Automatische Zahlung",
        foodTicket: "Essensgutschein",
        bill: "Rechnung",
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde bereits in eine Rechnung umgewandelt. Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde bereits in eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument enthält bereits umgewandelte Rechnungszeilen. Es kann nicht gelöscht werden!"
    },
    pg_adress:
    {
        title: "Adressauswahl",
        clmAdress: "Adresse",
        clmCiyt: "Stadt",
        clmZipcode: "Postleitzahl",
        clmCountry: "Land",
    },
    msgCode:
    {
        title: "Achtung",
        btn01: "Zum Dokument",
        msg: "Dokument gefunden"
    },
    serviceAdd: "Dienstleistung hinzufügen",
    pg_service:
    {
        title: "Dienstleistungen",
        clmCode: "Code",
        clmName: "Name"
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default ftr_04_001
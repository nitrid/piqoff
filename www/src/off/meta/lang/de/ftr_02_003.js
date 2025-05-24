// "İade Faturası"
const ftr_02_003 =
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
    dtShipDate :"Versanddatum",
    getPayment : "Zahlungseingang",
    getDispatch : "Lieferschein abrufen",
    getRebate: "Mit der Rechnung verbinden",
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
    txtPayTotal : "Gesamteinnahmen",
    txtRemainder : "Restbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungsinformationen",
    tabTitleOldInvoices : "Alte Rechnungen",
    getRemainder : "Restbetrag Suchen",
    txtbalance : "Kontoguthaben",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum",
    getProforma : "Proforma Suchen",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    placeMailHtmlEditor : "Geben Sie einen Text für Ihre E-Mail ein.",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte füllen Sie das Feld aus.",
    txtTotalHt : "Rabattierter Betrag",
    txtDocNo : "Dokumentennummer",
    pg_Docs :
    {
        title : "Dokumentenauswahl",
        clmDate : "DATUM",
        clmRef : "REIHENFOLGE",
        clmRefNo : "FOLGE",
        clmInputName : "KUNDENNAME",
        clmInputCode : "KUNDENNUMMER",
    },
    pg_txtCustomerCode :
    {
        title : "Kundenauswahl",
        clmCode : "KUNDENNUMMER",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode :
    {
        title : "Artikelauswahl",
        clmCode : "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmPrice : "EINKAUFSPREIS"
    },
    pg_dispatchGrid :
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Reihenfolge - Folge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Anzahl",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo: "Dokumentnummer"
    },
    pg_getRebate : 
    {
        title : "Rechnung verbinden",
        clmReferans : "Seriennummer-Folge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo: "Dokumentnummer"
    },
    grdRebtInv:
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Anzahl",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamtbetrag ohne ..",
        clmDispatch : "Lieferschein Nr.",
        clmDateDispatch : "Datum",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmMulticode : "T.Code",
        clmBarcode : "Barcode",
        clmVatRate :".. %",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Preis der Untereinheit",
        clmSubFactor : "Faktor",
        clmPartiLot : "Losnummer",
    },
    pg_partiLot : 
    {
        title : "Chargennummer",
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
        title: "Positionsrabatt",
        chkFirstDiscount : "Ersten Positionsrabatt aktualisieren",
        chkDocDiscount : "Als Dokumentenrabatt anwenden",
        Percent1 : "1. Rabatt in Prozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in Prozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in Prozent",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentenrabatt",
        Percent1 : "1. Rabatt in Prozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in Prozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in Prozent",
        Price3 : "3. Rabattbetrag"
    },
    popPassword : 
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Sie können keinen Bestand eingeben, bevor die Dokumentkopfdaten ausgefüllt sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Sie können keinen Betrag eingeben, der größer als der offene Betrag ist!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Ihr Speichervorgang war erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Steuer wirklich auf Null setzen!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Sie können keinen Rabatt eingeben, der größer als der Betrag ist!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Sie können keinen Rabatt eingeben, der größer als der Betrag ist!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "Ok",
        msg: "Das Dokument wurde entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "Ok",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument ist gesperrt! Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen zu speichern!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument mit Zahlung kann nicht gelöscht werden!" 
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Vorgänge durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Der Rabatt darf den Betrag nicht überschreiten!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Artikel nicht gefunden!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Kunde nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    popCash : 
    {
        title: "Bargeldeingang",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeingang",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Banküberweisung",
        btnApprove : "Hinzufügen"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    msgUnit:
    {
        title: "Auswahleinheit",
        btn01: "Bestätigen",
    },
    validRef :"Serie darf nicht leer sein",
    validRefNo : "Folge darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmMulticode : "LIEFERANTENNUMMER",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge eingeben"
    },
    cmbPayType : {
        title : "Zahlungsart",
        cash : "Bargeld",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Zahlung",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge 2",
        margin : "Marge"
    },
    popUnit2 : 
    {
        title : "Einheitendetails"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Anzahl"
    },
    pg_adress : 
    {
        title : "Adressauswahl",
        clmAdress : "ADRESSE",
        clmCiyt : "STADT",
        clmZipcode : "POSTLEITZAHL",
        clmCountry : "LAND",
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    pg_proformaGrid : 
    {
        title : "Proforma-Auswahl",
        clmReferans : "Serie - Nummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Anzahl",
        clmPrice : "Preis",
        clmTotal : "Gesamtsumme"
    },
    popMailSend : 
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail-Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" // 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
        msgFailed: "E-Mail konnte nicht gesendet werden!"
    },
    popRound : 
    {
        title : "Bitte geben Sie den Betrag ein, den Sie runden möchten",
        total : "Summe",
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "OK",
        msg1: "Der Unterschied zwischen den Beträgen, die Sie runden möchten, darf höchstens ",
        msg2: " betragen!"
    },
    msgDiscountEntry : 
    {
        title : "Rabattbetrag eingeben",
        btn01 : "Bestätigen"
    },
    txtDiscount1 : "1. Rabattbetrag",
    txtDiscount2 : "2. Rabattbetrag",
    txtDiscount3 : "3. Rabattbetrag",
    txtTotalDiscount :"Gesamtrabattbetrag",
    msgDiscountPerEntry : 
    {
        title : "Prozentualen Rabatt eingeben",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "1. Rabattprozentsatz",
    txtDiscountPer2 : "2. Rabattprozentsatz",
    txtDiscountPer3 : "3. Rabattprozentsatz",
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
        msg: "Kein Code gefunden!"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenelement hinzufügen",
        btnApprove: "Elemente Suchen",
        btnClear : "Löschen",
        btnSpeichern : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmethode",
        customerCode : "Nach Lieferantencode",
        ItemCode : "Nach Artikelcode"
    },
    grdMultiItem : 
    {
        clmCode : "Artikelcode",
        clmMulticode : "Lieferantencode",
        clmName : "Artikelname",
        clmQuantity : "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alle hinzufügen",
        btn02: "Neue Einträge zur Liste hinzufügen",
        msg: "Es gibt Elemente in der Liste! "
    },
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein",
    msgPrintforLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument kann nicht gedruckt werden, solange es gesperrt ist!"
    },
    msgCustomerLock: 
    {
        title: "Achtung", //
        btn01: "OK", //
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" //
    },
}
export default ftr_02_003
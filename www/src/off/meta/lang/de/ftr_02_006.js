// "Fiyat Farkı Alış Faturası"
const ftr_02_006 =
{
    txtRefRefno: "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode: "Kundennummer",
    txtCustomerName: "Kundenname",
    dtDocDate: "Datum",
    txtAmount: "Betrag",
    txtDiscount: "Zeilenrabatt",
    txtDocDiscount: "Dokumentrabatt",
    txtSubTotal: "Zwischensumme",
    txtMargin: "Marge",
    txtVat: "..",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Lieferdatum",
    getContract: "Einkaufsrechnung auswählen",
    getPayment: "Zahlungseingang erfassen",
    cash: "Betrag",
    description: "Beschreibung",
    checkReference: "Referenz",
    btnCash: "Zahlung hinzufügen",
    btnCheck: "Scheck",
    btnBank: "Überweisung",
    cmbCashSafe: "Kassenauswahl",
    cmbCheckSafe: "Scheckkassse",
    cmbBank: "Bankauswahl",
    txtPayInvoiceTotal: "Rechnungsbetrag",
    txtPayTotal: "Gesamtzahlung",
    txtRemainder: "Restbetrag",
    txtBarcode: "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity: "Menge",
    tabTitleSubtotal: "Rechnungssumme",
    tabTitlePayments: "Dokumentzahlungsinformationen",
    tabTitleOldInvoices: "Alte Rechnungen",
    getRemainder: "Restbetrag Suchen",
    txtbalance: "Gesamtsaldo",
    getProforma: "Proforma Suchen",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee: "Verzugsgebühr",
    dtExpDate: "Fälligkeitsdatum",
    txtTotalHt: "Rabattierter Betrag",
    txtDocNo: "Dokumentnummer",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte füllen Sie dieses Feld aus.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",

    pg_Docs: 
    {
        title: "Dokumentenauswahl",
        clmDate: "DATUM",
        clmRef: "Serie",
        clmRefNo: "NUMMER",
        clmOutputName: "KUNDENNAME",
        clmOutputCode: "KUNDENNUMMER",
        clmTotal : "TOTAL"
    },
    pg_txtCustomerCode: 
    {
        title: "Kundenauswahl",
        clmCode: "KUNDENNUMMER",
        clmTitle: "KUNDENNAME",
        clmTypeName: "TYP",
        clmGenusName: "ART"
    },
    pg_txtItemsCode: 
    {
        title: "Artikelauswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
        clmPrice: "VERKAUFSPREIS"
    },
    pg_contractGrid: 
    {
        title: "Rechnungsauswahl",
        clmReferans: "Seriennummer",
        clmDocDate: "Dokumentdatum",
        clmTotal: "Betrag"
    },
    grdDiffInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity: "Anzahl",
        clmDiscount: "Rabatt",
        clmDiscountRate: "Rabatt %",
        clmVat: "..",
        clmAmount: "Betrag",
        clmTotal: "Gesamt",
        clmTotalHt: "Nettobetrag",
        clmCreateDate: "Erstellungsdatum",
        clmInvNo: "Rechnungsnummer",
        clmInvDate: "Rechnungsdatum",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer",
        clmMulticode: "T-Code",
        clmCustomerPrice: "Kundenpreis",
        clmPurcPrice: "Rechnungspreis",
        clmVatRate: ".. %"
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
    popDiscount: 
    {
        title: "Zeilenrabatt",
        chkFirstDiscount: "Ersten Rabatt in der Zeile aktualisieren",
        chkDocDiscount: "Als Dokumentrabatt anwenden",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag"
    },
    popDocDiscount: 
    {
        title: "Dokumentrabatt",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag"
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
        btn01: "OK",
        msg: "Sie können keinen Bestand erfassen, bevor die Dokumentkopfdaten vervollständigt sind!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag speichern möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Fehler beim Speichern Ihres Eintrags!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Steuer wirklich auf Null setzen?"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Einnahmen eingegeben werden, die den ausstehenden Betrag übersteigen!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der höher als der Betrag ist!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der höher als der Betrag ist!"
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
        msg: "Das Dokument wurde entsperrt!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Änderungen und Speichern nur mit dem Administratorpasswort möglich!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein Dokument mit einer getätigten Zahlung kann nicht gelöscht werden!"
    },
    isMsgSave: {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Vorgang kann nicht ohne Speicherung des Dokuments durchgeführt werden!"
    },
    msgMailSendResult: {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail-Versand erfolgreich !",
        msgFailed: "E-Mail-Versand fehlgeschlagen !"
    },        
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Vorgänge durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabatt darf den Betrag nicht überschreiten!"
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
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Der zu hinzufügende Artikel ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    popCash : 
    {
        title: "Bargeldzahlung",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckzahlung",
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
        lang : "Sprache des Dokuments"
    },
    msgUnit:
    {
        title: "Auswahleinheit",
        btn01: "Bestätigen",
    },
    validRef :"Die Serie darf nicht leer sein",
    validRefNo : "Die Nummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
        clmMulticode : "Lieferantennummer",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Geben Sie die Menge ein"
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
    pg_proformaGrid : 
    {
        title : "Proforma-Auswahl",
        clmReferans : "Serie - Nummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Gesamtbetrag"
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
    popRound : 
    {
        title : "Geben Sie den zu rundenden Betrag ein",
        total : "Betrag",
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "OK",
        msg1: "Der Unterschied zwischen den zu rundenden Beträgen darf höchstens ",
        msg2: " betragen!"
    },
    msgDiscountEntry : 
    {
        title : "Eingabe des Rabattbetrags",
        btn01 : "Bestätigen"
    },
    txtDiscount1 : "1. ",
    txtDiscount2 : "2. ",
    txtDiscount3 : "3. ",
    tTotalDiscount :"Gesamtrabattbetrag",
    msgDiscountPerEntry : 
    {
        title : "Prozentuale Rabatteingabe",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "Rabattsatz 1",
    txtDiscountPer2 : "Rabattsatz 2",
    txtDiscountPer3 : "Rabattsatz 3",
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
        msg: "Hinzugefügte Artikelmenge"
    },
    popMultiItem:
    {
        title: "Massenhinzufügung von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear : "Löschen",
        btnSpeichern : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmethode",
        customerCode : "Nach Lieferantencode suchen",
        ItemCode : "Nach Artikelcode suchen"
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
        btn01: "Liste löschen und alles hinzufügen",
        btn02: "Neu geschriebene zur Liste hinzufügen",
        msg: "Es gibt Artikel in der Liste!"
    },
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein",
    msgCustomerLock: {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Kunde kann nach Hinzufügen des Produkts nicht mehr geändert werden !"
    },        
    popMailSend: {
        title: "E-Mail senden",
        txtMailSubject: "Betreff der E-Mail",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress : "Gesendete Mailadresse" // 
    }
}
export default ftr_02_006
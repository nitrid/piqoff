// "Şube Satış Faturası"
const ftr_04_005 =
{
    txtRefRefno : "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Positionsrabatt",
    txtDocDiscount : "Dokumentenrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "..",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getDispatch : "Lieferschein Suchen",
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
    txtPayTotal : "Gesamtbetrag",
    txtRemainder : "Restbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellung Suchen",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungen",
    tabTitleOldInvoices : "Alte Rechnungen",
    getRemainder : "Restbetrag Suchen",
    txtBalance : "Gesamtguthaben",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum", 
    txtTotalHt : "Rabattierter Betrag",
    txtDocNo : "Belg No",
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
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "NUMMER",
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
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferenz : "Serie - Nummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
    },
    grdSlsInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Nettobetrag",
        clmDispatch : "Lieferschein-Nr.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmVatRate : ".. %",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Untereinheitspreis",
        clmSubFactor : "Faktor",
    },
    pg_partiLot : 
    {
        title : "Chargenauswahl",
        clmLotCode : "Chargennummer",
        clmSkt : "DLC",
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
        chkFirstDiscount : "Ersten Rabatt in Positionen aktualisieren",
        chkDocDiscount : "Als Dokumentenrabatt anwenden",
        Percent1 : "1. Rabatt Prozentsatz",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt Prozentsatz",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt Prozentsatz",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentenrabatt",
        Percent1 : "1. Rabatt Prozentsatz",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt Prozentsatz",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt Prozentsatz",
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
        btn01: "OK",
        msg: "Die Kopfdaten des Dokuments müssen ausgefüllt sein, bevor Artikel hinzugefügt werden können!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen eingegeben werden, die den Restbetrag überschreiten!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Aufzeichnung speichern?"
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
        msg: "Möchten Sie den Eintrag löschen?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer auf null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Rabatte über dem Betrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Rabatte über dem Betrag gewährt werden!"
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
        msg: "Das Dokument wurde entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen vorzunehmen!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument mit Zahlungen kann nicht gelöscht werden!"
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
        msg: "Rabatt kann nicht höher als der Betrag sein!"
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
        msg: "Der hinzuzufügende Artikel ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte Kunden auswählen!"
    },
    popCash : 
    {
        title: "Barzahlung",
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
        lang : "Dokumentsprache"
    },
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Nicht gefundene Codes:"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenartikel hinzufügen",
        btnApprove: "Artikel Suchen",
        btnClear : "Leeren",
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
        btn02: "Neue hinzugefügte zur Liste",
        msg: "Es gibt Artikel in der Liste!"
    },
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    },
    validRef :"Seriennummer darf nicht leer sein",
    validRefNo : "Reihenfolge darf nicht leer sein",
    validDepot : "Bitte Lager auswählen",
    validCustomerCode : "Kundencode darf nicht leer sein",
    validDocDate : "Bitte Datum auswählen",
    tagItemCodePlaceholder: "Bitte die gewünschten Codes eingeben",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lagerbestand kann nicht negativ werden! Höchstmögliche Menge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "LAGERCODE",
        clmName : "LAGERNAME",
        clmMulticode : "LIEFERANTENCODE",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte Menge eingeben"
    },
    cmbPayType : {
        title : "Zahlungsart",
        cash : "Bar",
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
        quantity2: "Gesamtmenge 2. Einheit",
        margin : "Marge"
    },
    popUnit2 : 
    {
        title : "Einheitendetails"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Menge"
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
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default ftr_04_005
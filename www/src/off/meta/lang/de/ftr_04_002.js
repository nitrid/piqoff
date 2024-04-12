// "Proforma Satış Faturası"
const ftr_04_002 =
{
    txtRefRefno: "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode: "Kundennummer",
    txtCustomerName: "Kundenname",
    dtDocDate: "Datum",
    txtAmount: "Betrag",
    txtDiscount: "Positionsrabatt",
    txtDocDiscount: "Dokumentrabatt",
    txtSubTotal: "Zwischensumme",
    txtMargin: "Marge",
    txtVat: "..",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Lieferdatum",
    getDispatch: "Lieferschein Suchen",
    getPayment: "Zahlungseingang",
    cash: "Betrag",
    description: "Beschreibung",
    checkReference: "Referenz",
    btnCash: "Zahlung hinzufügen",
    btnCheck: "Scheck",
    btnBank: "Überweisung",
    cmbCashSafe: "Kasse auswählen",
    cmbCheckSafe: "Scheckkasse",
    cmbBank: "Bank auswählen",
    txtPayInvoiceTotal: "Rechnungsbetrag",
    txtPayTotal: "Gesamtzahlung",
    txtRemainder: "Restbetrag",
    txtBarcode: "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity: "Menge",
    getOrders: "Bestellungen Suchen",
    tabTitleSubtotal: "Rechnungssumme",
    tabTitlePayments: "Dokumentzahlungsinformationen",
    tabTitleOldInvoices: "Alte Rechnungen",
    getRemainder: "Restbetrag Suchen",
    txtbalance: "Gesamtguthaben",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtExpFee: "Verzugsgebühr",
    dtExpDate: "Fälligkeitsdatum",
    getOffers: "Angebote Suchen",
    txtTotalHt: "Rabattierter Betrag",
    txtDocNo: "Dokumentnummer",
    pg_Docs:
    {
        title: "Dokumentauswahl",
        clmDate: "DATUM",
        clmRef: "Serie",
        clmRefNo: "NUMMER",
        clmInputName: "KUNDENNAME",
        clmInputCode: "KUNDENNUMMER",
    },
    pg_txtCustomerCode:
    {
        title: "Kundenwahl",
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
    },
    pg_dispatchGrid:
    {
        title: "Lieferscheinauswahl",
        clmReferans: "Seriennummer",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmPrice: "Preis",
        clmTotal: "Betrag",
        clmDate: "Datum",
    },
    grdSlsInv:
    {
        clmItemCode: "Artikelnummer",
        clmItemName: "Artikelname",
        clmPrice: "Preis",
        clmQuantity: "Menge",
        clmDiscount: "Rabatt",
        clmDiscountRate: "Rabatt %",
        clmVat: "..",
        clmAmount: "Betrag",
        clmTotal: "Gesamtsumme",
        clmTotalHt: "Gesamtsumme (ohne ..)",
        clmDispatch: "Lieferschein-Nr.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin: "Marge",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer",
        clmVatRate: "..-Satz",
        clmSubQuantity: "Untereinheit",
        clmSubPrice: "Untereinheitspreis",
        clmSubFactor: "Faktor",
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
        title: "Rabatt für Zeile",
        chkFirstDiscount : "1. Rabatte in der Zeile aktualisieren",
        chkDocDiscount : "Als Dokumentrabatt anwenden",
        Percent1 : "1. Rabatt Prozentsatz",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt Prozentsatz",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt Prozentsatz",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentrabatt",
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
        msg: "Es können keine Lagerbestände eingegeben werden, bevor die Dokumentkopfdaten nicht ausgefüllt sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen über dem ausstehenden Betrag eingetragen werden!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihr Speichervorgang war erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
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
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Steuer zurücksetzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattbetrag größer als der Rechnungsbetrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattprozentsatz größer als der Rechnungsbetrag gewährt werden!"
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
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Administratorkennwort verwenden, um die Änderungen zu speichern und das Dokument zu entsperren!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein bezahltes Dokument kann nicht gelöscht werden!"
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
        msg: "Der Rabattbetrag darf nicht höher als der Rechnungsbetrag sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kein Bestand gefunden!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kein Kunde gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Das Artikel, das Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    popCash : 
    {
        title: "Bargeldeingabe",
        btnApprove : "Hinzufügen"
    },
    popCheck: 
    {
        title: "Scheckeingabe",
        btnApprove: "Hinzufügen"
    },
    popBank: 
    {
        title: "Überweisungseingabe",
        btnApprove: "Hinzufügen"
    },
    popDesign: 
    {
        title: "Designauswahl",
        design: "Design",
        lang: "Dokumentsprache"
    },
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Fehlende Codes:"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenhinzufügung von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear: "Löschen",
        btnSpeichern: "Zeilen hinzufügen",
    },
    cmbMultiItemType: 
    {
        title: "Suchmethode",
        customerCode: "Nach Lieferantencode suchen",
        ItemCode: "Nach Artikelcode suchen"
    },
    grdMultiItem: 
    {
        clmCode: "Artikelcode",
        clmMulticode: "Lieferantencode",
        clmName: "Artikelname",
        clmQuantity: "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alle hinzufügen",
        btn02: "Neu geschriebene hinzufügen",
        msg: "Es gibt Artikel in der Liste!"
    },
    msgUnit:
    {
        title: "Auswahleinheit",
        btn01: "Bestätigen",
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihennummer darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Die Kundenkennung darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die Codes ein, die Sie hinzufügen möchten",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lagermenge kann nicht negativ sein! Maximal zulässige Menge zum Hinzufügen:"
    },
    pg_txtBarcode: 
    {
        title: "Barcodeauswahl",
        clmCode: "LAGERCODE",
        clmName: "LAGERNAME",
        clmMulticode: "LIEFERANTENCODE",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    cmbPayType: {
        title: "Zahlungstyp",
        cash: "Bar",
        check: "Scheck",
        bankTransfer: "Banküberweisung",
        otoTransfer: "Automatische Überweisung",
        foodTicket: "Essensgutschein",
        bill: "Wechsel",
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge 2",
        margin: "Marge"
    },
    popUnit2: 
    {
        title: "Einheitendetails"
    },
    grdUnit2: 
    {
        clmName: "NAME",
        clmQuantity: "Menge"
    },
    pg_adress: 
    {
        title: "Adressauswahl",
        clmAdress: "ADRESSE",
        clmCity: "STADT",
        clmZipcode: "POSTLEITZAHL",
        clmCountry: "LAND",
    },
    msgCode:
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    pg_offersGrid: 
    {
        title: "Angebotsauswahl",
        clmReferans: "Seriennummer - Reihennummer",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmTotal: "Gesamtbetrag",
        clmPrice: "Preis",
    },
    serviceAdd: "Dienst hinzufügen",
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
export default ftr_04_002
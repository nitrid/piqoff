// "Şube Satış Faturası"
const ftr_02_005 = 
{
    txtRefRefno : "Seriennummer",
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
    getDispatch : "Lieferschein Suchen",
    getPayment : "Zahlungseingang",
    cash : "Betrag",
    description :"Beschreibung",
    checkReference : "Referenz",
    btnCash : "Zahlung hinzufügen",
    btnCheck : "Scheck",
    btnBank : "Banküberweisung",
    cmbCashSafe : "Kassenauswahl",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankauswahl",
    txtPayInvoiceTotal : "Rechnungsbetrag",
    txtPayTotal : "Gesamtzahlung",
    txtRemainder : "Restbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellung Suchen",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungsinformationen",
    tabTitleOldInvoices : "Alte Rechnungen",
    getRemainder : "Restbetrag Suchen",
    txtbalance : "Gesamtsaldo",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum", 
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    placeMailHtmlEditor : "Geben Sie einen Text für Ihre E-Mail ein.",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte füllen Sie das Feld aus.",
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "Seriennummer",
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
        clmReferans : "Seriennummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo: "Dokumentnummer"
    },
    grdSlsInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabattsatz",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamtbetrag (ohne. ..)",
        clmDispatch : "Lieferschein-Nr.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmVatRate : "..-Satz",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Preis pro Untereinheit",
        clmSubFactor : "Faktor",
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
        chkFirstDiscount : "Erste Rabatte in der Zeile aktualisieren",
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
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen.",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Dokumentenstammdaten müssen vervollständigt werden, bevor Lagerbestände erfasst werden können!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Zahlungen erfasst werden, die den offenen Betrag überschreiten!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Ihre Daten wurden erfolgreich gespeichert!",
        msgFailed: "Fehler beim Speichern der Daten!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die Steuer auf Null setzen möchten?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es kann kein Rabattbetrag größer als der Gesamtbetrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es kann kein Rabattprozentsatz größer als der Gesamtbetrag gewährt werden!"
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
        msg: "Das Dokument wurde erfolgreich entsperrt!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "Ok",
        msg: "Das eingegebene Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument ist gesperrt! Um Änderungen vorzunehmen, müssen Sie es mit dem Administratorpasswort entsperren!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Ein bezahltes Dokument kann nicht gelöscht werden!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Aktionen auf das Dokument angewendet werden, solange es gesperrt ist!"
    },
    isMsgSave: {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Vorgang kann nicht ohne Speicherung des Dokuments durchgeführt werden!"
    },     
    msgDiscount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Der Rabattbetrag kann nicht größer als der Gesamtbetrag sein!"
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
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    popCash : 
    {
        title: "Bargeldeingabe",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeingabe",
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
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Nicht gefundene Codes:"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenhinzufügung von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear : "Leeren",
        btnSpeichern : "Zeilen hinzufügen",
    },
    cmbMultiItemType:
    {
        title: "Suchart",
        customerCode: "Nach Kundencode",
        ItemCode: "Nach Artikelcode"
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
        btn02: "Neu geschriebene zur Liste hinzufügen",
        msg: "Es gibt Artikel in der Liste!"
    },
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    },
    validRef: "Seriennummer darf nicht leer sein",
    validRefNo: "Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Kundencode darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein, um sie hinzuzufügen",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Lagerbestand kann nicht negativ sein! Höchstmögliche Menge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcodeauswahl",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
        clmMulticode: "Lieferantencode",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    cmbPayType:
    {
        title: "Zahlungstyp",
        cash: "Barzahlung",
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
        clmName: "Name",
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
    popMailSend:
    {
        title: "E-Mail senden",
        txtMailSubject: "E-Mail-Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress : "Gesendete Mailadresse" // 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "Fehler beim Senden der E-Mail!"
    },
    popMailSend:
    {
        title: "E-Mail senden",
        txtMailSubject: "E-Mail-Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress : "Gesendete Mailadresse" // 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "Fehler beim Senden der E-Mail!"
    },
    popRound:
    {
        title: "Bitte geben Sie den zu rundenden Betrag ein",
        total: "Gesamtbetrag",
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "OK",
        msg1: "Der Unterschied zwischen den abgerundeten Beträgen darf maximal ",
        msg2: " betragen!"
    },
    msgDiscountEntry:
    {
        title: "Eingabe des Mengenrabatts",
        btn01: "Bestätigen"
    },
    txtDiscount1: "1. Rabattbetrag",
    txtDiscount2: "2. Rabattbetrag",
    txtDiscount3: "3. Rabattbetrag",
    txtTotalDiscount: "Gesamtrabattbetrag",
    msgDiscountPerEntry:
    {
        title: "Eingabe des prozentualen Rabatts",
        btn01: "Bestätigen"
    },
    txtDiscountPer1: "1. Rabattprozentsatz",
    txtDiscountPer2: "2. Rabattprozentsatz",
    txtDiscountPer3: "3. Rabattprozentsatz",
    serviceAdd: "Dienstleistung hinzufügen",
    pg_service:
    {
        title: "Dienstleistungen",
        clmCode: "Code",
        clmName: "Name"
    },
    txtTotalHt: "Rabattierter Betrag",
    txtDocNo: "Dokumentennummer",
    msgPrintforLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument kann nicht gedruckt werden, solange es gesperrt ist!"
    },
    msgCustomerLock: 
    {
        title: "Achtung", //
        btn01: "OK", //
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" //
    },
}
export default ftr_02_005
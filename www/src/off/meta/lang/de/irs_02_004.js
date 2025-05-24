// Şube Satış İrsaliyesi"
const irs_02_004 =
{
    txtRefRefno : "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Dokumentrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellungen Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    placeMailen: "Text",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte geben Sie eine E-Mail-Adresse ein.",
    txtTotalHt : "Gesamtmenge mit Rabatt",
    txtDocNo : "Dokumentnummer",
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
    grdSlsDispatch: 
    {
        clmItemCode: "Artikelcode",
        clmItemName: "Artikelname",
        clmPrice: "Preis",
        clmQuantity : "Anzahl",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabattsatz",
        clmVat : "MwSt.",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamtsumme (ohne MwSt.)",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmOrder : "Bestellnummer",
        clmCuser :"Benutzer",
        clmBarcode : "Barcode",
        clmVatRate : "MwSt.-Satz",
        clmOrigin : "Herkunft",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Untereinheitspreis",
        clmSubFactor : "Faktor",
        clmPartiLot : "Losnummer",
    },
    pg_partiLot : 
    {
        title : "Chargennummer",
    },
    popDiscount : 
    {
        title: "Zeilenrabatt",
        chkFirstDiscount : "1. Rabatt auf Positionen aktualisieren",
        chkDocDiscount : "Als Dokumentrabatt anwenden",
        Percent1 : "1. Rabatt (%)",
        Price1 : "1. Rabatt (Betrag)",
        Percent2 : "2. Rabatt (%)",
        Price2 : "2. Rabatt (Betrag)",
        Percent3 : "3. Rabatt (%)",
        Price3 : "3. Rabatt (Betrag)"
    },
    popDocDiscount : 
    {
        title: "Dokumentrabatt",
        Percent1: "1. Rabatt Proz.",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt Proz.",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt Proz.",
        Price3: "3. Rabattbetrag"
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
        msg: "Es können keine Bestände erfasst werden, bevor die Dokumenteninformationen ausgefüllt sind!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Änderungen speichern?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Der Speichervorgang war erfolgreich!",
        msgFailed: "Der Speichervorgang ist fehlgeschlagen!"
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
        msg: "Möchten Sie den Datensatz wirklich löschen?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer auf Null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattbetrag größer als der Gesamtbetrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattbetrag größer als der Gesamtbetrag gewährt werden!"
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
        msg: "Das Passwort ist falsch!"
    },
    msgLockedType2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument kann nicht entsperrt werden, da es in eine Rechnung umgewandelt wurde."
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen vorzunehmen!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Änderungen am Dokument vorgenommen werden, solange es gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Warnung",
        btn01: "OK",
        msg: "Der Rabattbetrag kann nicht größer als der Gesamtbetrag sein!"
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
    msgUnderPrice1:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sie verkaufen zu einem Preis, der unter den Kosten liegt!"
    },
    msgUnderPrice2:
    {
        title: "Warnung",
        btn01: "OK",
        msg: "Der Verkaufspreis darf nicht unter dem Einkaufspreis liegen!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Das Artikel, das Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
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
        title: "Massenhinzufügung von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear: "Löschen",
        btnSpeichern: "Zeilen hinzufügen",
    },
    cmbMultiItemType:
    {
        title: "Suchmethode",
        customerCode: "Nach Lieferantennummer",
        ItemCode: "Nach Artikelcode"
    },
    grdMultiItem:
    {
        clmCode: "Artikelcode",
        clmMulticode: "Lieferantennummer",
        clmName: "Artikelname",
        clmQuantity: "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alle hinzufügen",
        btn02: "Neue hinzufügen",
        msg: "Die Liste enthält bereits Artikel!"
    },
    msgUnit:
    {
        title: "Auswahl der Einheit",
        btn01: "Bestätigen",
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Die Kundennummer darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die Codes ein, die Sie hinzufügen möchten",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Lagerbestandsvolumen darf nicht negativ sein! Höchstmögliche Menge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "Lagercode",
        clmName: "Lagername",
        clmMulticode: "Lieferantennummer",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie den Kunden aus!"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde bereits in eine Rechnung umgewandelt. Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete :
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete : 
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument enthält umgewandelte Zeilen in eine Rechnung. Das Dokument kann nicht gelöscht werden!"
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
    popMailSend : 
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail Betreff",
        txtSendMail : "E-Mail Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "E-Mail senden fehlgeschlagen!"
    },
    msgDiscountEntry : 
    {
        title : "Eingabe des Rabattbetrags",
        btn01 : "Bestätigen"
    },
    txtDiscount1 : "1. Rabattbetrag",
    txtDiscount2 : "2. Rabattbetrag",
    txtDiscount3 : "3. Rabattbetrag",
    txtTotalDiscount :"Gesamtrabattbetrag",
    msgDiscountPerEntry : 
    {
        title : "Eingabe des prozentualen Rabatts",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "1. Rabattprozentsatz",
    txtDiscountPer2 : "2. Rabattprozentsatz",
    txtDiscountPer3 : "3. Rabattprozentsatz",
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default irs_02_004
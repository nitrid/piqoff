// "İade İrsaliyesi"
const irs_02_003 =
{
    getRebate : "Von Rückgabe-Depot Suchen",
    txtRefRefno : "Seriennummer",
    cmbDepot: "Depot",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Positionsrabatt",
    txtDocDiscount : "Dokumentrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    placeMailen: "Text",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte füllen Sie das Feld aus.",
    txtTotalHt : "Reduzierter Betrag",
    txtUnitPrice: "Einheitspreis",
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
        title : "Kundenwahl",
        clmCode :  "KUNDENNUMMER",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode : 
    {
        title : "Artikelwahl",
        clmCode :  "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmPrice : "EINKAUFSPREIS"
    },
    pg_RebateGrid : 
    {
        title : "Rückgabe-Artikelwahl",
        clmCode :  "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmQuantity :"MENGE"
    },
    pg_dispatchGrid :
    {
        title : "Lieferschein-Auswahl",
        clmReferans : "Serie - Nummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo : "Dokumentennummer"
    },
    grdRebtDispatch: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Stückzahl",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabattsatz",
        clmVat : "MwSt.",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmTotalHt : "Nettobetrag",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmMulticode : "T.Code",
        clmBarcode : "Barcode",
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
        chkFirstDiscount: "Aktualisieren Sie den ersten Rabatt in der Zeile",
        chkDocDiscount: "Als Dokumentenrabatt anwenden",
        Percent1: "1. Rabatt in Prozent",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt in Prozent",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt in Prozent",
        Price3: "3. Rabattbetrag"
    },
    popDocDiscount:
    {
        title: "Dokumentenrabatt",
        Percent1: "1. Rabatt in Prozent",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt in Prozent",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt in Prozent",
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
        msg: "Es können keine Bestände erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
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
        msg: "Sind Sie sicher, dass Sie die Steuer auf Null setzen möchten?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattbetrag größer als der Betrag selbst gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattprozentsatz größer als der Betrag selbst gewährt werden!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSuccess:
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Das Dokument wurde entsperrt!"
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgLockedType2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die Sperre eines in eine Rechnung umgewandelten Dokuments kann nicht aufgehoben werden."
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument ist gesperrt! \n Sie müssen das Administratorpasswort eingeben, um die Änderungen zu speichern und das Dokument zu entsperren!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Aktion nicht möglich! Das Dokument ist gesperrt!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabatt darf nicht höher als der Betrag sein!"
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
        msg: "Sie verkaufen unter dem Stückpreis!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Verkaufspreis darf nicht niedriger sein als der Einkaufspreis!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Verbinden",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    msgUnit:
    {
        title: "Auswahl der Einheit",
        btn01: "Bestätigen",
    },
    validRef :"Die Serie darf nicht leer sein",
    validRefNo : "Die Nummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Bitte wählen Sie ein Datum",
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
        clmMulticode : "Lieferantencode",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde bereits in eine Rechnung umgewandelt. Sie können keine Änderungen mehr vornehmen!"
    },
    msgRowNotDelete :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde bereits in eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete : 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument enthält Zeilen, die bereits in eine Rechnung umgewandelt wurden. Es kann nicht gelöscht werden!"
    },
    pg_adress : 
    {
        title : "Adressauswahl",
        clmAdress : "Adresse",
        clmCity : "Stadt",
        clmZipcode : "Postleitzahl",
        clmCountry : "Land",
    },
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Der ausgewählte Artikel ist nicht beim Kunden hinterlegt! Möchten Sie den Vorgang fortsetzen?"
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
        txtMailSubject : "Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "E-Mail konnte nicht gesendet werden!"
    },
    msgDiscountEntry : 
    {
        title : "Eingabe des Rabattbetrags",
        btn01 : "Bestätigen"
    },
    txtDiscount1 : "Rabatt 1",
    txtDiscount2 : "Rabatt 2",
    txtDiscount3 : "Rabatt 3",
    txtTotalDiscount :"Gesamtrabatt",
    msgDiscountPerEntry : 
    {
        title : "Prozentuale Rabatteingabe",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "Rabatt 1",
    txtDiscountPer2 : "Rabatt 2",
    txtDiscountPer3 : "Rabatt 3",
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default irs_02_003
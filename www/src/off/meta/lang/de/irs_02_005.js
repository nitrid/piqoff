// "İade Alış İrsaliyesi"
const irs_02_005 = 
{
    getRebate: "Rückgabe aus dem Lager Suchen",
    txtRefRefno: "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode: "Kundennummer",
    txtCustomerName: "Kundenname",
    dtDocDate: "Datum",
    txtAmount: "Betrag",
    txtDiscount: "Positionsrabatt",
    txtDocDiscount: "Dokumentenrabatt",
    txtSubTotal: "Zwischensumme",
    txtMargin: "Marge",
    txtVat: "MwSt.",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Versanddatum",
    txtBarcode: "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity: "Menge",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtTotalHt: "Gesamt ohne Steuern",
    pg_Docs: 
    {
        title: "Dokumentauswahl",
        clmDate: "DATUM",
        clmRef: "Serie",
        clmRefNo: "NUMMER",
        clmOutputName: "KUNDENNAME",
        clmOutputCode: "KUNDENNUMMER",
    },
    pg_txtCustomerCode: 
    {
        title: "Kundenwahl",
        clmCode: "KUNDENNUMMER",
        clmTitle: "KUNDENNAME",
        clmTypeName: "TYP",
        clmGenusName: "ART",
    },
    pg_txtItemsCode: 
    {
        title: "Artikelauswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
        clmMulticode : "MULTICODE",
        clmPrice: "VERKAUFSPREIS",
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Seriennummer-Folge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo: "Dokumentnummer"
    },
    pg_RebateGrid: 
    {
        title: "Rückgabeartikelauswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
        clmQuantity: "MENGE",
    },
    grdRebtDispatch: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity: "Anzahl",
        clmDiscount: "Rabatt",
        clmDiscountRate: "Rabatt %",
        clmVat: "MwSt.",
        clmAmount: "Betrag",
        clmTotal: "Gesamt",
        clmTotalHt: "Gesamt ohne MwSt.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin: "Marge",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer",
        clmMulticode: "Mehrfachcode",
        clmBarcode: "Barcode",
        clmSubQuantity: "Untereinheit",
        clmSubPrice: "Untereinheitspreis",
        clmSubFactor: "Faktor",
    },
    popDiscount: 
    {
        title: "Positionsrabatt",
        chkFirstDiscount: "Ersten Rabatt in der Position aktualisieren",
        chkDocDiscount: "Als Dokumentenrabatt anwenden",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag",
    },
    popDocDiscount: 
    {
        title: "Dokumentenrabatt",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag",
    },
    popPassword: 
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password: "Passwort",
        btnApprove: "Bestätigen",
    },
    msgDocValid: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel können nicht erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!",
    },
    msgSpeichern: 
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?",
    },
    msgSpeichernResult: 
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihr Speichervorgang war erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!",
    },
    msgSpeichernValid: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!",
    },
    msgDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?",
    },
    msgVatDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer auf Null setzen?",
    },
    msgDiscountPrice: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag kann nicht höher als der Betrag sein!",
    },
    msgDiscountPercent: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattprozentsatz kann nicht höher als der Betrag sein!",
    },
    msgLocked: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument wurde gespeichert und gesperrt!",
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
        msg: "Das Passwort ist falsch!",
    },
    msgLockedType2: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument kann nicht entsperrt werden, da es in eine Rechnung umgewandelt wurde.",
    },
    msgGetLocked: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen zu speichern, müssen Sie das Administratorpasswort verwenden, um das Dokument zu entsperren!",
    },
    msgDocLocked: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument muss entsperrt sein, bevor Änderungen vorgenommen werden können!",
    },
    msgDiscount: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag kann nicht höher als der Betrag sein!",
    },
    msgItemNotFound: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!",
    },
    msgNotCustomer: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!",
    },
    msgUnderPrice1: 
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sie verkaufen zu einem Preis unter den Kosten!",
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kann nicht unter dem Einkaufspreis verkauft werden!"
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
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    },
    validRef: "Seriennummer darf nicht leer sein",
    validRefNo: "Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Kundenkennung darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
        clmMulticode: "LIEFERANTENKODE",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg:"Menge eingeben"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt. Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "In Ihrem Dokument befinden sich umgewandelte Rechnungszeilen. Dieses Dokument kann nicht gelöscht werden!"
    },
    pg_adress:
    {
        title: "Adressauswahl",
        clmAdress: "ADRESSE",
        clmCiyt: "STADT",
        clmZipcode: "POSTLEITZAHL",
        clmCountry: "LAND",
    },
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Der ausgewälte Artikel ist nicht beim Kunden hinterlegt! Möchten Sie den Vorgang fortsetzen?"
    },
    msgCode:
    {
        title: "Achtung",
        btn01: "Zum Dokument",
        msg: "Dokument gefunden"
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
    txtDiscountPer1: "1. Rabattprozent",
    txtDiscountPer2: "2. Rabattprozent",
    txtDiscountPer3: "3. Rabattprozent",
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default irs_02_005
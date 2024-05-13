// Sayım Evrakı
const stk_02_001 = 
{
    txtRefRefno: "Seriennummer",
    cmbDepot: "Artikellager",
    dtDocDate: "Datum",
    txtBarcode: "Barcode hinzufügen",
    txtQuantity: "Menge",
    validDesign : "Bitte Design auswählen",
    txtAmount: "Gesamtwert",
    pg_Docs:
    {
        title: "Dokumentenauswahl",
        clmDate: "Datum",
        clmRef: "Serie",
        clmRefNo: "Nummer",
        clmDocDate: "Datum",
        clmDepotName: "Lager",
        clmQuantity: "GesamtArtikelmenge",
        clmTotalLine: "Zeilenanzahl",
    },
    pg_txtItemsCode:
    {
        title: "Artikelauswahl",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
    },
    grdItemCount:
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity: "Menge",
        clmCreateDate: "Erstellungsdatum",
        clmDescription: "Beschreibung",
        clmCostPrice: "Stückpreis",
        clmTotalCost: "Gesamtkosten",
        clmCustomerName: "Lieferantenkonto",
        clmMulticode: "Lieferanten-Code",
        clmBarcode: "Barcode",
        clmCuser: "Benutzer",
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
        msg: "Sie können keinen Artikel eingeben, ohne die Dokumentenstammdaten abzuschließen!",
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Datensatz speichern?",
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Bitte Menge eingeben!"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Fehler beim Speichern Ihres Eintrags!",
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!",
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag löschen?"
    },
    msgBigQuantity:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Die eingegebene Menge ist größer als 1000. Möchten Sie den Vorgang fortsetzen?"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument wurde gespeichert und gesperrt!"
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
        msg: "Falsches Passwort!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Änderungen vorzunehmen und zu speichern nur mit Administratorpasswort möglich!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen auf einem gesperrten Dokument durchgeführt werden!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Ändern",
        btn03: "Abbrechen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    validRef :"Seriennummer darf nicht leer sein",
    validRefNo : "Nummer darf nicht leer sein",
    validDepot : "Sie müssen einen Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Bitte wählen Sie ein Datum",
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
        clmMulticode : "Lieferantennummer",
        clmBarcode : "Barcode"
    },
    msgCode :
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
}
export default stk_02_001
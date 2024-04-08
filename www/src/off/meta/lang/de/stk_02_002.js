// Depo/Mağaza Arası Sevk
const stk_02_002 = 
{
    txtRefRefno : "Seriennummer-Reihenfolge",
    cmbOutDepot: "Ausgangsdepot",
    cmbInDepot: "Eingangsdepot",
    dtDocDate : "Datum",
    txtBarcode : "Barcode hinzufügen",
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "REIHENFOLGE",
        clmDocDate : "DATUM",
        clmInputName : "EINGANG",
        clmOutputName : "AUSGANG",
    },
    pg_txtItemsCode : 
    {
        title : "Artikelauswahl",
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
    },
    grdTrnsfItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Menge",
        clmCreateDate: "Erstellungsdatum",
        clmDescription :"Beschreibung",
        clmCuser : "Benutzer"
    },
    popPassword : 
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu entsperren",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keine Bestände hinzufügen, solange die Dokumentkopfdaten unvollständig sind!"
    },
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die Lagermenge kann nicht negativ sein! Höchstmenge, die hinzugefügt werden kann:"
    },
    msgDblDepot:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Eingangs- und Ausgangsdepot können nicht identisch sein!"
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
        msgSuccess: "Ihr Transfer wurde erfolgreich durchgeführt und gespeichert!",
        msgFailed: "Fehler beim Speichern des Transfers!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag löschen?"
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
        msg: "Dokument gesperrt! \n Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen zu speichern!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang nicht möglich, solange das Dokument nicht entsperrt ist!"
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
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Sprache des Dokuments"
    },
    pg_txtBarcode : 
    {
        title : "Barcodeauswahl",
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
        clmMulticode : "Lieferantennummer",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Menge eingeben!"
    },
    txtQuantity : "Menge",
}
export default stk_02_002
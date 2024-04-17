// İade Ürünü Toplama
const stk_02_005 = 
{
    txtRefRefno : "Seriennummer",
    cmbDepot1: "Ausgangsdepot",
    cmbDepot2: "Rücknahme-Depot",
    dtDocDate : "Datum",
    getRebate :"Rücknahmen vom ausgewählten Depot Suchen",
    txtBarcode : "Barcode hinzufügen",
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "NUMMER",
        clmDocDate : "DATUM",
        clmInputName : "EINGANG",
        clmOutputName : "AUSGANG",
    },
    pg_txtItemsCode : 
    {
        title : "Artikelauswahl",
        clmCode :  "Artikelcode",
        clmName : "Artikelname",
    },
    grdRebItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Menge",
        clmCreateDate: "Erstellungsdatum",
        clmDescription :"Beschreibung",
        clmCuser : "Benutzer"
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
        msg: "Es können keine Bestände erfasst werden, solange die Dokumentenüberschrift nicht vollständig ist!"
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
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!"
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
        msg: "Möchten Sie den Eintrag wirklich löschen?"
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
        title: "Fehler",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen vorzunehmen, müssen Sie es mit dem Administratorpasswort entsperren!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument gesperrt ist!"
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
    validRef: "Seriennummer darf nicht leer sein",
    validRefNo: "Folgenummer darf nicht leer sein",
    validDepot: "Wählen Sie ein Lager aus",
    validCustomerCode: "Kundennummer darf nicht leer sein",
    validDocDate: "Wählen Sie ein Datum aus",
    popDesign:
    {
        title: "Designauswahl",
        design: "Design",
        lang: "Dokumentsprache"
    },
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die Lagermenge kann nicht negativ sein! Höchstmenge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "Artikelnummer",
        clmName: "Artikelname",
        clmMulticode: "Lieferantencode",
        clmBarcode: "Barcode"
    },
    msgCode:
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Menge eingeben!"
    },
    txtQuantity: "Menge",
}
export default stk_02_005
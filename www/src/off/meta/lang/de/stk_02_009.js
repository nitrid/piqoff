// Ürün Çıkış Fişi
const stk_02_009 = 
{
    txtRefRefno: "Seriennummer-Reihenfolge",
    cmbOutDepot: "Ausgangslager",
    dtDocDate: "Datum",
    txtBarcode: "Barcode hinzufügen",
    getDispatch: "Lieferschein hinzufügen",
    txtTotalCost: "Gesamtkosten",
    txtTotalQuantity: "Gesamtmenge",
    pg_Docs:
    {
        title: "Dokumentauswahl",
        clmDate: "DATUM",
        clmRef: "Serie",
        clmRefNo: "REIHENFOLGE",
        clmDocDate: "DATUM",
        clmInputName: "EINGABE",
        clmOutputName: "AUSGABE",
    },
    pg_txtItemsCode:
    {
        title: "Artikelauswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
    },
    grdOutwasItems:
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity: "Anzahl",
        clmCreateDate: "Erstellungsdatum",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer"
    },
    pg_dispatchGrid:
    {
        title: "Lieferscheinauswahl",
        clmReferans: "Seriennummer-Reihenfolge",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Anzahl",
        clmCustomer: "Kunde",
        clmDate: "Datum",
    },
    popPassword:
    {
        title: "Sie müssen das Administratorpasswort eingeben, um das Dokument zu öffnen",
        Password: "Passwort",
        btnApprove: "Bestätigen"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument ist gesperrt! Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen vorzunehmen!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument nicht entsperrt ist!"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Die Oberen Dokumentinformationen müssen ausgefüllt sein, bevor Sie Artikel hinzufügen können!"
    },
    msgEmpDescription:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Beschreibungen dürfen nicht leer sein!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!"
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
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Die Dokumentsperre wurde aufgehoben!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Das Passwort ist falsch!"
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
        msg: "Aktion nicht möglich, solange das Dokument gesperrt ist!"
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
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Der Kundencode darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    pg_quickDesc:
    {
        title: "Kurzbeschreibungsauswahl",
        clmDesc: "BESCHREIBUNG"
    },
    popQDescAdd:
    {
        title: "Kurzbeschreibung hinzufügen",
        description: "Neue Beschreibung",
        btnApprove: "Speichern"
    },
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
        msg: "Der Lagerbestand darf nicht ins Minus fallen! Höchstmenge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "Artikelnummer",
        clmName: "Artikelname",
        clmMulticode: "Lieferantennummer",
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
        msg: "Bitte Menge eingeben!"
    },
    txtQuantity: "Menge",
}
export default stk_02_009
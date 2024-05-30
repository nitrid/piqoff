// Ürün Giriş Fişi
const stk_02_008 = 
{
    txtRefRefno : "Seriennummer",
    cmbOutDepot: "Eingangslager",
    dtDocDate : "Datum",
    txtBarcode : "Barcode hinzufügen",
    txtTotalCost : "Gesamtkosten",
    txtTotalQuantity: "Gesamtmenge",
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
        clmCode :  "ARTIKELCODE",
        clmName : "ARTIKELNAME",
    },
    grdOutwasItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Anzahl",
        clmCreateDate: "Erstellungsdatum",
        clmDescription :"Beschreibung",
        clmCuser : "Benutzer"
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Seriennummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Anzahl",
        clmCuStomer : "Kunde",
        clmDate : "Datum",
    },
    popPassword : 
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Änderungen und Speichern nur mit dem Administratorpasswort möglich!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Änderungen vorgenommen werden, solange das Dokument gesperrt ist!"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keine Bestände erfassen, bevor die Dokumentkopfdaten vollständig ausgefüllt sind!"
    },
    msgEmpDescription:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Beschreibungen dürfen nicht leer sein!"
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
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "Ok",
        msg: "Das Dokument wurde entsperrt!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "Ok",
        msg: "Das Passwort ist falsch!"
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
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Artikel nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Verbinden",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Der Kundenkode darf nicht leer sein",
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
        btn01: "Ok",
        msg: "Der Lagerbestand darf nicht negativ werden! Höchstmöglicher hinzuzufügender Betrag:"
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
        msg: "Bitte geben Sie die Menge ein!"
    },
    txtQuantity: "Menge",
}
export default stk_02_008
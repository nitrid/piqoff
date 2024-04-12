// Kayıp Ürün Çıkışı
const stk_02_003 = 
{
    txtRefRefno : "Seriennummer",
    cmbOutDepot: "Lagerort",
    dtDocDate : "Datum",
    txtBarcode : "Barcode hinzufügen",
    getDispatch : "Lieferschein Suchen",
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
        clmCode :  "Artikelnummer",
        clmName : "Artikelname",
    },
    grdOutwasItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Menge",
        clmCreateDate: "Erstellungsdatum",
        clmDescription :"Beschreibung",
        clmCostPrice : "Einkaufspreis",
        clmCuser : "Benutzer"
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Seriennummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
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
        msg: "Dokument ist gesperrt! Um Änderungen zu speichern, müssen Sie das Administratorpasswort verwenden, um es zu entsperren!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Bestandsänderungen vorgenommen werden, solange die Dokumenteninformationen nicht vollständig sind!"
    },
    msgEmpDescription:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Zeilenbeschreibungen dürfen nicht leer sein!"
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
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen zu speichern, müssen Sie das Administratorpasswort verwenden, um es zu entsperren!"
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
        msg: "Das Artikel, das Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    validRef :"Die Seriennummer darf nicht leer sein",
    validRefNo : "Die Reihenfolge darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    pg_quickDesc : 
    {
        title : "Kurzbeschreibungsauswahl",
        clmDesc:  "BESCHREIBUNG"
    },
    popQDescAdd : 
    {
        title : "Kurzbeschreibung hinzufügen",
        description : "Neue Beschreibung",
        btnApprove : "Speichern"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die Lagermenge kann nicht negativ werden! Höchstmögliche Menge, die hinzugefügt werden kann:"
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
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Menge eingeben!"
    },
    txtQuantity : "Menge",
}
export default stk_02_003
// "Lager/Filiale-Transfer"
const stk_02_002 = 
{
    txtRefRefno : "Ref. Ref Nr",
    validRef : "Zeile-Spalte darf nicht leer bleiben",
    validDepot : "Lager auswählen",
    validDesign : "Bitte Design auswählen",
    cmbOutDepot: "Ausgangslager",
    cmbInDepot: "Eingangslager",
    dtDocDate : "Datum",
    txtBarcode : "Barcode hinzufügen",
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Nummer",
        clmDocDate : "Datum",
        clmInputName : "Eingang",
        clmOutputName : "Ausgang",
    },
    pg_txtItemsCode : 
    {
        title : "Produkt auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
    },
    grdTrnsfItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Menge",
        clmCreateDate: "Erstellungsdatum",
        clmDescription :"Motiv",
        clmCuser : "Benutzer",
    },
    popPassword : 
    {
        title: "Bitte geben Sie das Administratorpasswort ein, um auf das Dokument zuzugreifen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie die Überschriften vor dem Abschluss ein!"
    },
    msgNotQuantity: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die im Lager vorhandene Menge kann nicht negativ sein! Maximale Menge, die eingegeben werden kann:"
    },
    msgDblDepot:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Eingangs- und Ausgangslager können nicht identisch sein!"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Transfer erfolgreich und erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgSaveValid:
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
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
        msg: "Dokument entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Falsches Passwort"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gesperrt! Bitte entsperren Sie es, um Änderungen zu speichern!"
    },
    msgDoclocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können nicht speichern, ohne zu entsperren!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Produkt nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenfassen",
        btn02: "Neu hinzufügen",
        msg: "Produkt bereits im Dokument vorhanden! Möchten Sie zusammenfassen?"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    pg_txtBarcode : 
    {
        title : "Barcode auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Bitte geben Sie die Menge ein!",
    },
    txtQuantity :"Menge",
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        btn02: "Abbrechen",
        msg: "Dokument gefunden!"
    },
}
export default stk_02_002
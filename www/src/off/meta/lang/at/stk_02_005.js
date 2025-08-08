// "Rückgabeprodukt sammeln"
const stk_02_005 = 
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot1: "Ausgangslager",
    cmbDepot2: "Rückgabelager",
    dtDocDate : "Datum",
    getRebate :"Rückgabe vom ausgewählten Lager",
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
    grdRebItems: 
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
        msgSuccess: "Erfolgreich gespeichert!",
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
    validRef :"Ref eingeben",
    validRefNo : "Ref Nr eingeben",
    validDepot : "Lager auswählen",
    validCustomerCode : "Der Produktcode",
    validDocDate : "Datum auswählen",
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
        msg: "Die im Lager vorhandene Menge kann nicht negativ sein! Vorhandene Menge:"
    },
    pg_txtBarcode : 
    {
        title : "Barcode auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Barcode"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Dokument suchen",
        msg: "Dokument gefunden"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Bitte geben Sie die Menge ein!",
    },
    txtQuantity :"Menge",
}
export default stk_02_005
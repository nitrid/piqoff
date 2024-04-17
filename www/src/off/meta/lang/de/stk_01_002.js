// Barkod Tanımları
const stk_01_002 = 
{
    txtBarcode: "Barcode",
    txtItem: "Artikelcode",
    txtItemName: "Artikelname",
    cmbBarUnit: "Einheit",
    txtBarUnitFactor: "Faktor",
    cmbPopBarType : "Typ",
    MainUnit :"Dieser Barcode wird der Basiseinheit zugeordnet",
    SubUnit : "Dieser Barcode wird der Unterunit zugeordnet",
    txtUnitTypeName :"Beschreibung",
    BarcodePlace : "Geben Sie den Barcode ein, den Sie für den ausgewählten Artikel hinzufügen möchten.",
    pg_txtItem:
    {
        title: "Artikelauswahl",
        clmCode: "CODE",
        clmName: "NAME", 
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmBarcode: "Barcode",
        clmItemName: "ARTIKELNAME", 
        clmItemCode: "ARTIKELCODE"
    },      
    msgCheckBarcode:
    {
        title: "Achtung",
        btn01: "Zum Barcode gehen",
        btn02: "OK",
        msg: "Der eingegebene Barcode ist bereits im System registriert! Artikel wurde gefunden."
    },
    msgBarcode:
    {
        title: "Achtung",
        btn01: "Zum Barcode gehen",
        btn02: "OK",
        msg: "Der eingegebene Barcode ist bereits im System registriert!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag speichern möchten?"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    validCode :"Sie müssen einen Artikel auswählen",
}
export default stk_01_002
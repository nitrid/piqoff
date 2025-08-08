// "Barcode-Definitionen"
const stk_01_002 = 
{
    txtBarcode: "Barcode",
    txtItem: "Produktreferenz",
    txtItemName: "Produktname",
    cmbBarUnit: "Einheit",
    txtBarUnitFactor: "Faktor",
    cmbPopBarType : "Typ",
    MainUnit : "Barcode der Basiseinheit zugeordnet" , 
    SubUnit : "Barcode der Untereinheit zugeordnet",
    txtUnitTypeName :"Beschreibung",
    barcodePlace : "Bitte fügen Sie den Barcode zum ausgewählten Produkt hinzu.", 
    txtPartiLot : "Losnummer",
    pg_partiLot:
    {
        title: "Losauswahl",
        clmLotCode: "Losnummer",
        clmSkt: "MHD"
    },
    pg_txtItem:
    {
        title: "Produktauswahl",
        clmCode: "Code",
        clmName: "Name", 
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmBarcode: "Barcode",
        clmItemName: "Produktname", 
        clmItemCode: "Produktreferenz"
    },
   
    msgCheckBarcode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Eingegebener Barcode ist bereits registriert! Bestand importiert.",
    },
    msgBarcode:
    {
        title: "Achtung",
        btn01: "Barcode suchen",
        btn02: "OK",
        msg: "Eingegebener Barcode existiert bereits!",
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!",
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!" ,
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?" ,
    },
    validCode :"Bitte wählen Sie ein Produkt aus",
}
export default stk_01_002
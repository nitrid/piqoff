//"Massenprodukt-Bearbeitung"
const stk_04_001 =
{
    txtCustomerCode : "Lieferant",
    codePlaceHolder : "Bitte geben Sie den Produktcode, Barcode oder Lieferantencode ein, den Sie suchen möchten",  
    namePlaceHolder :"Geben Sie den vollständigen Namen oder eine Silbe des Produkts ein",  
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Dokumentauswahl",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Gattung"
    },
    cmbItemGroup : "Produktgruppe",
    btnGet : 'Suchen',
    txtCode : "Produktreferenz",
    txtName : "Produktname",
    grdItemList : 
    {
        clmCode: "Code",
        clmName : "Name",
        clmBarcode : "Barcode",
        clmMulticode : "LFR.Code",
        clmCustomerName : "Lieferant",
        clmCustomerPrice : "Lieferantenpreis",
        clmPriceSale : "Verkaufspreis",
        clmVat : "Steuer",
        clmOrgins : "Herkunft",
        clmStatus : "Aktiv",
        clmUnderUnit : "Produktinhalt",
        clmMainUnit : "Haupteinheit",
        clmUnderFactor : "Koeffizient",
        clmWeighing : "Gewogen", 
        clmNetMargin :  "Nettomarge",
        clmGrossMargin : "Bruttomarge",
        clmCustoms : "Zollcode",
        clmMargin : "Marge %"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "Bestätigen",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert..!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
}
export default stk_04_001
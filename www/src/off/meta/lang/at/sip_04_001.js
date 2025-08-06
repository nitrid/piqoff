// "Bestellungsaufschlüsselung"
const sip_04_001 =  
{
    txtCustomerCode : "Lieferant",
    validDepot : "Bitte wählen Sie ein Lager aus",
    ItemNamePlaceHolder :"Geben Sie den vollständigen Produktnamen oder eine Silbe ein",
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Lieferantencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Typ"
    },
    cmbDepot : 'Lager',
    btnGet : 'Suchen',
    btnOrder : 'Bestellung erstellen',
    grdOrderList : 
    {
        clmCode: "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmCustomer : "Lieferant",
        clmPrice : "Preis"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "Bestätigen",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die ausgewählten Zeilen bestellen möchten?"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihre Rückgabedokumente wurden erstellt!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
    },
    msgDublicateItem : 
    {
        title: "Achtung",
        btn01 : "OK",
        msg : "Das Produkt wurde für mehrere Lieferanten ausgewählt. Bitte überprüfen Sie dies."
    },
    msgCustomerFound : 
    {
        title: "Achtung",
        btn01 : "OK",
        msg : "Produkte ohne Lieferantenzuordnung können nicht ausgewählt werden. Bitte weisen Sie einen Lieferanten zu."
    }
}
export default sip_04_001
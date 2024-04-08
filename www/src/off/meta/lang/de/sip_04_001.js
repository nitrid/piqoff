// "Sipariş Ayrıştırma"
const sip_04_001 =  
{
    txtCustomerCode: "Kunde",
    validDepot: "Bitte wählen Sie ein Depot aus",
    ItemNamePlaceHolder: "Geben Sie den vollständigen Artikelnamen oder einen Teil davon ein",
    pg_txtCustomerCode: 
    {
        title: "Kundenauswahl",
        clmCode: "Kundencode",
        clmTitle: "Kundenname",
        clmTypeName: "Typ",
        clmGenusName: "Art"
    },
    cmbDepot: "Depot",
    btnGet: "Suchen",
    btnOrder: "Bestellung erstellen",
    grdOrderList:
    {
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmCustomer: "Kunde",
        clmPrice: "Preis"
    },
    msgSpeichern: 
    {
        title: "Achtung",
        btn01: "Bestätigen",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die ausgewählten Zeilen stornieren möchten?"
    },
    msgSpeichernResult: 
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihre Rücksendungen wurden erstellt!",
        msgFailed: "Fehler beim Speichern des Eintrags!"
    },
    msgDublicateItem: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Artikel wurde für mehrere Kunden ausgewählt. Bitte überprüfen Sie dies."
    },
    msgCustomerFound: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel ohne Kundenzuordnung können nicht ausgewählt werden. Bitte weisen Sie einen Kunden zu."
    }
}
export default sip_04_001
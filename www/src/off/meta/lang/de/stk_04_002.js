// "İade Operasyonları"
const stk_04_002 =
{
    txtCustomerCode : "Kunde",
    validDepot : "Bitte wählen Sie ein Lager aus",
    ItemNamePlaceHolder :"Geben Sie den vollständigen Artikelname oder einen Teil ein",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    cmbDepot : 'Lager',
    btnGet : 'Suchen',
    btnInvoice : 'In Rechnung umwandeln',
    btnDispatch : 'In Lieferschein umwandeln',
    grdRebateList : 
    {
        clmCode: "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmCustomer : "Kunde",
        clmPrice : "Preis"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Bestätigen",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die ausgewählten Zeilen zurückgeben möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Rückgabebelege wurden erstellt!",
        msgFailed: "Fehler beim Speichern des Eintrags!"
    },
    msgDublicateItem : 
    {
        title: "Achtung",
        btn01 : "OK",
        msg : "Das Artikel wurde für mehrere Kunden ausgewählt. Bitte überprüfen Sie dies."
    },
    msgCustomerFound : 
    {
        title: "Achtung",
        btn01 : "OK",
        msg : "Nicht definierte Artikel für den Kunden können nicht ausgewählt werden. Bitte definieren Sie einen Kunden."
    }
}
export default stk_04_002
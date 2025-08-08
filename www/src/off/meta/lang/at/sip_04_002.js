// "Verkaufsbestellungsverteilungsoperation"
const sip_04_002 = 
{
    cmbCustomer: "Kunde",
    btnGet: "Suchen",
    dtFirst: "Startdatum",
    dtLast: "Enddatum",
    cmbDepot: "Lager",
    menu: "Verkaufsbestellung",
    itemTotalQyt: "Versandbereite Menge",
    popOrderDetail: 
    {
        title: "Bestelldetails"
    },
    pg_txtCustomerCode: 
    {
        title: "Kundenauswahl",
        clmCode: "KUNDENCODE",
        clmTitle: "KUNDENNAME",
        clmTypeName: "TYP",
        clmGenusName: "ART"
    },
    grdSlsOrdList: 
    {
        clmItemCode: "Produktcode",
        clmItemName: "Produktname",
        clmDepotQuantity: "Menge im Lager",
        clmComingQuantity: "Kommende Menge",
        clmTotalQuantity: "Gesamt versandfähig",
        clmQuantity: "Bestellmenge",
        clmApprovedQuantity: "Genehmigte Menge",
        clmTotalHt: "Gesamt ohne MwSt.",
        clmTotal: "Gesamt",
        clmLivre : "Geliefert"
    },
    btnSave: "Ausgewählte Zeilen genehmigen",
    msgApprovedBig: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die genehmigte Menge darf nicht größer sein als die Bestellmenge!",
    },
    grdOrderDetail: 
    {
        clmCode: "Produktcode",
        clmName: "Produktname",
        clmDate: "Bestelldatum",
        clmCustomer: "Kundenname",
        clmQuantity: "Bestellmenge",
        clmApprovedQuantity: "Genehmigte Menge",
    },
    btnDetailCancel: "Abbrechen",
    btnDetailApproved: "Genehmigen",
    msgSave: 
    {
        title: "Achtung",
        btn01: "Ja",
        btn02: "Nein",
        msg: "Möchten Sie die ausgewählten Zeilen genehmigen?",
    },
    msgSaveSuccess: 
    {
        title: "Achtung",
        btn01: "Drucken",
        btn02: "Schließen",
        msg: "Die ausgewählten Zeilen wurden genehmigt. Möchten Sie die Bestellungen drucken?",
    },
}

export default sip_04_002
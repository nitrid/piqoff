// "Satış Siparişi Dağıtım Operasyonu"
const sip_04_002 = 
{
    cmbCustomer: "Kunde",
    btnGet: "Abrufen",
    dtFirst: "Erstes Datum",
    dtLast: "Letztes Datum",
    cmbDepot: "Lager",
    menu: "Verkaufsauftrag",
    itemTotalQyt: "Versandbereite Menge",
    popOrderDetail: 
    {
        title: "Bestelldetails"
    },
    pg_txtCustomerCode: 
    {
        title: "Kundenauswahl",
        clmCode: "KUNDENNUMMER",
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
        clmTotalHt: "Betrag ohne Steuern",
        clmTotal: "Gesamt",
        clmLivre : "Geliefert"
    },
    btnSave: "Ausgewählte Zeilen genehmigen",
    msgApprovedBig: 
    {
        title: "Achtung",
        btn01: "Okay",
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
        btn01: "Print",
        btn02: "Okay",
        msg: "Die ausgewählten Zeilen wurden genehmigt",
    },
}

export default sip_04_002
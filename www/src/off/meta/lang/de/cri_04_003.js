// "Müşteri Puanı Raporu"
const cri_04_003 =
{
    cmbCustomer :"Kunde",
    btnGet :"Suchen",
    txtCustomerCode : "Kundencode",
    txtCustomerName : "Kundenname",
    txtAmount : "Gesamtbetrag",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    grdCustomerPointReport: 
    {
        clmCode: "Code",
        clmTitle: "Name",
        clmPoint: "Punkte",
        clmLdate : "Letztes Aktualisierungsdatum",
        clmEur : "EURO"
    },
    popPointDetail : 
    {
        title: "Punktdetails"
    },
    grdPointDetail : 
    {
        clmDate : "Datum",
        clmPoint : "Punkte",
        clmPointType : "Typ",
        clmPosId :"Belegnummer",
        clmDescription :"Beschreibung",
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Barcode",
        clmName : "Artikelname",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Zahlungsmethode", 
        clmTotal : "Betrag",
    },
    popDetail : 
    {
        title : "Belegdetails"
    },
    TicketId :"Beleg-ID",
    popLastTotal : 
    {
        title : "Zahlung"
    },
    trDeatil: "Gutscheindetails", 
    lineDelete :"Zeile stornieren", 
    Abbrechen : "Abbrechen", 
    btnAddpoint : "Punkte hinzufügen/abziehen",
    popPointEntry : 
    {
        title : "Punkte hinzufügen/abziehen"
    },
    txtPoint : "Punkte",
    txtPointAmount : "Betrag",
    cmbPointType : "Transaktionstyp",
    cmbTypeData : 
    {
        in : "Punkte hinzufügen",
        out : "Punkte abziehen"
    },
    txtDescription : "Beschreibung",
    msgDescription:
    {
        title: "Achtung",  
        btn01: "OK",   
        msg: "Bitte geben Sie einen Text mit mindestens 15 Zeichen ein."
    },
    btnAdd : "Hinzufügen",
    descriptionPlace : "Bitte geben Sie einen Text mit mindestens 15 Zeichen ein."
}
export default cri_04_003
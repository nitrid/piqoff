// "Einkaufsbestellungsliste"
const sip_01_001 =
{
    cmbCustomer :"Lieferant",
    btnGet :"Suchen",
    chkInvOrDisp: "Nur offene Bestellungen anzeigen",
    dtFirst : "Startdatum",
    dtLast : "Enddatum",
    txtCustomerCode : "Lieferant",
    menu:"Einkaufsbestellungsliste",
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    menu : 
    {
        sip_02_001 : "Einkaufsbestellung",
    },
    grdPurcOrdList: 
    {
        clmRef: "Referenz",
        clmRefNo: "Zeile",
        clmPrice: "Preis",
        clmOutputCode : "Dokumentauswahl",
        clmOutputName : "Lieferantenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Gesamt ohne MwSt.",
        clmTotal : "Gesamt",
        clmInputName : "Lager",
    },
}
export default sip_01_001
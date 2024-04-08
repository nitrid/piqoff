// "Gelen İade Fatura Listesi"
const ftr_01_006 =
{
    txtCustomerCode : "Kunde",
    menu:"Retourerechnung",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Art",
        clmGenusName : "Geschlecht"
    },
    btnGet :"Suchen",
    dtFirst : "Anfangsdatum",
    dtLast : "Enddatum",
    grdSlsIvcList: 
    {
        clmRef: "Serie",
        clmRefNo: "Reihe",
        clmPrice: "Preis",
        clmOutputCode : "Kundencode",
        clmOutputName : "Kundenname",
        clmInputName : "Lager",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
    },
}
export default ftr_01_006
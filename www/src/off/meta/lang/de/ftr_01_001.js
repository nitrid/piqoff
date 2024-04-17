// "Alış Fatura Listesi"
const ftr_01_001 =
{
    txtCustomerCode : "Kunde",
    menu:"Einkaufsrechnung",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    btnGet :"Suchen",
    dtFirst : "Anfangsdatum",
    dtLast : "Enddatum",
    grdPurcIvcList: 
    {
        clmRef: "Serie",
        clmRefNo: "Nummer",
        clmPrice: "Preis",
        clmOutputCode : "Kundencode",
        clmOutputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmInputName : "Lager",
    },
}
export default ftr_01_001
// "İade Fatura Listesi"
const  ftr_01_003 =
{
    txtCustomerCode : "Kunde",
    menu:"Retourerechnung",
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
    grdSlsIvcList: 
    {
        clmRef: "Serie",
        clmRefNo: "Nummer",
        clmPrice: "Preis",
        clmInputCode : "Kundencode",
        clmInputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
    },
}
export default ftr_01_003
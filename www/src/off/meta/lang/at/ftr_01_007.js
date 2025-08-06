// "Gelen İade Fatura Listesi"
const ftr_01_007 =
{
    txtCustomerCode : "Kunde",
    menu:"Rückgaberechnung",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    btnGet :"Suchen",
    dtFirst : "Startdatum",
    dtLast : "Enddatum",
    grdSlsIvcList: 
    {
        clmRef: "Spalte",
        clmRefNo: "Zeile",
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
export default ftr_01_007
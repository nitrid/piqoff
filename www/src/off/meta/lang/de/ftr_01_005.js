// "Şube Satış Fatura Listesi"
const ftr_01_005 =
{
    txtCustomerCode : "Kunde",
    menu:"Filialverkaufsrechnung",
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
        clmInputCode : "Kundennummer",
        clmInputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmOutputName :"Lager",
    },
}
export default ftr_01_005
// "Fiyat Farkı Fatura Listesi"
const ftr_01_004 =
{
    txtCustomerCode : "Kunde",
    menu:"Preisdifferenzrechnung",
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
export default ftr_01_004
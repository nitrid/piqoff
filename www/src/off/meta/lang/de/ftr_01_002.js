// "Satış Fatura Listesi"
const ftr_01_002 =
{
    txtCustomerCode : "Kunde",
    menu:"Verkaufsrechnung",
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
        clmRef: "Referenz",
        clmRefNo: "Zeile",
        clmPrice: "Preis",
        clmInputCode : "Kundenauswahl",
        clmInputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Gesamt" ,
        clmTotal : "Gesamt",
        clmOutputName :"Lager",
        clmMail : "E-Mail gesendet"
    },
    popDesign : 
    {
        title: "Design-Auswahl",
        design : "Design" ,
    },
}
export default ftr_01_002
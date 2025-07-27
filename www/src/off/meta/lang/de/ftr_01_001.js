// "Alış Fatura Listesi"
const ftr_01_001 =
{
    txtCustomerCode : "Lieferant",
    menu:"Einkaufsrechnung",
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Lieferantencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    btnGet :"Suchen",
    dtFirst : "Startdatum",
    dtLast : "Enddatum",
    grdPurcIvcList: 
    {
        clmRef: "Referenz",
        clmRefNo: "Zeile",
        clmPrice: "Preis",
        clmOutputCode : "Lieferantenauswahl",
        clmOutputName : "Lieferantenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Gesamt" ,
        clmTotal : "Gesamt",
        clmInputName : "Lager",
    },
    popDesign :
    {
        title : "Design-Auswahl",
        design : "Bitte wählen Sie ein Design",
        btnPrint : "Drucken"
    },
    validDesign : "Bitte wählen Sie ein Design.",
}
export default ftr_01_001
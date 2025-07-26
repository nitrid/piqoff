// "İade Fatura Listesi"
const  ftr_01_003 =
{
    txtCustomerCode : "Lieferant",
    menu:"Rückgaberechnung",
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
    grdSlsIvcList: 
    {
        clmRef: "Referenz",
        clmRefNo: "Zeile",
        clmPrice: "Preis",
        clmInputCode : "Lieferantenauswahl",
        clmInputName : "Lieferantenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Gesamt" ,
        clmTotal : "Gesamt",
    },
    popDesign :
    {
        title : "Design-Auswahl",
        design : "Bitte wählen Sie ein Design",
        btnPrint : "Drucken"
    },
    validDesign : "Bitte wählen Sie ein Design.",
}
export default ftr_01_003
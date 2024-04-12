// "Satış Siparişi Dağıtım Operasyonu"
const sip_04_002 =
{
    cmbCustomer :"Kunde",
    btnGet :"Suchen",
    dtFirst : "Anfangsdatum",
    dtLast : "Enddatum",
    cmbDepot : "Lager",
    menu:"Verkaufsbestellung",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    grdSlsOrdList: 
    {
        clmRef: "Seriennummer",
        clmRefNo: "Reihennummer",
        clmPrice: "Preis",
        clmInputCode : "Kundennummer",
        clmInputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmOutputName :"Lager",
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Sprache des Dokuments"
    },
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
}
export default sip_04_002
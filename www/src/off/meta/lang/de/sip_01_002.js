// "Satış Sipariş Listesi"
const sip_01_002 =
{
    cmbCustomer :"Kunde",
    btnGet :"Abrufen",
    chkInvOrDisp: "Nur offene Bestellungen anzeigen",
    dtFirst : "Erstes Datum",
    dtLast : "Letztes Datum",
    txtCustomerCode : "Kunde",
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
    msgConvertDispatch :
    {  
        title: "Achtung",   
        btn01: "OK",   
        btn01: "Abbrechen",   
        msg: "Möchten Sie die ausgewählten Belege in Lieferschein umwandeln?"        
    },
    msgConvertSucces :
    {  
        title: "Achtung", 
        btn01: "OK",   
        msg: "Ausgewählten Belege wurden in Lieferschein umgewandelt."          
    },
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
}
export default sip_01_002
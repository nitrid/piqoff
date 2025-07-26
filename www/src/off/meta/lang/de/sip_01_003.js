// "Vorbereitungsbestellungsliste"
const sip_01_003 =
{
    cmbCustomer :"Kunde",
    btnGet :"Suchen",
    chkInvOrDisp: "Nur offene Bestellungen anzeigen",
    dtFirst : "Startdatum",
    dtLast : "Enddatum",
    txtCustomerCode : "Kunde",
    menu:"Verkaufsbestellungsliste",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    grdSlsOrdList: 
    {
        clmRef: "Referenz",
        clmRefNo: "Zeile",
        clmPrice: "Preis",
        clmInputCode : "Dokumentauswahl",
        clmInputName : "Kundenname",
        clmDate: "Datum",
        clmVat : "MwSt.",
        clmAmount : "Gesamt ohne MwSt.",
        clmTotal : "Gesamt",
        clmOutputName :"Lager",
        clmMainGroup : "Kundengruppe",
        clmStatus : "Status",
        clmColis : "Paket",
        clmPalet : "Palette",
        clmBox : "Kiste",
        clmLivre : "Geliefert",
        clmPrinted : "Gedruckt"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    msgConvertDispatch :
    {  
        title: "Achtung",   
        btn01: "Weiter",   
        btn02: "Abbrechen",   
        msg: "Möchten Sie die ausgewählten Bestellungen in Lieferschein umwandeln?"        
    },
    msgConvertSucces :
    {  
        title: "Achtung", 
        btn01: "Drucken",   
        msg: "Die Lieferscheine wurden erstellt."          
    },
    btnView : "Vorschau", 
    btnMailsend : "E-Mail senden", 
    cmbMainGrp : "Kundengruppe",
    statusType : 
    {
        blue: "In Vorbereitung",
        green: "Vorbereitet",
        yellow: "Teilweise abgeschlossen",
        grey: "Wartet"
    }
}
export default sip_01_003
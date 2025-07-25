// "Müşteri Puanı Raporu"
const cri_04_003 =
{
    cmbCustomer :"Lieferant",
    btnGet :"Suchen",
    txtCustomerCode : "Kundenauswahl",
    txtCustomerName : "Kundenname",
    txtAmount : "Gesamtpunkte", 
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Gattung"
    },
    grdCustomerPointReport: 
    {
        clmCode: "Code",
        clmTitle: "Name",
        clmPoint: "Punkte",
        clmLdate : "Letztes Update-Datum",
        clmEur : "EURO"
    },
    popPointDetail : 
    {
        title: "Punkt-Detail"
    },
    grdPointDetail : 
    {
        clmDate : "Datum",
        clmPoint : "Punkt",
        clmPointType : "Typ",
        clmPosId :"Ticket-Nummer",
        clmDescription :"Grund",
    },
    grdSaleTicketItems :
    {
        clmBarcode : "Barcode",
        clmName : "Produktname",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag"
    },
    grdSaleTicketPays : 
    {
        clmPayName : "Zahlungsart", 
        clmTotal : "Gesamt",
    },
    popDetail : 
    {
        title : "Ticket-Detail"
    },
    TicketId :"Ticket Nr.", 
    popLastTotal : 
    {
        title : "Zahlung"
    },
    trDeatil: "T.R Detail", 
    lineDelete :"Zeile storniert", 
    cancel : "Abbrechen", 
    btnAddpoint : "Punkt Ein- und Ausgang",     
    popPointEntry :     
    {    
        title : "Punkt Ein- und Ausgang"     
    },    
    txtPoint : "Punkt",     
    txtPointAmount : "Gegenwert Summe",     
    cmbPointType : "Eingabetyp",     
    cmbTypeData :    
    {     
        in : "Punkt Eingang",     
        out : "Punkt Ausgang"     
    },     
    txtDescription : "Information",
    msgDescription:
    {
        title: "Achtung",  
        btn01: "OK",   
        msg: "Bitte geben Sie mindestens 15 Zeichen ein.."  
    },
    btnAdd : "Hinzufügen", 
    descriptionPlace : "Bitte geben Sie mindestens 15 Zeichen ein.."
}
export default cri_04_003
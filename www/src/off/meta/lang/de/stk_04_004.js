// SKT operasyonu
const stk_04_004 =
{
    txtRef : "Bestand",
    dtFirstdate : "Anfangsdatum",
    dtLastDate : "Enddatum",
    btnGet : "Suchen",
    btnPrint : "Etikett für ausgewähltes Artikel drucken",
    txtCustomerCode : "Kunde",
    cmbItemGroup : "Artikelgruppe",
    grdExpdateList:  
    {
        clmQuantity : "Menge",
        clmCode : "Code",
        clmName : "Name",
        clmDiff : "Verkaufte Menge seit Eingangsdatum",
        clmDate : "Haltbarkeitsdatum",
        clmRemainder : "Verbleibend",
        clmCustomer :"Kunde",
        clmRebate : "Rücknahme erlaubt",
        clmDescription :"Beschreibung",
        clmUser : "Benutzer",
        clmCDate : "Eingangsdatum",
        clmPrintCount : "Druckanzahl",
        clmLUser : "Letzter Druck/Vorgang" 
    },
    popQuantity : 
    {
        title : "Mengen- und Preisangabe",
        txtQuantity : "Menge",
        txtPrice : "Preis",
        btnSpeichern : "Speichern und Drucken"
    },
    pg_txtRef:
    {
        title: "Artikelauswahl",
        clmCode: "CODE",
        clmName: "NAME",
        clmStatus: "STATUS"
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    msgDoublePrint:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Für diesen Artikel wurde bereits ein spezielles Etikett erstellt! Möchten Sie es erneut erstellen?"
    },
    msgLabelCount:
    {
        title: "Achtung",  
        btn01: "OK",  
        msg: "Sie können nicht mehr als die verbleibende Artikelmenge an Etiketten drucken." 
    },
}
export default stk_04_004
// "MHD-Operation"
const stk_04_004 =
{
    txtRef : "Produkt",   
    dtFirstdate : "Startdatum",   
    dtLastDate : "Enddatum",   
    btnGet : "Suchen",   
    btnPrint : "Spezielle Etikette für ausgewähltes Produkt drucken",   
    txtCustomerCode : "Lieferant", 
    cmbItemGroup : "Produktkategorie", 
    grdExpdateList:   
    {   
        clmQuantity : "Menge",   
        clmCode : "Code",   
        clmName : "Name",   
        clmDiff : "Verkauf seit Eingangsdatum", 
        clmDate : "MHD",
        clmRemainder : "Verbleibend", 
        clmCustomer :"Lieferant",
        clmRebate : "Rücknahme-Rückgabe",
        clmDescription :"Bemerkung",
        clmUser : "Benutzer",
        clmCDate : "Eingangsdatum" , 
        clmPrintCount : "Zu druckende Menge", 
        clmLUser : "Letzter Druck/Eingabe"  
    },   
    popQuantity :    
    {   
        title : "Mengen- und Preiseingabe",   
        txtQuantity : "Menge",   
        txtPrice : "Preis",   
        btnSave : "Speichern und Drucken"   
    },  
    pg_txtRef:  
    {  
        title: "Produktauswahl",   
        clmCode: "Code",   
        clmName: "Name",   
        clmStatus: "Status"   
    },
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Lieferantencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Gattung"
    },
    msgDoublePrint:
    {
        title: "Achtung",  
        btn01: "OK",  
        btn02: "Abbrechen",  
        msg: "Spezielle Etikette bereits für ausgewähltes Produkt erstellt! Sind Sie sicher, dass Sie sie erneut erstellen möchten?" 
    },
    msgLabelCount:
    {
        title: "Achtung",  
        btn01: "OK",  
        msg: "Es können nicht mehr Etiketten gedruckt werden als die verbleibende Produktmenge." 
    },
}
export default stk_04_004
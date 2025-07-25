// "Müşteri Extre Raporu"
const cri_04_001 =
{
    txtCustomerCode : "Kunde/Lieferant", 
    btnGet :"Suchen", 
    txtDate : "Datum",
    grdListe : 
    {
        clmDocDate: "Datum",  
        clmTypeName : "Dokumenttyp",      
        clmRef : "Dokumentserie",   
        clmRefNo : "Dokumentnummer",   
        clmDebit : "Soll",   
        clmReceive : "Haben",   
        clmBalance : "Saldo",   
    },
    txtTotalBalance :"Saldo", 
    pg_txtCustomerCode : 
    {
        title : "Kunde/Lieferant Auswahl",
        clmCode :  "Kunde/Lieferant Code",
        clmTitle : "Kunde/Lieferant Name",
        clmTypeName : "Typ",
        clmGenusName : "Gattung",
        clmBalance : "Saldo",  
    },
    msgNotCustomer:
    {
        title: "Achtung", 
        btn01: "OK", 
        msg:  "Bitte wählen Sie den Kunde/Lieferant aus"
    },
}
export default cri_04_001
// "Müşteri Extre Raporu"
const cri_04_001 =
{
    txtCustomerCode : "Kunde",
    btnGet :"Suchen",
    grdListe : 
    {
        clmDocDate: "Datum",
        clmTypeName : "Dokumenttyp",           
        clmRef : "Dokumentennummer",
        clmRefNo : "Dokumentennummer",
        clmDebit : "Soll",
        clmReceive : "Haben",
        clmBalance : "Saldo",
    },
    txtTotalBalance : "Kontostand",
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "GESCHLECHT",
        clmBalance : "KONTOSTAND",
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie ein Kunde aus!"
    },
}
export default cri_04_001
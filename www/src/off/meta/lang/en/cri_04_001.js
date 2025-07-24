// "Müşteri Extre Raporu"
const cri_04_001 =
{
    txtCustomerCode : "Customer",
    btnGet :"Get",
    txtDate : "Date",
    grdListe : 
    {
        clmDocDate: "Date",
        clmTypeName : "Document Type",           
        clmRef : "Document Series",
        clmRefNo : "Document Sequence",
        clmDebit : "Debit",
        clmReceive : "Credit",
        clmBalance : "Balance",
    },
    txtTotalBalance : "Balance",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus",
        clmBalance : "Balance",
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the customer."
    },
}

export default cri_04_001
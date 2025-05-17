// "Alış Sipariş Listesi"
const sip_01_001 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    chkInvOrDisp :"Show only open orders",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    menu:"Purchase Order",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    grdPurcOrdList: 
    {
        clmRef: "Series",
        clmRefNo: "Sequence",
        clmPrice: "Price",
        clmOutputCode : "Customer Code",
        clmOutputName : "Customer Name",
        clmDate: "Date",
        clmVat : "VAT",
        clmAmount : "Amount",
        clmTotal : "Total",
        clmInputName : "Warehouse",
    },
}

export default sip_01_001
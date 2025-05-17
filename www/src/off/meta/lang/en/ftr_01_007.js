// "Gelen İade Fatura Listesi"
const ftr_01_007 =
{
    txtCustomerCode : "Customer",
    menu:"Fire Invoice",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    grdSlsIvcList: 
    {
        clmRef: "Series",
        clmRefNo: "Sequence",
        clmPrice: "Price",
        clmOutputCode : "Customer Code",
        clmOutputName : "Customer Name",
        clmInputName : "Warehouse",
        clmDate: "Date",
        clmVat : "VAT",
        clmAmount : "Amount",
        clmTotal : "Total",
    },

}

export default ftr_01_007
// "Fiyat Farkı Fatura Listesi"
const ftr_01_004 =
{
    txtCustomerCode : "Customer",
    menu:"Price Difference Invoice",
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
        clmInputCode : "Customer Code",
        clmInputName : "Customer Name",
        clmDate: "Date",
        clmVat : "VAT",
        clmAmount : "Amount",
        clmTotal : "Total",
    },

}

export default ftr_01_004
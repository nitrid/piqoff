// "İade Fatura Listesi"
const  ftr_01_003 =
{
    txtCustomerCode : "Customer",
    menu:"Return Invoice",
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
    popDesign :
    {
        title : "Selection",
        design : "Please make a selection",
        btnPrint : "Print"

    },
    validDesign : "Please make a selection",
}

export default ftr_01_003
// "Alış Fatura Listesi"
const ftr_01_001 =
{
    txtCustomerCode : "Customer",
    menu:"Purchase Invoice",
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
    grdPurcIvcList: 
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
    popDesign :
    {
        title : "Selection",
        design : "Please make a selection",
        btnPrint : "Print"

    },
    validDesign : "Please make a selection.",

}

export default ftr_01_001
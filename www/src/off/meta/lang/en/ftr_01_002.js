// "Satış Fatura Listesi"
const ftr_01_002 =
{
    txtCustomerCode : "Customer",
    menu:"Sales Invoice",
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
        clmOutputName :"Warehouse",
        clmMail : "Mail Sent"
    },
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
    },
}

export default ftr_01_002
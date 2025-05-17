//"Satış İrsaliye Listesi"
const irs_01_002 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    cmbMainGrp : "Customer Group",
    menu:"Sales Invoice",
    chkOpenDispatch : "Show Only Invoices without Dispatch",
    msgNoMailAddress : "Customer mail address is not available and invoice sending is not done. - ",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER TITLE",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    popDesign :
    {
        title : "Design Selection",
        design : "Design Selection",
        btnPrint : "Print",
        btnCancel : "Cancel"
    },
    grdSlsDisList: 
    {
        clmRef: "Serial",
        clmRefNo: "Sequence",
        clmPrice: "Price",
        clmInputCode : "Customer Code",
        clmInputName : "Customer Name",
        clmDate: "Date",
        clmVat : "VAT",
        clmAmount : "Amount",
        clmTotal : "Total",
        clmMainGroup : "Customer Group",
        clmOutputName :"Warehouse",
        clmFacture : "Converted to Invoice"
    },
    msgConvertInvoices :
    {  
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to convert the selected invoices to invoices ? Once created, they cannot be changed !!"         
    },
    msgConvertSucces :
    {  
        title: "Attention",
        btn01: "Print",
        btn02: "Close",
        msg: "Invoices have been created. Do you want to print them ?"         
    },
    msgPrintDispatch :
    {  
        title: "Attention",
        btn01: "Print",
        btn02: "Close",
        msg: "Invoices will be printed. Do you want to print them ?"         
    },
}

export default irs_01_002
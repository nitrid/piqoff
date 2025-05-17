//"Satış Müşteri Evrak Listesi"
const saleList_01 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    cmbListType : "Document Type",
    cmbFtr : "Invoice",
    cmbIrs : "Dispatch",
    cmbSip : "Order",
    cmbTklf : "Offer",
    cmbMainGrp : "Customer Group",
    tabTitleOffer : "Offer",
    tabTitleOrder : "Order",
    tabTitleDispatch : "Dispatch",
    tabTitleInvoice : "Invoice",
    menu:
    {
        tabTitleOffer : "Sales Offer",
        tabTitleOrder : "Sales Order",
        tabTitleDispatch : "Sales Dispatch",
        tabTitleInvoice : "Sales Invoice"
    },
    chkOpenDispatch : "Show Only Invoices Without Dispatch",
    msgNoMailAddress : "The customer has no mail address and the invoice has not been sent. - ",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
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
        clmOutputName :"Depo",
        clmFacture : "Converted to Invoice",
        clmMail : "Mail Sent"
    },
    msgConvertInvoices :
    {  
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to convert the selected dispatches to invoices ? The invoice cannot be changed after it is created !!"         
    },
    msgConvertSucces :
    {  
        title: "Attention",
        btn01: "Print",
        btn02: "Close",
        msg: "The invoices have been created. Do you want to print them ?"         
    },
    msgPrintDispatch :
    {  
        title: "Attention",
        btn01: "Print",
        btn02: "Close",
        msg: "The dispatches will be printed. Do you want to print them ?"         
    },
}

export default saleList_01
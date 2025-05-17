// "Satış Sipariş Listesi"
const sip_01_002 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    chkInvOrDisp :"Show only open orders",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    menu:"Sales Order",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    grdSlsOrdList: 
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
        clmMainGroup : "Customer Group",
        clmLivre : "Sent"
    },
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
        lang : "Document Language"
    },
    msgConvertDispatch :
    {  
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to convert the selected documents to a dispatch?"         
    },
    msgConvertSucces :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The selected documents have been converted to a dispatch.."         
    },
    btnView : "View",
    btnMailsend : "Send Mail",
    cmbMainGrp : "Customer Group",
    btnPrint : "Print",
    msgPrintOrders :
    {
        title : "Attention",
        btn01 : "OK",
        btn02 : "Cancel",
        msg : "Are you sure you want to print the selected orders?"
    },
}

export default sip_01_002
// "Hazırlanacak Sipariş Listesi"
const sip_01_003 =
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
        clmStatus : "Status",
        clmColis : "Colis",
        clmPalet : "Palet",
        clmBox : "Box",
        clmLivre : "Sent",
        clmPrinted : "Printed"
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
    statusType : 
    {
        blue : "Preparing",
        green : "Ready",
        yellow : "Partially Ready",
        grey : "Waiting"
    }
}

export default sip_01_003
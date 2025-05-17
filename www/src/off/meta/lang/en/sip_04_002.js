// "Satış Siparişi Dağıtım Operasyonu"
const sip_04_002 =
{
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    cmbDepot : "Depo",
    menu:"Sales Order",
    itemTotalQyt : "Total Quantity",
    popOrderDetail : 
    {
        title : "Order Details"
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    grdSlsOrdList: 
    {
        clmItemCode: "Product Code",
        clmItemName: "Product Name",
        clmDepotQuantity: "Depot Quantity",
        clmComingQuantity : "Coming Quantity",
        clmTotalQuantity : "Total Quantity",
        clmQuantity: "Order Quantity",
        clmApprovedQuantity : "Approved Quantity",
        clmTotalHt : "Tax Free Amount",
        clmTotal : "Total",
        clmLivre : "Sent"
    },
    btnSave: "Approve Selected Lines",
    msgApprovedBig:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The approved amount cannot be greater than the order amount !",
    },
    grdOrderDetail: 
    {
        clmCode: "Product Code",
        clmName: "Product Name",
        clmDate: "Order Date",
        clmCustomer : "Customer Name",
        clmQuantity: "Order Quantity",
        clmApprovedQuantity : "Approved Quantity",
    },
    btnDetailCancel : "Cancel",
    btnDetailApproved : "Approve",
    msgSave:
    {
        title: "Attention",
        btn01: "Yes",
        btn02: "No",
        msg: "Are you sure you want to approve the selected lines?",
    },
    msgSaveSuccess:
    {
        title: "Attention",
        btn01: "Print",
        btn02: "Close",
        msg: "Are you sure you want to approve the selected lines? Do you want to print the orders?",
    },
}

export default sip_04_002
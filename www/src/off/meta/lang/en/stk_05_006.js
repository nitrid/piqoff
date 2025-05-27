// "Ürün Hareket Raporu"
const stk_05_006 =
{
    txtRef : "Product Code",
    cmbCustomer :"Customer",
    btnGet :"Get",
    dtFirst : "First Date",
    dtLast : "Last Date",
    txtCustomerCode : "Customer",
    cmbDevice :"Device",
    txtTicketno : "Ticket I.D",
    numFirstTicketAmount : "Lower Amount",
    numLastTicketAmount : "Upper Amount",
    cmbUser :"User",
    txtItem :"Product Code",
    ckhDoublePay : "Multiple Payment",
    cmbType :"Description Type",
    dtDate : "Date",
    txtTotal : "Total Sale",
    txtPartiLot : "Lot Number",
    grdItemMovementReport: 
    {
        clmLuser: "User",
        clmLdate: "Date",
        clmTypeName: "Document Type",
        clmRef: "Series",
        clmRefNo : "Sequence",
        clmDocDate : "Document Date",
        clmItemName : "Product Name",
        clmInputName : "Input",
        clmOutputName : "Output",
        clmQuantity : "Quantity",
        clmDepoQuantity: "Depot Quantity",
        clmPrice : "Price",
        clmTotalHt : "Total",
    },
    pg_txtRef:
    {
        title: "Product Selection",
        clmCode: "CODE",
        clmName: "NAME", 
        clmBarcode: "BARCODE", 
        clmStatus : "STATUS"
    },
    pg_partiLot:
    {
        title: "Parti Lot Selection",
        clmCode: "CODE",
        clmSkt: "EXP", 
    },
    cancel : "Cancel",
    msgItemSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the product !"
    },
}

export default stk_05_006
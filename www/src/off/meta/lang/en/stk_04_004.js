// SKT operasyonu
const stk_04_004 =
{
    txtRef : "Product",
    dtFirstdate : "First Date",
    dtLastDate : "Last Date",
    btnGet : "Get",
    btnPrint : "Print",
    txtCustomerCode : "Customer",
    cmbItemGroup : "Product Group",
    grdExpdateList:  
    {
        clmQuantity : "Quantity",
        clmCode : "Code",
        clmName : "Name",
        clmDiff : "From the entry date",
        clmDate : "SKT Date",
        clmRemainder : "Remainder",
        clmCustomer :"Customer",
        clmRebate : "Rebate",
        clmDescription :"Description",
        clmUser : "User",
        clmCDate : "Entry Date",
        clmPrintCount : "Print Count",
        clmLUser : "Last print/operation" 
    },
    popQuantity : 
    {
        title : "Quantity Price Entry",
        txtQuantity : "Quantity",
        txtPrice : "Price",
        btnSave : "Save and Print"
    },
    pg_txtRef:
    {
        title: "Product Selection",
        clmCode: "CODE",
        clmName: "NAME",
        clmStatus: "STATUS"
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    msgDoublePrint:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "You have already created a special label for the product you have selected! Do you want to create it again?"
    },
    msgLabelCount:
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "You cannot print more labels than the remaining product." 
    },
}

export default stk_04_004
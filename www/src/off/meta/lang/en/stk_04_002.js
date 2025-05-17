// "İade Operasyonları"
const stk_04_002 =
{
    txtCustomerCode : "Customer",
    validDepot : "Please select a depot",
    ItemNamePlaceHolder :"Enter the full name of the product or a part of it",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    cmbDepot : 'Depot',
    btnGet : 'Get',
    btnInvoice : 'Convert to Invoice',
    btnDispatch : 'Convert to Dispatch',
    grdRebateList : 
    {
        clmCode: "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmCustomer : "Customer",
        clmPrice : "Price"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to return the selected lines ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The return documents have been created.",
        msgFailed: "The record has been saved unsuccessfully !"
    },
    msgDublicateItem : 
    {
        title: "Attention",
        btn01 : "OK",
        msg : "The product has been selected for multiple customers. Please check it."
    },
    msgCustomerFound : 
    {
        title: "Attention",
        btn01 : "OK",
        msg : "The product has not been defined for the customer. Please define the customer."
    }
}

export default stk_04_002
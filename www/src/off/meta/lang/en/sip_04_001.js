// "Sipariş Ayrıştırma"
const sip_04_001 =  
{
    txtCustomerCode : "Customer",
    validDepot : "Please select the depot",
    ItemNamePlaceHolder :"Please enter the full name of the product or a part of the name",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    cmbDepot : 'Depo',
    btnGet : 'Getir',
    btnOrder : 'Order Create',
    grdOrderList : 
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
        btn01: "Approve",
        btn02: "Cancel",
        msg: "Are you sure you want to order the selected lines ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Order documents have been created..!",
        msgFailed: "Record operation failed !"
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

export default sip_04_001
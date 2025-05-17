// SKT Girişi
const stk_02_007 = 
{
    design : "Design",
    txtPage : "Page",
    txtFreeLabel : "Free Label",
    AddItems : "Add",
    txtBarcode : "Barcode Add",
    txtBarcodePlace: "Scan the barcode",
    txtRefRefno : "Series-Sequence",
    txtQuantity : "Quantity", 
    cmbDepot : "Depot",
    dtDocDate : "Date",
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
    },
    popItemsCode : 
    {
        title : "Product Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
    },
    popItems: 
    {
        title: "Product Add",
        txtPopItemsCode : "Product Code",
        txtPopItemsName: "Product Name",
        txtPopItemsQuantity : "Quantity",
        dtPopDate : "SKT Date"
    },
    grdExpDate:
    {
        clmName: "Name",
        clmCode: "Code",
        clmDate: "SKT Date",
        clmQuantity : "Quantity",
        clmDescription : "Description",
        clmCuser : "User"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header is not complete. The product cannot be added !"
    },
    msgNotSave:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been changed! Please save or undo the changes"
    },
    msgAddItems:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "The products selected will be added. Do you want to confirm ?"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The record has been saved successfully !",
        msgFailed: "The record has been saved unsuccessfully !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to delete the record ?"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product is not found !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Cancel",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to add a new line ?"
    },
    validDepot : "You must select a depot",
    validDocDate : "You must select a date",
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Add",
        msg: "Please enter the quantity and date !"
    },
}
export default stk_02_007
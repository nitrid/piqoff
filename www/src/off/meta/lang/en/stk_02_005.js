// İade Ürünü Toplama
const stk_02_005 = 
{
    txtRefRefno : "Series-Sequence",
    cmbDepot1: "Exit Depot",
    cmbDepot2: "Return Depot",
    dtDocDate : "Date",
    getRebate :"Get Return from Selected Depot",
    txtBarcode : "Add Barcode",
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmDocDate : "DATE",
        clmInputName : "INPUT",
        clmOutputName : "OUTPUT",
    },
    pg_txtItemsCode : 
    {
        title : "Product Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
    },
    grdRebItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Quantity",
        clmCreateDate: "Record Date",
        clmDescription :"Description",
        clmCuser : "User"
    },
    popPassword : 
    {
        title: "You must enter the administrator password to open the document",
        Password : "Password",
        btnApprove : "Approve"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information must be filled before adding the product !"
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
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been saved and locked !"
    },
    msgPasswordSucces:
    {
        title: "Success",
        btn01: "OK",
        msg: "The document has been unlocked !",
    },
    msgPasswordWrong:
    {
        title: "Failed",
        btn01: "OK",
        msg: "Your password is incorrect !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n You must unlock it with the administrator password to save changes !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n The operation cannot be performed without unlocking it !"
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
        btn01: "Combine",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to combine the lines ?"
    },
    validRef :"The series cannot be left blank",
    validRefNo : "The sequence cannot be left blank",
    validDepot : "You must select a depot",
    validCustomerCode : "The customer code cannot be left blank",
    validDocDate : "You must select a date",
    popDesign : 
    {
        title: "Design selection",
        design : "Design",
        lang : "Document Language"
    },
    msgNotQuantity:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The depot quantity is closed to zero ! The maximum quantity that can be added is:"
    },
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
    },
    msgCode :
    {
        title: "Attention",
        btn01: "Go to Document",
        msg: "The document is found"
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Add",
        btn02: "Cancel",
        msg: "Please enter the quantity !"
    },
    txtQuantity : "Quantity",
}
export default stk_02_005
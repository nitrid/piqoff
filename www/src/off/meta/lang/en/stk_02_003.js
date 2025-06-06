// Kayıp Ürün Çıkışı
const stk_02_003 = 
{
    txtRefRefno : "Serie-Sequence",
    cmbOutDepot: "Out Depot",
    dtDocDate : "Date",
    txtBarcode : "Add Barcode",
    getDispatch : "Get Dispatch",
    txtTotalCost : "Total Cost",
    txtTotalQuantity: "Total Quantity",
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
    grdOutwasItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Quantity",
        clmCreateDate: "Record Date",
        clmDescription :"Description",
        clmCostPrice : "Cost",
        clmCuser : "User"
    },
    pg_dispatchGrid : 
    {
        title : "Dispatch Selection",
        clmReferans : "Series-Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmCuStomer : "Customer",
        clmDate : "Date",
    },
    popPassword : 
    {
        title: "You must enter the administrator password to open the document",
        Password : "Password",
        btnApprove : "Approve"
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
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information must be filled before adding the product !"
    },
    msgEmpDescription:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The row description cannot be left blank !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the record ?"
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
        msg: "Are you sure you want to delete the record ?"
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
    pg_quickDesc : 
    {
        title : "Quick Description Selection",
        clmDesc:  "DESCRIPTION"
    },
    popQDescAdd : 
    {
        title : "Quick Description Add",
        description : "New Description",
        btnApprove : "Save"
    },
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
        clmCode :  "Product Code",
        clmName : "Product Name",
        clmMulticode : "Supplier Code",
        clmBarcode : "Barcode"
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
export default stk_02_003
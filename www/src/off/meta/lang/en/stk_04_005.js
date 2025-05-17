// "Ürün Giriş Çıkış Operasyonu"
const stk_04_005 =
{
    txtRef : "Series-Sequence",
    cmbDepot: "Depo",
    dtDocDate : "Date",
    txtBarcode : "Add Barcode",
    getRecipe : "Product Recipe",
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
    grdList: 
    {
        clmType: "Type",
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Quantity",
        clmDescription :"Description"
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
        msg: "The document header information is not complete. The product cannot be entered !"
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
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product was not found !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Merge",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to merge the lines ?"
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
    msgNotQuantity:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The depot quantity is closed to zero. The maximum quantity that can be added is:"
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
    cmbType : 
    {
        input : "Input",
        output : "Output"
    },
    popRecipe : 
    {
        title: "Product Recipe Selection",
        clmDate: "Date",
        clmCode: "Product Code",
        clmName: "Product Name",
        clmQuantity: "Quantity"
    },
    popRecipeDetail : 
    {
        title: "Product Recipe Detail Input",
        clmType: "Type",
        clmCode: "Product Code",
        clmName: "Product Name",
        clmQuantity: "Recipe Quantity",
        clmEntry: "Input Quantity"
    },
}

export default stk_04_005
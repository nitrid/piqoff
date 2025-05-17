// Barkod Tanımları
const stk_01_002 = 
{
    txtBarcode: "Barcode",
    txtItem: "Product Code",
    txtItemName: "Product Name",
    cmbBarUnit: "Unit",
    txtBarUnitFactor: "Factor",
    cmbPopBarType : "Type",
    MainUnit :"This Barcode Will Be Defined as the Main Unit",
    SubUnit : "This Barcode Will Be Defined as the Sub Unit",
    txtUnitTypeName :"Description",
    barcodePlace : "Please enter the barcode you want to add for the selected product..",
    pg_txtItem:
    {
        title: "Product Selection",
        clmCode: "CODE",
        clmName: "NAME", 
    },
    pg_txtBarcode:
    {
        title: "Choose Barcode",
        clmBarcode: "BARCODE",
        clmItemName: "PRODUCT NAME", 
        clmItemCode: "PRODUCT CODE"
    },
   
    msgCheckBarcode:
    {
        title: "Warning",
        btn01: "OK",
        msg: "The barcode you entered is already in the system ! The product has been retrieved."
    },
    msgBarcode:
    {
        title: "Warning",
        btn01: "Go to Barcode",
        btn02: "OK",
        msg: "The barcode you entered is already in the system !"
    },
    msgSave:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Warning",
        btn01: "OK",
        msgSuccess: "The record has been saved successfully !",
        msgFailed: "The record has been saved unsuccessfully !"
    },
    msgSaveValid:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    msgDelete:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the record ?"
    },
    validCode :"You must select a product",
}
export default stk_01_002
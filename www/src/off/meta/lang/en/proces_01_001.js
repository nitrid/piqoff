// "Ürün Grubu Güncelleme"
const proces_01_001 =
{
    txtItemName : "Product Name",
    txtBarkod : "Barcode",
    cmbCustomer : "Supplier",
    cmbMainGrp : "Product Group",
    btnCheck : "Active",
    btnGet :"Get",
    chkMasterBarcode : "Merge Barcodes",
    txtMulticode : "Supplier Code",
    multicodePlaceHolder : "Enter the supplier codes you want to search for",
    barkodPlaceHolder :"Enter the product code or barcode you want to search for",
    ItemNamePlaceHolder :"Enter the full product name or a part of it",
    btnOk : "Update",
    toolMenu01: "Product Definitions",
    grdListe : 
    {
        clmCode: "Product Code",
        clmName : "Product Name",
        clmMainGrp : "Product Group",
        clmCustomer : "Customer",
        clmSname : "Product Short Name",
        clmMulticode : "T.Code",
        clmUnit : "Unit",
        clmBarcode : "Barcode",
        clmCostPrice : "Cost Price",
        clmPriceSale : "Sale Price",
        clmVat : "Vat",
        clmMinPrice : "Min Price",
        clmMaxPrice : "Max  Price",
        clmStatus : "Status",
        clmNetMargin : "Net Margin",
        clmMargin : "Gross Margin"
    },
    msgWarning : 
    {
        title : "Attention",
        msg: "The selected products will be updated. Do you approve?",
        btn01 : "Cancel",
        btn02 : "Approve"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Record operation successful !",
        msgFailed: "Record operation failed !"
    },
}

export default proces_01_001
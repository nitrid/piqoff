//"Toplu Ürün Düzenleme"
const stk_04_001 =
{
    txtCustomerCode : "Customer",
    codePlaceHolder : "Please enter the product code, barcode or supplier code you want to search for",
    namePlaceHolder :"Enter the full name of the product or a part of it",
    validOriginMax8:"Please enter 8 characters !",
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    cmbItemGroup : 'Product Group',
    btnGet : 'Get',
    txtCode : 'Product Code',
    txtName : 'Product Name',
    grdItemList : 
    {
        clmCode: "Code",
        clmName : "Name",
        clmBarcode : "Barcode",
        clmMulticode : "Multicode",
        clmCustomerName : "Customer",
        clmCustomerPrice : "Customer Price",
        clmPriceSale : "Sale Price",
        clmVat : "VAT",
        clmOrgins : "Origin",
        clmStatus : "Active",
        clmUnderUnit : "Sub Unit",
        clmMainUnit : 'Main Unit',
        clmUnderFactor : "Factor",
        clmWeighing : "Weighing",
        clmNetMargin : "Net Margin",
        clmGrossMargin : "Gross Margin",
        clmCustoms : "Customs Code",
        clmMargin : "Margin %"
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
}

export default stk_04_001
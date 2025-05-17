//  "Promosyon Listesi"
const promo_02_001 =
{
    txtCode: "Code",
    txtName: "Name",
    dtStartDate: "Start Date",
    dtFinishDate: "Finish Date",
    txtCodePlace: "Enter the promotion code or product barcode", 
    txtNamePlace: "Enter the promotion code or product name", 
    btnGet: "Get",
    grdListe:
    {
        clmCode: "Code",
        clmName: "Name", 
        clmStartDate: "First Date", 
        clmFinishDate : "Last Date",
        clmCondTypeName : "Condition Type",
        clmCondItemCode : "Condition Code",
        clmCondItemName : "Condition Name",
        clmCondBarcode : "Condition Barcode",
        clmCondQuantity : "Condition Quantity",
        clmCondAmount : "Condition Amount",
        clmAppTypeName : "Application Type",
        clmAppItemCode : "Application Code",
        clmAppItemName : "Application Name",
        clmAppBarcode : "Application Barcode",
        clmAppQuantity : "Application Quantity",
        clmAppAmount : "Application Amount",
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the selected promotions?"
    },
}

export default promo_02_001
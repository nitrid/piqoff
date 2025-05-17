//  "İndirim Tanımları"
const promo_01_002 =
{
    txtCode: "Code",        
    txtName: "Name",
    txtCustomer: "Customer",
    dtStartDate: "Start Date",
    dtFinishDate: "Finish Date",
    cmbDepot: "Depot",
    txtCustomerCode: "Customer Code",
    txtCustomerName: "Customer Name",
    cmbPrmType: "Customer Type",
    txtPrmCustomer: "Customer",
    btnPrmCustomer: "Customer Selection / list", 
    cmbPrmType2: "Product Type",
    txtPrmItem2: "Product",
    btnPrmItem2: "Product Selection / list", 
    txtPrmItemGrp: "Group",
    txtPrmQuantity: "Quantity",
    txtPrmAmount: "Amount",
    cmbRstType: "Type",
    txtRstQuantity: "Value",
    txtRstItem : "Product",
    cmbRstItemType: "Type",
    txtRstItemQuantity: "Quantity",
    txtRstItemAmount: "Value",
    txtCodePlace: "Please enter the discount code you want to define",
    txtNamePlace: "Please enter the discount name you want to define",
    txtAmount: "Amount",
    pg_Grid:
    {
        title: "Selection",
        clmBarcode: "Barcode",
        clmCode: "Code",
        clmName: "Name", 
        clmItem : "Product",
        clmStartDate : "Start",
        clmFinishDate : "Finish",
        clmGrpName: "Group", 
        clmPrice : "Price",
        btnItem: "Select the product or product group you want to apply the discount",
        btnCustomer: "Select the customer or customer group you want to apply the discount",
    },
    msgRef:
    {
        title: "Attention",
        btn01: "Go to Discount",
        btn02: "OK",
        msg: "The discount you entered is already in the system!"
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
        msg: "Are you sure you want to delete the record?"
    },
    popDiscount:
    {
        title: "Discount",
        txtDiscRate : "Percentage",
        txtDiscAmount : "Price",
        btnSave: "Save"
    },
    msgDiscRate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount you entered cannot be less than 0 or greater than 100 !",
    },
    cmbType:
    {
        customer: "Customer",
        customerGroup: "Customer Group"
    },
    cmbType2:
    {
        item: "Product",
        itemGroup: "Product Group",
        discountRate: "Discount Rate",
        discountAmount: "Discount Amount"
    },
    validation:
    {
        txtPrmQuantityValid: "You cannot leave the amount blank !",
        txtPrmQuantityMinValid: "The minimum value must be at least 0.001 !",
        txtRstItemQuantityValid: "The amount cannot be less than 0 !",
    },
    msgDeleteAll:
    {
        title: "Attention",
        btn01: "Yes",
        btn02: "No",
        msg: "Are you sure you want to delete all?",
    },
    msgItemAlert:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product you are trying to add is already in your list!",
    },
    msgAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please enter the amount!",
    },
    msgCondOrApp:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please enter the customer or product!",
    },
}

export default promo_01_002
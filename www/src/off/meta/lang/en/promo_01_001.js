//  "Promosyon Tanımları"
const promo_01_001 =
{
    txtCode: "Code",        
    txtName: "Name",
    dtStartDate: "Start Date",
    dtFinishDate: "Finish Date",
    cmbDepot: "Depot",
    txtCustomerCode: "Customer Code",
    txtCustomerName: "Customer Name",
    cmbPrmType: "Promotion Type",
    txtPrmItem: "Product",
    btnPrmItem: "Promotion Product Selection / Product List", 
    txtPrmItemGrp: "Group",
    txtPrmQuantity: "Quantity",
    txtPrmAmount: "Amount",
    cmbRstType: "Type",
    txtRstQuantity: "Value",
    txtRstItem : "Product",
    cmbRstItemType: "Type",
    txtRstItemQuantity: "Quantity",
    txtRstItemAmount: "Value",
    txtCodePlace: "Please enter the promotion code you want to define",
    txtNamePlace: "Please enter the promotion name you want to define",
    txtCustomerCodePlace: "You can select the customer you want to define the promotion",
    txtRstItemPlace: "Please select the product you want to apply the promotion",
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
        btnItem: "Select the product you want to apply the promotion"
    },
    msgRef:
    {
        title: "Attention",
        btn01: "Go to Promotion",
        btn02: "OK",
        msg: "The promotion you entered is already in the system!"
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
    msgNewPage:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to open a new page?"
    },
    pop_PrmItemList:
    {
        title: "Selected Products",
        clmCode: "Code",
        clmName: "Name", 
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
        item: "Product",
        generalAmount: "General Amount",
        discountRate: "Discount Rate",
        moneyPoint: "Money Point",
        giftCheck: "Gift Check",
        generalDiscount: "General Discount",
        discountAmount: "Discount Amount",
        promoType01: "Condition",
        promoType02: "Application",
    },
    msgHelp:
    {
        title: "Description",
        btn01: "OK",
        condItemQuantity: "For the product or products you want to define the promotion, please determine the number of products for which the promotion will be valid. For example: If you set the value to 5, the promotion will be valid from the 5th product onwards.",
        condItemAmount: "For the product or products you want to define the promotion, please determine the total amount from which the promotion will be valid. For example: If you set the amount to 10€, the promotion will be valid from the total amount of the selected products 10€ olduktan sonra geçerli olacaktır.",
        condGeneralAmount: "Please determine the total amount from which you want to apply the promotion. For example: If you set the amount to 10€, the promotion will be valid from the total amount of the selected products 10€ olduktan sonra geçerli olacaktır.",
        appDiscRate: "Please determine the discount rate to be applied when the condition is met. For example: When the condition is met, apply a %10 discount.",
        appDiscAmount: "Please determine the price to be applied when the condition is met. For example: When the condition is met, apply a 0,99€ price to the selected products.",
        appPoint: "Please determine the amount of points to be given to the customer when the condition is met. For example: When the condition is met, add 100 points to the customer's card.",
        appGiftCheck: "Please determine the amount of the gift check to be given to the customer when the condition is met. For example: When the condition is met, give a 100€ gift check to the customer.",
        appGeneralAmount: "Please determine the amount of the general discount to be applied when the condition is met. For example: When the condition is met, apply a 10€ discount to the ticket total amount.",
        appItemQuantity: "Please determine the number of products for which the promotion will be valid. For example: If you set the value to 5, the promotion will be valid from the 5th product onwards.",
        appItemAmount: "Please determine the price to be applied when the condition is met. For example: If you set the price to 1€ or %10, the promotion will be valid from the 5th product onwards.",
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
    msgQuantityOrAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please enter the quantity or amount!",
    },
}

export default promo_01_001
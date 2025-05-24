// "Proforma Alış Faturası"
const ftr_04_003 =
{
    txtRefRefno : "Series-Sequence",
    cmbDepot: "Depot",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Document Discount",
    txtSubTotal : "Subtotal",
    txtMargin : "Margin",
    txtVat : "Vat",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    getDispatch : "Get Dispatch",
    getPayment : "Payment Entry",
    cash : "Cash",
    description :"Description",
    checkReference : "Reference",
    btnCash : "Add Payment",
    btnCheck : "Check",
    btnBank : "Bank Transfer",
    cmbCashSafe : "Cash Selection",
    cmbCheckSafe : "Check Safe",
    cmbBank : "Bank Selection",
    txtPayInvoıceTotal : "Invoice Amount",
    txtPayTotal : "Payment Total",
    txtRemainder : "Invoice Remainder",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    getOrders : "Get Order",
    popExcel : {title:"Excel File Row Headers Must Be Correct"},
    excelAdd : "Record from Excel",
    shemaSave : "Save Schema",
    tabTitleSubtotal : "Invoice Total",
    tabTitlePayments : "Invoice Payment Information",
    txtDiffrentTotal : "Total Difference",
    tabTitleOldInvoices : "Old Invoice Information",
    txtDiffrentNegative : "Price Decrease Difference",
    txtDiffrentPositive : "Price Increase Difference",
    txtDiffrentInv : "Price Difference Invoice",
    txtbalance : "Customer Total Balance",
    getRemainder : "Get Remainder",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtExpFee : "Late Fee",
    dtExpDate : "Due Date", 
    getOffers : "Get Offers",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    validDesign : "Please select the design.",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description in your mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The invoice cannot be processed without being saved !"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sending failed !"
    },
    popMailSend : 
    {
        title :"Send Mail",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to Send"
    },
    pg_Docs : 
    {
        title : "Invoice Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmOutputName : "CUSTOMER NAME",
        clmOutputCode  : "CUSTOMER CODE",
        clmTotal : "VAT TOTAL"
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    pg_txtItemsCode : 
    {
        title : "Product Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmPrice : "PURCHASE PRICE"
    },
    pg_dispatchGrid : 
    {
        title : "Dispatch Selection",
        clmReferans : "Series - Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmPrice : "Price",
        clmTotal : "Total",
        clmDate : "Date",
    },
    grdPurcInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Price",
        clmQuantity : "Quantity",
        clmDiscount : "Discount",
        clmDiscountRate : "Discount %",
        clmVat : "VAT",
        clmAmount : "Amount",
        clmTotal : "Total",
        clmTotalHt : "Total Ex VAT",
        clmDispatch : "Dispatch No",
        clmCreateDate: "Create Date",
        clmMargin :"Margin",
        clmDiffPrice : "Difference",
        clmCustomerPrice : "Customer Price",
        clmDescription :"Description",
        clmCuser :"User",
        clmPartiLot :"Lot Number",
    },
    pg_partiLot :
    {
        title : "Parti Lot Selection",
        clmPartiLot :"Lot Number",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Safe",
        clmTypeName: "Type",
        clmPrice: "Price",
        clmCreateDate: "Create Date",

    },
    popPayment:
    {
        title: "Payments",
    },
    popDiscount : 
    {
        title: "Line Discount",
        chkFirstDiscount : "Update 1. Line Discount",
        chkDocDiscount : "Apply as Document Discount",
        Percent1 : "1. Discount %",
        Price1 : "1. Discount Amount",
        Percent2 : "2. Discount %",
        Price2 : "2. Discount Amount",
        Percent3 : "3. Discount %",
        Price3 : "3. Discount Amount"
    },
    popDocDiscount : 
    {
        title: "Document Discount",
        Percent1 : "1. Discount %",
        Price1 : "1. Discount Amount",
        Percent2 : "2. Discount %",
        Price2 : "2. Discount Amount",
        Percent3 : "3. Discount %",
        Price3 : "3. Discount Amount"
    },
    popPassword : 
    {
        title: "Please enter the administrator password to open the document",
        Password : "Password",
        btnApprove : "Approve"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed without being saved !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The remaining amount cannot be paid more than !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to save the document?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The save operation was successful !",
        msgFailed: "The save operation failed !"
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
        msg: "Do you want to delete the record?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to reset the VAT?"
    },
    msgDiscountPrice:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount cannot be greater than the amount !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount cannot be greater than the amount !"
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
    msgPayNotDeleted:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been paid and cannot be deleted !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed without being unlocked !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount cannot be greater than the amount !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product was not found !"
    },
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continue",
        btn02: "Cancel",
        msg: "The selected product is not defined for the customer! Do you want to continue?"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !"
    },
    msgUnderPrice1:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "You are selling below cost !! "
    },
    msgUnderPrice2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot sell below cost price !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Combine",
        btn02: "New Add",
        msg: "The product you want to add is already in the document! Do you want to combine the lines?"
    },
    msgCustomerSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the customer !"
    },
    popCash : 
    {
        title: "Cash Entry",
        btnApprove : "Add"
    },
    popCheck : 
    {
        title: "Check Entry",
        btnApprove : "Add"
    },
    popBank : 
    {
        title: "Bank Transfer Entry",
        btnApprove : "Add"
    },
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
        lang : "Document Language"
    },
    msgMissItemCode:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The following codes were not found :"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The number of added products is"
    },
    popMultiItem:
    {
        title: "Bulk Product Addition",
        btnApprove: "Get Products",
        btnClear : "Clear",
        btnSave : "Add Lines",
    },
    cmbMultiItemType : 
    {
        title : "Search Type",
        customerCode : "Supplier Code",
        ItemCode : "Product Code"
    },
    grdMultiItem : 
    {
        clmCode : "Product Code",
        clmMulticode : "Supplier Code",
        clmName : "Product Name",
        clmQuantity : "Quantity"
    },
    msgMultiData:
    {
        title: "Attention",
        btn01: "Clear List and Add All",
        btn02: "Add New Ones to List",
        msg: "The list contains products! "
    },
    popDetail:
    {
        title: "Document Content",
        count: "Total Lines",
        quantity: "Total Quantity",
        quantity2: "2. Unit Total",
        margin : "Margin"
    },
    grdUnit2 : 
    {
        clmName : "Name",
        clmQuantity : "Quantity"
    },
    popUnit2 : 
    {
        title : "Unit Details"
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
        btnFactorSave : "Update Product Card"
    },
    validRef :"Series Cannot Be Empty",
    validRefNo : "Sequence Cannot Be Empty",
    validDepot : "You must select a depot",
    validCustomerCode : "Customer Code Cannot Be Empty",
    validDocDate : "You must select a date",
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    msgNewPrice : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "Please select the products you want to update the supplier price."
    },
    msgNewPriceDate : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "Please select the products you want to update the price dates."
    },
    grdNewPrice: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmPrice: "Old Price",
        clmPrice2: "New Price",
        clmSalePrice :"Sale Price", 
        clmMargin : "Gross Margin",
        clmCostPrice : "Cost Price",
        clmNetMargin : "Net Margin"
    },
    grdNewPriceDate: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmPrice: "Old Price",
        clmPrice2: "New Price",
        clmSalePrice :"Sale Price", 
        clmMargin : "Gross Margin",
        clmCostPrice : "Cost Price",
        clmNetMargin : "Net Marj"
    },
    msgPriceDateUpdate :
    {
        msg : "Do you want to update the price dates of the unchanged prices?",
        btn01 : "Yes",
        btn02 : "No",
        title : "Attention"
    },
    msgNewVat : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "The invoice has different VAT rates in the system."
    },
    grdNewVat: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmVat: "VAT in the system",
        clmVat2: "New VAT",
    },
    serviceAdd : "Service Add",
    pg_service : 
    {
        title : "Services",
        clmCode : "Code",
        clmName : "Name"
    },
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
        title: "Quantity",
        btn01: "Add",
        msg: "Please enter the quantity"
    },
    cmbPayType : {
        title : "Payment Type",
        cash : "Cash",
        check : "Check",
        bankTransfer : "Bank Transfer",
        otoTransfer : "Automatic Payment",
        foodTicket : "Food Ticket",
        bill : "Bill",
    },  
    pg_adress : 
    {
        title : "Address Selection",
        clmAdress : "ADDRESS",
        clmCiyt : "CITY",
        clmZipcode : "POSTAL CODE",
        clmCountry : "COUNTRY",
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Go to Document",
        msg: "Document Found"
    },
    pg_offersGrid : 
    {
        title : "Order Selection",
        clmReferans : "Series - Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmTotal : "Total",
        clmPrice : "Price",
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
}

export default ftr_04_003
// "Fire ALış Faturası"
const  ftr_02_009 =
{
    txtRefRefno : "Series-Sequence",
    cmbDepot: "Depot",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Invoice Discount",
    txtSubTotal : "Subtotal",
    txtMargin : "Margin",
    txtVat : "VAT",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    getPayment : "Payment Entry",
    getDispatch : "Get Dispatch",
    cash : "Cash",
    description :"Description",
    checkReference : "Reference",
    btnCash : "Add Cash",
    btnCheck : "Add Check",
    btnBank : "Add Bank Transfer",
    cmbCashSafe : "Cash Selection",
    cmbCheckSafe : "Check Safe",
    cmbBank : "Bank Selection",
    txtPayInvoıceTotal : "Invoice Amount",
    txtPayTotal : "Payment Total",
    txtRemainder : "Remainder",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    tabTitleSubtotal : "Invoice Total",
    tabTitlePayments : "Document Payment Information",
    tabTitleOldInvoices : "Past Invoice Information",
    getRemainder : "Get Remainder",
    txtbalance : "Customer Total Balance",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtExpFee : "Late Fee",
    dtExpDate : "Due Date", 
    getProforma : "Get Proforma",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description to your mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "Ok",
        msg: "The document cannot be processed without being saved !"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "Ok",
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
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmOutputName : "CUSTOMER NAME",
        clmOutputCode  : "CUSTOMER CODE",
        clmTotal : "VAT INCLUDED TOTAL"
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
        clmMulticode: "SUPPLIER CODE",
        clmPrice : "SALES PRICE"
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
    grdRebtInv: 
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
        clmTotalHt : "VAT EXCLUDED TOTAL",
        clmDispatch : "Dispatch No",
        clmDateDispatch : "Date",
        clmCreateDate: "Create Date",
        clmMargin :"Margin",
        clmDescription :"Description",
        clmCuser :"User",
        clmMulticode : "Supplier Code",
        clmBarcode : "Barcode",
        clmVatRate :"VAT %",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Cash",
        clmTypeName: "Type",
        clmPrice: "Price",
        clmCreateDate: "Create Date",

    },
    popPayment:
    {
        title: "Collections",
    },
    popDiscount : 
    {
        title: "Line Discount",
        chkFirstDiscount : "Update Line 1 Discount",
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
        btn01: "Ok",
        msg: "The document cannot be processed without being saved !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The amount cannot be greater than the remaining amount !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Cancel",
        msg: "Do you want to save the document ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "Ok",
        msgSuccess: "The save operation was successful !",
        msgFailed: "The save operation failed !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "Please fill in the required fields !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Cancel",
        msg: "Do you want to delete the record ?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "Ok",
        btn02: "Cancel",
        msg: "Do you want to reset the VAT ?"
    },
    msgDiscountPrice:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The discount cannot be greater than the amount !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The discount cannot be greater than the amount !"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The document has been saved and locked !"
    },
    msgPasswordSucces:
    {
        title: "Success",
        btn01: "Ok",
        msg: "The document has been unlocked !",
    },
    msgPasswordWrong:
    {
        title: "Failed",
        btn01: "Ok",
        msg: "Your password is incorrect !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The document is locked ! \n Please unlock the document with the administrator password !"
    },
    msgPayNotDeleted:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The document cannot be deleted because it has been paid !" 
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The document cannot be processed because it is locked !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The discount cannot be greater than the amount !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The product was not found !!"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The customer was not found !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Combine",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to combine the lines ?"
    },
    msgCustomerSelect:
    {
        title: "Attention",
        btn01: "Ok",
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
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    validRef :"Series cannot be empty",
    validRefNo : "Sequence cannot be empty",
    validDepot : "You must select a depot",
    validCustomerCode : "Customer code cannot be empty",
    validDocDate : "You must select a date",
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
        msg: "Enter Quantity"
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
    popDetail:
    {
        title: "Document Content",
        count: "Total Lines",
        quantity: "Total Quantity",
        quantity2: "2. Unit Total",
        margin : "Margin"
    },
    popUnit2 : 
    {
        title : "Unit Details"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Quantity"
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
    pg_proformaGrid : 
    {
        title : "Proforma Selection",
        clmReferans : "Series - Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmPrice : "Price",
        clmTotal : "Total"
    },
    popRound : 
    {
        title : "Please enter the amount you want to round",
        total : "Total",
    },
    msgWorngRound:
    {
        title: "Attention",
        btn01: "Ok",
        msg1: "The maximum difference between the amounts you want to round is",
        msg2: "!"
    },
    msgDiscountEntry : 
    {
        title : "Amount-Based Discount Entry",
        btn01 : "Approve"
    },
    txtDiscount1 : "1. Discount Amount",
    txtDiscount2 : "2. Discount Amount",
    txtDiscount3 : "3. Discount Amount",
    txtTotalDiscount :"Total Discount Amount",
    msgDiscountPerEntry : 
    {
        title : "Percentage Discount Entry",
        btn01 : "Approve"
    },
    txtDiscountPer1 : "1. Discount %",
    txtDiscountPer2 : "2. Discount %",
    txtDiscountPer3 : "3. Discount %",
    serviceAdd : "Service Add",
    pg_service : 
    {
        title : "Services",
        clmCode : "Code",
        clmName : "Name"
    },
    msgMissItemCode:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The following codes were not found :"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "Ok",
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
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    popMailSend : 
    {
        title :"Send Mail",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to Send"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "Ok",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sending failed !"
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "Ok",
        msg: "The product cannot be changed after it is added !"
    },
}

export default ftr_02_009
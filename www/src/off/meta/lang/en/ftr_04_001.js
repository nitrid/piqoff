// "Proforma Fiyat Farkı Faturası"
const ftr_04_001 =
{
    txtRefRefno : "Series-Sequence",
    cmbDepot: "Depo",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Document Discount",
    txtSubTotal : "Subtotal",
    txtMargin : "Margin",
    txtVat : "VAT",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    getContract : "Purchase Invoice Selection",
    getPayment : "Payment Entry",
    cash : "Cash",
    description :"Description",
    checkReference : "Reference",
    btnCash : "Cash",
    btnCheck : "Check",
    btnBank : "Bank Transfer",
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
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    validDesign : "Please select the design.",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description to your mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be saved without being saved !"         
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
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The amount cannot be less than 0 !"
    },
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmInputName : "CUSTOMER NAME",
        clmInputCode  : "CUSTOMER CODE",
        clmTotal : "TOTAL VAT"
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
        clmPrice : "SALES PRICE"
    },
    pg_contractGrid : 
    {
        title : "Invoice Selection",
        clmReferans : "Series - Sequence",
        clmDocDate : "Document Date",
        clmTotal : "Amount"
    },
    grdDiffInv: 
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
        clmCreateDate: "Create Date",
        clmInvNo : "Invoice No",
        clmInvDate : "Invoice Date",
        clmDescription :"Description",
        clmCuser :"User",
        clmMulticode : "Supplier Code",
        clmCustomerPrice : "Customer Price",
        clmPurcPrice : "Invoice Price",
        clmVatRate : "VAT %"
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
        title: "You must enter the administrator password to open the document",
        Password : "Password",
        btnApprove : "Approve"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information must be filled before adding the product !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to save the document ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The save operation is successful !",
        msgFailed: "The save operation is failed !"
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
    msgVatDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to reset the VAT ?"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The amount cannot be greater than the remaining amount !"
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
        title: "Attention",
        btn01: "OK",
        msg: "Your password is incorrect !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n You must unlock it with the administrator password to save the changes !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed until it is unlocked !"
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
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Merge",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to merge the lines ?"
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
    validDepot : "You must select a warehouse",
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
        title: "Quantunyty",
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
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "This line has been converted to an invoice. You cannot change it!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "This line has been converted to an invoice. You cannot delete it!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "There is a line converted to an invoice in your document. This document cannot be deleted!"
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
    serviceAdd : "Service Add",
    pg_service : 
    {
        title : "Services",
        clmCode : "Code",
        clmName : "Name"
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
}

export default ftr_04_001
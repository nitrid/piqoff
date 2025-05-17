// "Fiyat Farkı Alış Faturası"
const ftr_02_006 =
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
    txtbalance : "Customer Total Balance",
    getProforma : "Get Proforma",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtExpFee : "Late Fee",
    dtExpDate : "Due Date", 
    btnView : "View",
    btnMailsend : "Send Mail",
    validDesign : "Please select the design.",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description in the mail.",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmOutputName : "CUSTOMER NAME",
        clmOutputCode  : "CUSTOMER CODE",
        clmTotal : "TOTAL"
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
        clmReferans : "Series-Sequence",
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
        title: "Collections",
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
        msg: "The document header information is not complete !"
    },
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed without being saved !"         
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to save the document ?"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sending is successful !",
        msgFailed: "Mail sending is failed !"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The record is successful !",
        msgFailed: "The record is failed !"
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
        msg: "The amount of the remaining balance cannot be greater than the amount of the payment !"
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
        msg: "The document has been locked !",
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
        msg: "The document is locked ! \n You must unlock it with the administrator password to save changes !"
    },
    msgPayNotDeleted:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document with the payment cannot be deleted !" 
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
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Combine",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to combine the lines ?"
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
        msg: "Enter the quantity"
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
    popRound : 
    {
        title : "Please enter the amount you want to round",
        total : "Amount",
    },
    msgWorngRound:
    {
        title: "Attention",
        btn01: "OK",
        msg1: "The maximum difference between the amounts you want to round is",
        msg2: " !"
    },
    msgDiscountEntry : 
    {
        title : "Amount Discount Entry",
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
        customerCode : "By Supplier Code",
        ItemCode : "By Product Code"
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
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
    popMailSend : 
    {
        title :"Send E-Mail",
        txtMailSubject : "E-Mail Subject",
        txtSendMail : "E-Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to be sent"
    },
}

export default ftr_02_006
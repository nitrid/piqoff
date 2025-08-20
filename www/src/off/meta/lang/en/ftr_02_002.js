// "Satış Faturası"
const  ftr_02_002 =
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
    getDispatch : "Get Dispatch",
    getPayment : "Payment Entry",
    cash : "Cash",
    description :"Description",
    checkReference : "Reference",
    checkDate : "Date",
    btnCash : "Add Cash",
    btnCheck : "Check",
    btnBank : "Bank Transfer",
    cmbCashSafe : "Cash Selection",
    cmbCheckSafe : "Check Safe",
    cmbBank : "Bank Selection",
    txtPayInvoıceTotal : "Invoice Total",
    txtPayTotal : "Payment Total",
    txtRemainder : "Remainder",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    getOrders : "Get Order",
    tabTitleSubtotal : "Invoice Total",
    tabTitlePayments : "Invoice Payment Information",
    tabTitleOldInvoices : "Old Invoices Information",
    getRemainder : "Get Remainder",
    txtbalance : "Customer Total Balance",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtExpFee : "Late Fee",
    dtExpDate : "Due Date", 
    getOffers : "Get Offer", 
    getProforma : "Get Proforma",
    placeMailHtmlEditor : "You can enter a description to your mail.",
    validDesign : "Please select a design.",
    validMail : "Please do not leave blank.",
    getPreInvoice : "Get Pre-Invoice",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    extraCost : "Extra Cost",
    cmbPricingList : "Pricing List",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description to your mail.",
    msgControlOfFacture:
    {
        title: "Attention",
        btn01: "OK",
        msg: "This dispatch has already been converted to a facture. If you want to create a facture, please select the facture in the sales invoice module. This action will be closed."
    },
    msgControlOfDispatch: 
    {
        title: "Attention",
        btn01: "OK",
        msg: "This document has already been converted to a dispatch. If you want to create a facture, please pass the facture module and select the dispatch."
    },
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "Document is not saved !"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sent failed !"
    },
    popMailSend : 
    {
        title :"Send Mail",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to send"
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
        clmPrice : "SALES PRICE",
        clmMainGrp : "MAIN GROUP",
        clmRayon : "RAYON"
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
        clmDocNo : "Document No"
    },
    grdSlsInv: 
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
        clmDescription :"Description",
        clmCuser :"User",
        clmVatRate : "VAT %",
        clmOrigin : "Origin",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
        clmPartiLot : "Lot Code",
        clmUnit : "Unit",
    },
    pg_partiLot : 
    {
        title : "Lot Selection",
        clmLotCode : "Lot Code",
        clmSkt : "EXP",
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
        msg: "The document header is not complete, so products cannot be added !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "More than the remaining amount cannot be paid !"
    },
    msgInterfel:
    {
        title: "Attention",
        btn01: "Yes",
        btn02: "No",
        msg: "Should Interfel be applied?"
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
        msg: "Do you want to delete the record?"
    },
    msgMaxPriceAlert:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You do not have permission to enter a price higher than €"
    },
    msgMaxUnitQuantity:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You do not have permission to enter a quantity higher than"
    },
    msgRowNotUpdate:
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "This line is from the dispatch, so the quantity cannot be changed!"   
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
        msg: "The discount cannot be greater than the amount!"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount cannot be greater than the amount!"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been saved and locked!"
    },
    msgPasswordSucces:
    {
        title: "Success",
        btn01: "OK",
        msg: "The document has been unlocked!",
    },
    msgPasswordWrong:
    {
        title: "Failed",
        btn01: "OK",
        msg: "Your password is incorrect!"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked! \n You must unlock it with the administrator password to save changes!"
    },
    msgPayNotDeleted:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been paid and cannot be deleted!"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed until it is unlocked!"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount cannot be greater than the amount!"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product was not found!!"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found!!"
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
        msg: "Please select the customer!"
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
        msg: "The following codes were not found:"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The number of added products:"
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
        msg: "There are products in the list! "
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    validRef :"Series cannot be empty",
    validRefNo : "Sequence cannot be empty",
    validDepot : "You must select a depot",
    validCustomerCode : "Customer Code cannot be empty",
    validDocDate : "You must select a date. (Ex : D90, 90 days after the selected date will be automatically entered.)",
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    msgNotQuantity:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The depot quantity is closed to zero! The maximum quantity that can be added is:"
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
    popDetail:
    {
        title: "Invoice Content",
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
    pg_offersGrid : 
    {
        title : "Offer Selection",
        clmReferans : "Series - Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmTotal : "Total",
        clmPrice : "Price",
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
    popMailSend : 
    {
        title :"Send Mail",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to send"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sent failed !"
    },
    msgPrintforLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be printed until it is locked !"
    },
    popRound : 
    {
        title : "Please enter the amount you want to round",
        total : "Total",
    },
    msgWorngRound:
    {
        title: "Attention",
        btn01: "OK",
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
    popExtraCost: 
    {
        title : "Extra Costs",
        interfel : "Interfel",
        calculateInterfel : "Calculate Interfel",
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
    cmbExpiryType : "Payment Type",
    cmbTypeData : 
    {
        encaissement : "Deferred",
        debit : "Cash",
    },
    dispatchWarning : "There are pending dispatches.",
    orderWarning : "There are pending orders.",
    txtOpenBalance : "Open Balance",
}

export default ftr_02_002
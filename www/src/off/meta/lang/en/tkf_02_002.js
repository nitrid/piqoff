// "Satış Teklifi"
const tkf_02_002 =
{
    txtRefRefno : "Series-Row",
    cmbDepot: "Depo",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Document Discount",
    txtSubTotal : "Sub Total",
    txtMargin : "Margin",
    txtVat : "Vat",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    btnView : "View",
    btnMailsend : "Send Mail",
    placeMailHtmlEditor : "You can enter a description in the mail.",
    validDesign : "Please select the design.",
    validMail : "Please do not leave blank.",
    cmbPricingList : "Pricing List",
    LINE_NO : "Line No",
    btnSelectDispatch : "Convert to Dispatch",
    btnSelectInvoice : "Convert to Invoice",
    msgTransform :
    {
        title : "Convert Document",
        btnDispatch : "Dispatch",
        btnInvoice : "Invoice",
        msg : "Do you want to convert the document to a dispatch or invoice ?"
    },
    msgTransformConfirm :
    {
        title : "Convert Document",
        msgDispatch : "Do you want to convert the document to a dispatch ?",
        msgInvoice : "Do you want to convert the document to an invoice ?",
        btn01 : "Yes",
        btn02 : "No"
    },
    popTransformSelect :
    {
        title : "Convert Document",
    },
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document has not been saved. The operation cannot be performed!"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully!",
        msgFailed: "Mail sending failed!"
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
        clmInputName : "CUSTOMER NAME",
        clmInputCode  : "CUSTOMER CODE",
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
    pg_transportSelect : 
    {
        title : "Transport Selection",
        clmName : "TRANSPORT NAME",
        clmAdress : "ADDRESS",
        clmCity : "CITY",
        clmZipCode : "POSTAL CODE",
        clmCountry : "COUNTRY",
    },
    grdSlsOffer: 
    {
        clmItemCode: "CODE",
        clmItemName: "NAME",
        clmPrice: "PRICE",
        clmQuantity : "QUANTITY",
        clmDiscount : "DISCOUNT",
        clmDiscountRate : "DISCOUNT %",
        clmVat : "VAT",
        clmAmount : "AMOUNT",
        clmTotal : "TOTAL",
        clmTotalHt : "TOTAL EX VAT",
        clmCreateDate: "CREATION DATE",
        clmMargin :"MARGIN",
        clmDescription :"DESCRIPTION",
        clmCuser :"USER",
        clmBarcode :"BARCODE",
        clmVatRate : "VAT %",
        clmSubFactor : "Unit Factor",
        clmSubQuantity : "Unit Quantity",
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
        msg: "The document header information is not complete. Product cannot be entered !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the document ?"
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
        msg: "Are you sure you want to delete the record ?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Do you want to reset the tax ?"
    },
    msgDiscountPrice:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount amount cannot be greater than the amount !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount amount cannot be greater than the amount !"
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
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be unlocked because it has been converted to an order !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n You must unlock it with the administrator password to save changes !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be unlocked !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The discount amount cannot be greater than the amount !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product is not found !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer is not found !"
    },
    msgUnderPrice1:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "You are selling at a lower cost !!"
    },
    msgUnderPrice2:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "The cost price cannot be lower than the sales price !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Combine",
        btn02: "New Add",
        msg: "The product you want to add is already in the document ! Do you want to combine the lines ?"
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
        msg: "The following codes are not found :"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The number of products added :"
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
    popDetail:
    {
        title: "Document Content",
        count: "Total Lines",
        quantity: "Total Quantity",
        quantity2: "2. Unit Total",
        margin : "Margin"
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    validRef :"Series Cannot Be Empty",
    validRefNo : "Row Cannot Be Empty",
    validDepot : "You Must Select a Depot",
    validCustomerCode : "Customer Code Cannot Be Empty",
    validDocDate : "You Must Select a Date",
    tagItemCodePlaceholder: "Please Enter the Codes You Want to Add",
    msgQuantity:
    {
        title: "Quantity",
        btn01: "Add",
        msg: "Please Enter the Quantity"
    },
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
    },
    msgRowNotUpdate:
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "This Row Has Been Converted to an Order. You Cannot Make Changes!"   
    },  
    msgRowNotDelete :
    {
        title: "Attention",  
        btn01: "OK",  
        msg: "This Row Has Been Converted to an Order. You Cannot Delete It!"  
    },
    msgdocNotDelete : 
    {
        title: "Attention",   
        btn01: "OK",   
        msg: "Your document has a row that has been converted to an order. This document cannot be deleted!"   
    },
    msgCode :
    {
        title: "Attention",
        btn01: "Go to Document",
        msg: "Document Found"
    },
    popMailSend : 
    {
        title :"E-Mail Gönder",
        txtMailSubject : "E-Mail Subject",
        txtSendMail : "E-Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to Send"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully!",
        msgFailed: "Mail sending failed!"
    },
    txtDiscount1 : "1. Discount Amount",
    txtDiscount2 : "2. Discount Amount",
    txtDiscount3 : "3. Discount Amount",
    txtTotalDiscount :"Total Discount Amount",
    msgDiscountPerEntry : 
    {
        title : "Proportional Discount Entry",
        btn01 : "Approve"
    },
    txtDiscountPer1 : "1. Discount Percentage",
    txtDiscountPer2 : "2. Discount Percentage",
    txtDiscountPer3 : "3. Discount Percentage",
    txtTotalHt: "Total Ex VAT",
    popDetail:
    {
        title: "Document Content",
        count: "Total Lines",
        quantity: "Total Quantity",
        quantity2: "2. Unit Total",
        margin : "Margin"
    },
}

export default tkf_02_002
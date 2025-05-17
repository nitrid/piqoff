// "Pos Satış Sipariş"
const sip_02_003 = 
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
    txtVat : "Vat",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity : "Quantity",
    getOffers : "Get Offers",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    btnView : "View",
    btnMailsend : "Send Mail",
    placeMailHtmlEditor : "You can enter a description in the mail.",
    validDesign : "Please select the design.",
    validMail : "Please do not leave blank.",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    cmbPricingList : "Pricing List",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description in the mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "Document cannot be saved without saving !"         
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
        cmbMailAddress : "Mail Address to be sent"
    },
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmInputName : "CUSTOMER NAME",
        clmInputCode  : "CUSTOMER CODE",
        clmAddress : "ADDRESS",
        clmClosed: "Cashier Status",
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
        clmBarcode : "BARCODE"
    },
    grdSlsOrder: 
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
        clmOffer : "OFFER NO",
        clmBarcode : "BARCODE",
        clmVatRate : "VAT %",
        clmSubQuantity : "SUB QUANTITY",
        clmSubPrice : "SUB PRICE",
        clmSubFactor : "FACTOR",
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
        msg: "The document cannot be saved without entering the product information !"
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
        msg: "The password is incorrect !"
    },
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been converted to an invoice and cannot be locked !"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n Please unlock it with the administrator password !"
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
        msg: "The following codes were not found :"
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
        btn02: "Add Newly Written",
        msg: "There are products in the list! "
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    validRef :"Series cannot be empty",
    validRefNo : "Sequence cannot be empty",
    validDepot : "Depo must be selected",
    validCustomerCode : "Customer Code cannot be empty",
    validDocDate : "Date must be selected",
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    msgQuantity:
    {
        title: "Quantity",
        btn01: "Add",
        msg: "Please enter the quantity"
    },
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
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
    msgCustomerSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the customer !"
    },
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "This row has been converted to a delivery or invoice and cannot be changed!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "This row has been converted to a delivery or invoice and cannot be deleted!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "There is a row converted to a delivery or invoice in your document. This document cannot be deleted!"
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
    msgDuplicateItems : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "There are multiple products with the same product code in the order list:\n"
    },
    popMailSend : 
    {
        title :"Send Mail",
        txtMailSubject : "Mail Subject",
        txtSendMail : "Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to be sent"
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sent failed !"
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
    txtDiscountPer1 : "1. Discount Rate",
    txtDiscountPer2 : "2. Discount Rate",
    txtDiscountPer3 : "3. Discount Rate",
    popDetail:
    {
        title: "Document Content",
        count: "Total Lines",
        quantity: "Total Quantity",
        quantity2: "2. Unit Total",
        margin : "Margin"
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
}

export default sip_02_003
// "Alış Sipariş"
const sip_02_001 =
{
    txtRefRefno : "Series-Sequence",
    cmbDepot: "Warehouse",
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
    validDesign : "Please select the design.",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description in your mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be processed without being saved !"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sending failed !"
    },
    msgDuplicateItems : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "Attention! There are multiple products with the same product code in the order list:\n"
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
        clmMulticode : "SUPPLIER CODE",
        clmPrice : "PURCHASE PRICE"
    },
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
    },
    grdPurcOrders: 
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
        clmMargin :"Margin",
        clmMulticode :"Supplier Code",
        clmBarcode :"Barcode",
        clmDescription :"Description",
        clmCuser :"User",
        clmOffer : "Offer No",
        clmVatRate : "VAT %",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
    },
    popDiscount : 
    {
        title: "Line Discount",
        chkFirstDiscount : "Update 1. Discount in Line",
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
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
        lang : "Document Language"
    },
    msgDocValid:
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
        msg: "Are you sure you want to delete the record ?"
    },
    msgVatDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the VAT ?"
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
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be unlocked because it has been converted to an invoice !"
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
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continue",
        btn02: "Cancel",
        msg: "The selected product is not defined for the customer ! Do you want to continue ?"
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
        btn02: "Add New Ones to List",
        msg: "There are products in the list! "
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    txtTotalHt : "Total Ht",
    validRef :"Series cannot be empty",
    validRefNo : "Sequence cannot be empty",
    validDepot : "You must select a warehouse",
    validCustomerCode : "Customer Code cannot be empty",
    validDocDate : "You must select a date",
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    popUnderPrice :
    {
        title : "This product has a cheaper supplier"
    },
    grdUnderPrice :
    {
        clmItemName :"Product",
        clmCustomerName : "Customer Name",
        clmPrice : "Price",
        clmCode : "Code",
        clmMulticode : "Supplier Code"
    },
    msgQuantity:
    {
        title: "Quantity",
        btn01: "Add",
        msg: "Please enter the quantity"
    },
    pg_offersGrid : 
    {
        title : "Offer Selection",
        clmReferans : "Series-Sequence",
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
        msg: "This line has been converted to a dispatch or invoice. You cannot change it!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "This line has been converted to a dispatch or invoice. You cannot delete it!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "This document has a line that has been converted to a dispatch or invoice. This document cannot be deleted!"
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
        msg: "Document found"
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
    txtDiscountPer1 : "1. Discount Rate",
    txtDiscountPer2 : "2. Discount Rate",
    txtDiscountPer3 : "3. Discount Rate",
    txtTotalHt : "Discounted Total",
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added!"
    },
}

export default sip_02_001
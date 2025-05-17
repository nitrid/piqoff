// "İade İrsaliyesi"
const irs_02_003 =
{
    getRebate : "Get Rebate from Return Deposit",
    txtRefRefno : "Serial-Sequence",
    cmbDepot: "Depot",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Document Discount",
    txtSubTotal : "Sub Total",
    txtMargin : "Margin",
    txtVat : "VAT",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtDocNo : "Document No",
    btnView : "View",
    btnMailsend : "Send Mail",
    placeMailHtmlEditor : "You can enter a description in the mail.",
    validDesign : "Please select a design.",
    validMail : "Please do not leave blank.",
    txtTotalHt : "Discounted Amount",
    txtUnitPrice: "Unit Price",
    txtDocNo : "Document No",
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIAL",
        clmRefNo : "SEQUENCE",
        clmInputName : "CUSTOMER NAME",
        clmInputCode  : "CUSTOMER CODE",
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
        clmPrice : "PURCHASE PRICE"
    },
    pg_RebateGrid : 
    {
        title : "Return Product Selection",
        clmCode :  "PRODUCT CODE",
        clmName : "PRODUCT NAME",
        clmQuantity :"QUANTITY"
    },
    pg_dispatchGrid : 
    {
        title : "Dispatch Selection",
        clmReferans : "Serial-Sequence",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Quantity",
        clmPrice : "Price",
        clmTotal : "Total",
        clmDate : "Date",
        clmDocNo : "Document No"
    },
    grdRebtDispatch: 
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
        clmDescription :"Description",
        clmCuser :"User",
        clmMulticode : "Supplier Code",
        clmBarcode : "Barcode",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
        clmInvoiceRef : "Invoice No",
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
    msgMissItemCode:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The following codes were not found:"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information is not complete, product cannot be added !"
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
        title: "Failed",
        btn01: "OK",
        msg: "Your password is incorrect !"
    },
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been converted to an invoice and cannot be unlocked !"
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
        msg: "The document is locked ! \n You cannot perform any operations until it is unlocked !"
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
        msg: "The product was not found !!"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !!"
    },
    msgUnderPrice1:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "You are selling at a lower cost !! "
    },
    msgUnderPrice2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The cost price cannot be lower than the cost price !!"
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
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
    },
    validRef :"Serial Cannot Be Empty",
    validRefNo : "Sequence Cannot Be Empty",
    validDepot : "You Must Select a Warehouse",
    validCustomerCode : "Customer Code Cannot Be Empty",
    validDocDate : "You Must Select a Date",
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
        msg: "Please Enter the Quantity"
    },
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "This Line Has Been Converted to Invoice, Cannot Be Updated!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "This Line Has Been Converted to Invoice, Cannot Be Deleted!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "Your document has a line converted to invoice. This document cannot be deleted!"
    },
    pg_adress : 
    {
        title : "Adres Seçimi",
        clmAdress : "ADDRESS",
        clmCiyt : "CITY",
        clmZipcode : "POSTAL CODE",
        clmCountry : "COUNTRY",
    },
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continue",
        btn02: "Cancel",
        msg: "The selected product is not defined for the customer! Do you want to continue?"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Go to Document",
        msg: "Document Found"
    },
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
        btn01: "OK",
        msgSuccess: "Mail sent successfully !",
        msgFailed: "Mail sending failed !"
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
    txtDiscountPer1 : "1. Discount Percent",
    txtDiscountPer2 : "2. Discount Percent",
    txtDiscountPer3 : "3. Discount Percent",
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after being added to the customer!"
    },
}

export default irs_02_003
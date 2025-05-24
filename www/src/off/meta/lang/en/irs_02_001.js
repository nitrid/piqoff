// "Alış İrsaliyesi"
const irs_02_001 = 
{
    txtRefRefno : "Serial-Sequence",
    cmbDepot: "Warehouse",
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
    getOrders : "Get Orders",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    cmbOrigin : "Origin",
    validDesign : "Please Select Design",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please Do Not Leave Blank.",
    placeMailHtmlEditor : "You can enter a description to your mail.",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "Document Not Saved, Operation Not Possible !"         
    },
    msgMailSendResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Mail Sent Successfully !",
        msgFailed: "Mail Sending Failed !"
    },
    popMailSend : 
    {
        title :"Send E-Mail",
        txtMailSubject : "E-Mail Subject",
        txtSendMail : "E-Mail Address",
        btnSend : "Send",
        cmbMailAddress : "Mail Address to Send"
    },
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIAL",
        clmRefNo : "SEQUENCE",
        clmOutputName : "CUSTOMER NAME",
        clmOutputCode  : "CUSTOMER CODE",
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
        title : "Item Selection",
        clmCode :  "ITEM CODE",
        clmName : "ITEM NAME",
        clmMulticode : "SUPPLIER CODE",
        clmPrice : "PURCHASE PRICE"
    },
    grdPurcDispatch: 
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
        clmCreateDate: "Record Date",
        clmMargin :"Margin",
        clmDescription :"Description",
        clmOrder : "Order No",
        clmCuser :"User",
        clmMulticode : "Supplier Code",
        clmVatRate : "VAT %",
        clmOrigin : "Origin",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
        clmDiffPrice : "Difference",
        clmCustomerPrice : "Customer Price",
        clmInvoiceRef : "Invoice No",
        clmPartiLot : "Lot Number",
    },
    pg_partiLot : 
    {
        title : "Lot Selection",
        clmLotCode : "Lot Number",
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
        title: "Please Enter Admin Password to Open Document",
        Password : "Password",
        btnApprove : "Approve"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Header Information is Not Complete, Product Cannot Be Entered !"
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
        msgSuccess: "Save operation is successful !",
        msgFailed: "Save operation is failed !"
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
        msg: "Discount Amount Cannot Be Greater Than the Amount !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Discount Amount Cannot Be Greater Than the Amount !"
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Saved and Locked !"
    },
    msgPasswordSucces:
    {
        title: "Success",
        btn01: "OK",
        msg: "Document Unlocked !",
    },
    msgPasswordWrong:
    {
        title: "Failed",
        btn01: "OK",
        msg: "Your Password is Incorrect !"
    },
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Converted to Invoice Cannot Be Unlocked"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Locked ! \n Please Unlock with Admin Password to Save Changes !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Cannot Be Opened Without Being Unlocked !"
    },
    msgDiscount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Discount Amount Cannot Be Greater Than the Amount !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Item Not Found !!"
    },
    msgCustomerNotFound:
    {
        title: "Attention",
        btn01: "Continue",
        btn02: "Cancel",
        msg: "The Selected Item is Not Defined for the Customer ! Do you want to continue ?"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Customer Not Found !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Combine",
        btn02: "New Add",
        msg: "The Item You Want to Add is Already in the Document ! Do you want to combine the lines ?"
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
        msg: "Missing Codes :"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Number of Items Added :"
    },
    popMultiItem:
    {
        title: "Bulk Item Addition",
        btnApprove: "Get Items",
        btnClear : "Clear",
        btnSave : "Add Lines",
    },
    cmbMultiItemType : 
    {
        title : "Search Type",
        customerCode : "By Supplier Code",
        ItemCode : "By Item Code"
    },
    grdMultiItem : 
    {
        clmCode : "Item Code",
        clmMulticode : "Supplier Code",
        clmName : "Item Name",
        clmQuantity : "Quantity"
    },
    msgMultiData:
    {
        title: "Attention",
        btn01: "Clear List and Add All",
        btn02: "Add New Items to List",
        msg: "There are items in the list! "
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "OK",
        btnFactorSave : "Update Item Card"
    },
    msgGrdOrigins:
    {
        title: "Origin Change",
        btn01: "Save",
    },
    validRef :"Serial Cannot Be Empty",
    validRefNo : "Sequence Cannot Be Empty",
    validDepot : "You Must Select a Warehouse",
    validCustomerCode : "Customer Code Cannot Be Empty",
    validDocDate : "You Must Select a Date",
    tagItemCodePlaceholder: "Please Enter the Codes You Want to Add",
    pg_txtBarcode : 
    {
        title : "Barcode Selection",
        clmCode :  "ITEM CODE",
        clmName : "ITEM NAME",
        clmMulticode : "SUPPLIER CODE",
        clmBarcode : "BARCODE"
    },
    msgQuantity:
    {
        title: "Quantity",
        btn01: "Add",
        msg: "Please Enter the Quantity"
    },
    msgCustomerSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please Select a Customer !"
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
        msg: "There is a line converted to invoice in your document. This document cannot be deleted!"
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
    msgDiscountEntry : 
    {
        title : "Discount Entry",
        btn01 : "Approve"
    },
    txtDiscount1 : "1. Discount Amount",
    txtDiscount2 : "2. Discount Amount",
    txtDiscount3 : "3. Discount Amount",
    txtTotalDiscount :"Total Discount Amount",
    msgDiscountPerEntry : 
    {
        title : "Discount Entry",
        btn01 : "Approve"
    },
    txtDiscountPer1 : "1. Discount Percent",
    txtDiscountPer2 : "2. Discount Percent",
    txtDiscountPer3 : "3. Discount Percent",
    msgNewPrice : 
    {
        title: "Attention",
        btn01: "None",
        btn02: "Selected",
        msg: "Please Select the Products You Want to Update the Supplier Price."
    },
    msgNewPriceDate : 
    {
        title: "Attention",
        btn01: "None",
        btn02: "Selected",
        msg: "Please Select the Products You Want to Update the Supplier Price."
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
        clmNetMargin : "Net Margin",
        clmMarge : "Margin"
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
        clmNetMargin : "Net Margin",
        clmMarge : "Margin"
    },
    msgPriceDateUpdate :
    {
        msg : "Do you want to update the prices that have not changed? ",
        btn01 : "Yes",
        btn02 : "No",
        title : "Attention"
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Product Cannot Be Changed After Being Added !"
    },
}

export default irs_02_001
// "Alış Teklifi"
const tkf_02_001 =
{
    txtRefRefno : "Series-Sequence",
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
    txtBarcodePlace: "Barkod Okutunuz",
    txtQuantity :"Quantity",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    btnView : "View",
    btnMailsend : "Send Mail",
    validMail : "Please do not leave blank.",
    placeMailHtmlEditor : "You can enter a description in your mail.",
    validDesign : "Please select a design.",
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
    popMailSend : 
    {
        title :"Send E-Mail",
        txtMailSubject : "E-Mail Subject",
        txtSendMail : "E-Mail Address",
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
        clmMulticode : "SUPPLIER CODE",
        clmPrice : "PURCHASE PRICE"
    },
    grdPurcoffers: 
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
        clmVatRate : "VAT %"
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
    popDesign : 
    {
        title: "Design selection",
        design : "Design",
        lang : "Document Language"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information must be filled before adding products !"
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
        title: "Attention",
        btn01: "OK",
        msg: "Your password is incorrect !"
    },
    msgLockedType2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has been converted to an order and cannot be unlocked !"
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
        msg: "The discount amount cannot be greater than the amount !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product was not found !!"
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
        msg: "The customer was not found !!"
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
        msg: "The missing codes :"
    },
    msgMultiCodeCount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The number of added products :"
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
        title: "Birim Seçimi",
        btn01: "Onayla",
    },
    validRef :"Seri Boş Geçilemez",
    validRefNo : "Sıra Boş Geçilemez",
    validDepot : "Depo Seçmelisiniz",
    validCustomerCode : "Müşteri Kodu Boş Geçilemez",
    validDocDate : "Tarih Seçmelisiniz",
    tagItemCodePlaceholder: "Lütfen Eklemek İstediğiniz Kodları Giriniz",
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
    msgRowNotUpdate:
    {
        title: "Attention",
        btn01: "OK",
        msg: "This line has been converted to an order and cannot be changed!"
    },
    msgRowNotDelete :
    {
        title: "Attention",
        btn01: "OK",
        msg: "This line has been converted to an order and cannot be deleted!"
    },
    msgdocNotDelete : 
    {
        title: "Attention",
        btn01: "OK",
        msg: "There is a line converted to an order in your document. This document cannot be deleted!"
    },
    msgCode :
    {
        title: "Attention",
        btn01: "Go to Document",
        msg: "The document is found"
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
    txtDiscountPer1 : "1. Discount Percentage",
    txtDiscountPer2 : "2. Discount Percentage",
    txtDiscountPer3 : "3. Discount Percentage",
    txtTotalHt: "Discounted Total",
}

export default tkf_02_001
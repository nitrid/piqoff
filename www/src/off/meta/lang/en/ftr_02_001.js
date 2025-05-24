//  "Alış Faturası"
const ftr_02_001 =
{
    txtRefRefno : "Series-Sequence",
    cmbDepot: "Warehouse",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Unadjusted Amount",
    btnView : "View",
    placeMailHtmlEditor : "You can enter a description in your mail.",
    validDesign : "Please select a design.",
    btnMailsend : "Send Mail",
    txtDiscount : "Line Discount",
    txtDocDiscount : "Document Discount",
    txtSubTotal : "Subtotal",
    txtMargin : "Margin",
    txtVat : "VAT",
    txtTotal : "Total",
    dtShipDate :"Shipment Date",
    getDispatch : "Get Dispatch",
    getPayment : "Get Payment",
    cash : "Amount",
    description :"Description",
    checkReference : "Reference",
    btnCash : "Add Payment",
    btnCheck : "Add Check",
    btnBank : "Add Bank Transfer",
    cmbCashSafe : "Cash Selection",
    cmbCheckSafe : "Check Safe",
    cmbBank : "Bank Selection",
    txtPayInvoıceTotal : "Invoice Amount",
    txtPayTotal : "Payment Total",
    txtRemainder : "Invoice Remaining Payment",
    txtBarcode : "Add Barcode",
    txtBarcodePlace: "Scan Barcode",
    txtQuantity :"Quantity",
    getOrders : "Get Orders",
    popExcel : {title:"Your Excel file must have correct row headers"},
    excelAdd : "Add from Excel",
    shemaSave : "Save Schema",
    tabTitleSubtotal : "Invoice Total",
    tabTitlePayments : "Invoice Payment Information",
    txtDiffrentTotal : "Total Difference",
    tabTitleOldInvoices : "Past Invoice Information",
    txtDiffrentNegative : "Difference of price down",
    txtDiffrentPositive : "Difference of price up",
    txtDiffrentInv : "Difference of price down",
    txtbalance : "Customer Total Balance",
    getRemainder : "Get Remainder",
    txtUnitFactor : "Unit Factor",
    txtUnitQuantity : "Unit Quantity",
    txtTotalQuantity : "Total Quantity",
    txtUnitPrice: "Unit Price",
    txtExpFee : "Late Payment Fee",
    dtExpDate : "Due Date", 
    getOffers : "Get Offers",
    getProforma : "Get Proforma",
    txtTotalHt : "Discounted Amount",
    txtDocNo : "Document No",
    cmbOrigin: "Origin",
    txtTransport : "Transport Type",
    tabTitleDetail : "Detail Information",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document must be saved before any action can be taken !"         
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
        clmMulticode : "SUPPLIER CODE",
        clmPrice : "PURCHASE PRICE"
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
        clmDocNo : "Document No",
    },
    grdPurcInv: 
    {
        clmLineNo : "No",
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
        clmDiffPrice : "Difference",
        clmCustomerPrice : "Customer Price",
        clmDescription :"Description",
        clmCuser :"User",
        clmMulticode : "Supplier Code",
        clmOrigin : "Origin",
        clmSubQuantity : "Sub Quantity",
        clmSubPrice : "Sub Price",
        clmSubFactor : "Factor",
        clmPartiLot :"Lot Number",
    },
    pg_partiLot :
    {
        title : "Parti Lot Selection",
        clmPartiLot :"Lot Number",
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
        title: "You must enter the administrator password to open the document",
        Password : "Password",
        btnApprove : "Approve"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document must be saved before any action can be taken !"
    },
    msgMoreAmount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot enter more than the remaining amount !"
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
        msg: "You cannot enter a discount greater than the amount !"
    },
    msgDiscountPercent:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot enter a discount greater than the amount !"
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
        title: "Failed",
        btn01: "OK",
        msg: "Your password is incorrect !"
    },
    msgNegativePrice:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot enter a negative price !"
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
        msg: "The document cannot be deleted because it has been paid !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document cannot be modified because it is locked !"
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
        msg: "The selected product is not customerized ! Do you want to continue ?"
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
        msg: "You are selling below cost !"
    },
    msgUnderPrice2:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot sell below cost !"
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
        btn01: "OK",
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
    grdUnit2 : 
    {
        clmName : "Name",
        clmQuantity : "Quantity"
    },
    popUnit2 : 
    {
        title : "Unit Details"
    },
    msgUnit:
    {
        title: "Unit Selection",
        btn01: "Approve",
        btnFactorSave : "Update Product Card"
    },
    validRef :"Series cannot be empty",
    validRefNo : "Sequence cannot be empty",
    validDepot : "You must select a warehouse",
    validCustomerCode : "Customer Code cannot be empty",
    validDocDate : "You must select a date",
    tagItemCodePlaceholder: "Please enter the codes you want to add",
    msgNewPrice : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "Please select the products you want to update the supplier price.. "
    },
    msgNewPriceDate : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "Please select the products you want to update the price date.. "
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
        msg : "Do you want to update the price dates of the unchanged prices? ",
        btn01 : "Yes",
        btn02 : "No",
        title : "Attention"
    },
    msgNewVat : 
    {
        title: "Attention",
        btn01: "Update None",
        btn02: "Update Selected",
        msg: "There are different VAT rates in the invoice and the system. "
    },
    grdNewVat: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmVat: "VAT in the System",
        clmVat2: "New VAT",
    },
    serviceAdd : "Service Add",
    pg_service : 
    {
        title : "Services",
        clmCode : "Code",
        clmName : "Name"
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
    pg_adress : 
    {
        title : "Choose Address",
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
        title : "Order Selection",
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
    popRound : 
    {
        title : "Please enter the amount you want to round",
        total : "Total",
    },
    msgCompulsoryCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The selected product is not customerized !"
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
    msgGrdOrigins:
    {
        title: "Origin Change",  
        btn01: "Save",  
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
    pg_transportType : 
    {
        title : "Transport Codes",
        clmCode : "CODE",
        clmName : "NAME"
    },
    msgCustomerLock:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The product cannot be changed after it is added !"
    },
    msgFourniseurNotFound: 
    {
        title: "Attention",
        btn01: "OK",
        msg: "Supplier Not Found !"
    }
}

export default ftr_02_001
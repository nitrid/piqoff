// Payment
const fns_02_001 =
{
    txtRefRefno : "Series-Sequence",
    menu  : "Payment",
    cmbDepot: "Depot",
    cmbCashSafe : "Safe Selection",
    cmbCheckSafe : "Check Safe",
    cmbBank : "Bank Selection",
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
    getDispatch : "Get Dispatch",
    cash : "Amount",
    description :"Description",
    checkReference : "Reference",
    btnAddPay : "Payment Entry",
    invoiceSelect : "Invoice Selection",
    btnCash : "Payment Entry",
    ValidCash : "Please enter an amount greater than 0",
    cmbPayType : {
        title : "Payment Type",
        cash : "Cash",
        check : "Check",
        bankTransfer : "Bank Transfer",
        otoTransfer : "Automatic Payment",
        foodTicket : "Food Ticket",
        bill : "Bill",
    },
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
        clmInputName : "CUSTOMER NAME",
        clmInputCode  : "CUSTOMER CODE",
        clmTotal : "VAT TOTAL"
    },
    pg_invoices : 
    {
        title : "Invoice Selection",
        clmReferans : "REFERENCE",
        clmOutputName : "CUSTOMER NAME",
        clmDate : "DATE",
        clmTotal : "TOTAL",
        clmRemaining  : "REMAINING",
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "CUSTOMER CODE",
        clmTitle : "CUSTOMER NAME",
        clmTypeName : "TYPE",
        clmGenusName : "GENUS"
    },
    grdDocPayments: 
    {
        clmCreateDate: "Record Date",
        clmAmount : "Amount",
        clmOutputName : "Cash/Bank",
        clmDescription : "Description",
        clmInvoice : "Paid Invoice",
        clmFacDate : "Invoice Date",
        clmDocDate : "Date"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document header information is not complete !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "The record has been successfully saved !",
        msgFailed: "The record has been failed to save !"
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
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The record has been saved and locked !"
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
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n Please unlock the document with the administrator password !"
    },
    msgDocLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document is locked ! \n Please unlock the document with the administrator password !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !"
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
        title: "Bank Entry",
        btnApprove : "Add"
    },
    validRef :"The series cannot be empty",
    validRefNo : "The sequence cannot be empty",
    validDepot : "You must select a depot",
    validCustomerCode : "The customer code cannot be empty",
    validDocDate : "You must select a date",
    msgInvoiceSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot add a payment without selecting an invoice !"
    },
}

export default fns_02_001
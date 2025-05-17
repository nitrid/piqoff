// Taksit Ödeme
const fns_02_003 = 
{
    txtRefRefno : "Series-Sequence",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    lblInstallment : "Invoice Selection",
    lblInstallmentCount : "Installment Creation",
    installmentPeriod : "Installment Count",
    paymentDate : "Payment Start Date",
    installmentTotal : "Total Amount",
    dtDocDate : "Date",
    dtFirst : "Invoice Date",
    installmentAdd : "Add",
    btnInstallment : "Invoice Selection",
    btnView : "View",
    btnPrint : "Print",
    btnMailsend : "Send Email",
    btnInstallmentCount : "Installment Creation",
    isMsgSave :
    {  
        title: "Attention",
        btn01: "OK",
        msg: "The document has not been saved !"         
    },
    popInstallment :
    {
        title : "Invoice Selection",
    },
    popInstallmentCount :
    {
        title : "Installment Creation",
    },
    popDesign : 
    {
        title: "Design Selection",
        design : "Design",
        lang : "Document Language"
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "Date",
        clmRef : "Series",
        clmRefNo : "Sequence",
        clmCustomerName : "Customer Name",
        clmCustomerCode : "Customer Code",
        clmInstallmentNo : "Installment Count",
        clmInstallmentDate : "Installment Start Date",
        clmAmount : "Installment Amount",
        clmTotal : "Total Amount",
        clmVat : "Installment VAT"
    },
    grdInstallment : 
    {
        clmDocDate : "Date",
        clmRef : "Series",
        clmRefNo : "Sequence",
        clmCustomerName : "Customer Name",
        clmCustomerCode : "Customer Code",
        clmInstallmentNo : "Installment No",
        clmInstallmentDate : "Installment Date",
        clmAmount : "Installment Amount",
        clmTotal : "Total Amount",
        clmVat : "Installment VAT"
    },
    grdPopInstallment : 
    {
        clmDocDate : "Date",
        clmRef : "Series",
        clmRefNo : "Sequence",
        clmInputName : "Company Name",
        clmDate : "Date",
        clmAmount : "Amount"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document has not been saved !"
    },
    msgPayPlanNotSelected:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The selected invoice has been installmented !"
    },
    msgCustomerNotSelected:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer has not been selected !"
    },
    msgFactureNotSelected:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The invoice or document number has not been selected !"
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
        msg: "The document is locked ! \n You cannot perform any operations without unlocking the document !"
    },
    msgNotCustomer:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The customer was not found !"
    },
    validRef :"The series cannot be empty",
    validRefNo : "The sequence cannot be empty",
    validCustomerCode : "The customer code cannot be empty",
    validDocDate : "You must select a date",
    msgInvoiceSelect:
    {
        title: "Attention",
        btn01: "OK",
        msg: "You cannot perform any operations without selecting an invoice !"
    },
    msgRowNotUpdate:
    {
        title:"Attention",
        btn01:"OK",
        msg:"You cannot perform this operation without breaking the relevant link.",
    },
}

export default fns_02_003;
//"Toplu Tahsilat Girişi"
const fns_05_001 =
{
    txtRefRefno : "Series-Sequence",
    cmbCashSafe : "Cash Selection",
    cmbCheckSafe : "Check Selection",
    cmbBank : "Bank Selection",
    txtCustomerCode : "Customer Code",
    txtCustomerName : "Customer Name",
    dtDocDate : "Date",
    txtAmount : "Amount",
    cash : "Cash",
    description :"Description",
    checkReference : "Reference",
    btnCash : "Collection Entry",
    ValidCash : "Enter an amount greater than 0",
    excelAdd : "Record from Excel",
    popExcel : 
    {
        title:"The row headers of your Excel file must be correct",
        clmDate : "Date",
        clmDesc : "Description",
        clmAmount : "Amount",
        shemaSave : "Schema Save",
        clmOutputCode : "Customer Code"
    },
    cmbPayType : 
    {
        title : "Payment Type",
        cash : "Cash",
        check : "Check",
        bankTransfer : "Bank Transfer",
        otoTransfer : "Automatic Payment",
        foodTicket : "Food Ticket",
        bill : "Bill",
    },
    pg_txtCustomerCode : 
    {
        title : "Customer Selection",
        clmCode :  "Customer Code",
        clmTitle : "Customer Name",
        clmTypeName : "Type",
        clmGenusName : "Genus"
    },
    grdDocPayments: 
    {
        clmDate : "Date",
        clmCustomerCode : "Customer Code",
        clmCustomerName : "Customer Name",
        clmAmount : "Amount",
        clmInputName : "Cash/Bank",
        clmDescription : "Description",
        clmDocDate : "Date"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The document headers must be filled in correctly !"
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
        msgSuccess: "The record has been saved successfully !",
        msgFailed: "The record has been failed to save !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please fill in the required fields !"
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
    validCustomerCode : "The customer code cannot be empty",
}

export default fns_05_001
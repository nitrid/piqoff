// "Hesaplar Arası Virman",
const fns_03_003 = 
{
    txtRefRefno : "Series-Sequence",
    cmbOutAccount: "Output Account",
    cmbInAccount: "Input Account",
    dtDocDate : "Date",
    txtAmount : "Amount",
    txtTotal : "Total",
    description :"Description",
    amount : "Amount",
    cmbSafe : "Output Account",
    cmbSafe2 : "Input Account",
    btnSafeToSafe : "Cash to Cash",
    btnSafeToBank : "Cash to Bank",
    btnBankToSafe : "Bank to Cash",
    btnBankToBank : "Bank to Bank",
    pg_Docs : 
    {
        title : "Document Selection",
        clmDate : "DATE",
        clmRef : "SERIES",
        clmRefNo : "SEQUENCE",
       clmDate : "DATE",
       clmTotal : "TOTAL"
    },
    grdDocVirement: 
    {
        clmCreateDate: "Create Date",
        clmAmount : "Amount",
        clmInputName : "Input Account",
        clmOutputName : "Output Account",
        clmDescription : "Description"
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
        msg: "The document is locked ! \n You cannot perform any operations without unlocking the document !"
    },
    msgDblAccount:
    {
        title: "Attention",
        btn01: "OK",
        msg: "The input and output accounts cannot be the same !"
    },
    popSafeToSafe: 
    {
        title: "Cash to Cash",
        btnApprove : "Add",
    },
    popSafeToBank: 
    {
        title: "Cash to Bank",
        btnApprove : "Add",
    },
    popBankToSafe: 
    {
        title: "Bank to Cash",
        btnApprove : "Add",
    },
    popBankToBank: 
    {
        title: "Bank to Bank",
        btnApprove : "Add",
    },
    
    validRef : "The series cannot be empty",
    validRefNo : "The sequence cannot be empty",
    validAccount : "You must select an account",
    validDocDate : "You must select a date",
}

export default fns_03_003
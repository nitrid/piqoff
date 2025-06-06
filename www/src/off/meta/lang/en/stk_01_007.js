// Hizmet Tanımları
const stk_01_007 = 
{
    txtCode : "Code",
    txtName :"Name",
    cmbType :"Type",
    validCode :"You cannot leave the code blank !",
  
    pg_txtCode : 
    {
        title : "Service Card Selection",
        clmCode : "CODE",
        clmName : "NAME",
        clmType : "TYPE",
    },
    msgSave:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Warning",
        btn01: "OK",
        msgSuccess: "The record has been saved successfully !",
        msgFailed: "The record has been saved unsuccessfully !"
    },
    msgSaveValid:
    {
        title: "Warning",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    msgDelete:
    {
        title: "Warning",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the record ?"
    },
    msgCode : 
    {
        title: "Warning",
        btn01: "Go to Card",
        btn02: "OK",
        msg : "The service code you entered is already in the system !"
    },
    chkActive: "Active",
    cmbTax : "Tax",
    msgNotDelete : 
    {
        title: "Warning",
        btn01: "OK",
        msg : "This card has been used and cannot be deleted !"
    },
    msgNotUpdate : 
    {
        title: "Warning",
        btn01: "OK",
        msg : "This card has been used and cannot be updated !"
    },
}
export default stk_01_007
// Depo/Mağaza Tanımları
const stk_01_006 = 
{
    txtCode : "Code",
    txtName :"Name",
    cmbType :"Type",
    validCode :"You cannot leave the code blank !",
    cmbTypeData : 
    {
        normal : "Central",
        rebate : "Rebate",
        shop : "Shop",
        outage : "Outage",
    },
    pg_txtCode : 
    {
        title : "Choose Depot",
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
        btn01: "Go to Cashier",
        btn02: "OK",
        msg : "The cashier you entered is already in the system !"
    },
    chkActive: "Active",
    msgNotDeleted : 
    {
        title: "Warning",
        btn01: "OK",
        msg : "This depot has been used and cannot be deleted !"
    },
}
export default stk_01_006
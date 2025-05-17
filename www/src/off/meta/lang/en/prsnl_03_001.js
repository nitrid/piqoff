// "Toplu Müşteri Tanımları"
const prsnl_03_001 =
{
    cmbType :"Type",
    cmbGenus :"Gender",
    txtCode : "Code",
    txtTitle : "Title",
    txtEmployeeName : "Name",
    txtEmployeeLastname : "Lastname",
    txtPhone1 : "Phone 1",
    txtPhone2 : "Phone 2",
    txtGsmPhone : "Gsm",
    txtOtherPhone : "Other Phone",
    txtEmail : "E-Mail",
    txtAge: "Age",
    txtWage: "Wage",
    txtInsuranceNo: "Insurance No",
    txtGender: "Gender",
    txtMarialStatus: "Marital Status",
    tabTitleAdress : "Address",
    tabTitleLegal : "Legal",
    tabTitleOffical : "Official",
    tabEmployeeBank : "Bank Information",
    txtLegal :"Legal Information",
    chkRebate :"Rebate",
    pg_txtCode : 
    {
        title : "Customer Selection",
        clmCode : "CODE",
        clmTitle : "Title",
        clmName : "Name",
        clmLastName  : "Lastname",
        clmGender : "Gender",
        clmStatus  : "Marital Status",
    },
    grdAdress : 
    {
        clmAdress : "Address",
        clmZipcode : "Postal Code",
        clmCity :"City",
        clmCountry : "Country",
    },
    grdLegal : 
    {
        clmSiretID : "Trade Registry Record",
        clmApeCode : "Ape Code",
        clmTaxOffice : "Tax Office",
        clmTaxNo : "Tax No",
        clmIntVatNo : "International VAT No",
        clmTaxType : "Tax Type",
        clmSirenID : "Trade Registry No",
        clmRcs : "Trade Chamber",
        clmCapital : "Capital",
        clmInsurance : "Insurance No"
    },
    grdOffical : 
    {
        clmName :"Name",
        clmLastName : "Lastname",
        clmPhone1 : "Phone 1",
        clmPhone2 : "Phone 2",
        clmGsmPhone : "GSM Tel.",
        clmEMail : "E-Mail"
    },
    grdBank : 
    {
        clmName : "Bank Name",
        clmIban : "IBAN",
        clmOffice : "Branch",
        clmSwift : "Swift Code",
    },
    popAdress : 
    {
        title : "Address",
        txtPopAdress : "Address",
        cmbPopZipcode :"Postal Code",
        cmbPopCity :"City",
        cmbPopCountry :"Country",
    },
    popBank : 
    {
        title : "Bank Information",
        txtName : "Bank Name",
        txtIban :"IBAN",
        txtOffice :"Branch",
        txtSwift :"Swift Code",
    },
    popOffical : 
    {
        title : "Official",
        txtPopName : "Name",
        txtPopLastName : "Lastname",
        txtPopPhone1 :"Phone 1",
        txtPopPhone2 :"Phone 2",
        txtPopGsmPhone : "GSM Tel.",
        txtPopOtherPhone : "Other Phone",
        txtPopMail :"E-Mail"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to save?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Record operation successful !",
        msgFailed: "Record operation failed !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please fill in the required fields !"
    },
    msgLegalNotValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please fill in the legal section !"
    },
    msgAdressNotValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the customer's country from the address section !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Cancel",
        msg: "Are you sure you want to delete the record ?"
    },
    cmbTypeData : 
    {
        individual : "Individual",
        company : "Company",
        association : "Association"
    },
    cmbGenusData:
    {
        Employee : "Customer",
        supplier : "Supplier",
        both : "Both",
        branch : "Branch"
    },
    cmbTaxTypeData : 
    {
        individual : "Individual",
        company : "Company"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Go to Customer",
        btn02: "OK",
        msg : "The customer you entered is already in the system !"
    },
    popSettingEmployee : 
    {
        title : "Settings",
        txtStartRef : "Start Code",
        txtFinishRef : "Finish Code",
        txtTotal : "Total Count",
        chkDigit : "EAN Digit"
    },
    btnGet : "Save",
}

export default prsnl_03_001
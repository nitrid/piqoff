// "Toplu Müşteri Tanımları"
const cri_03_001 =
{
    cmbType :"Type",
    cmbGenus :"Type",
    txtCode : "Code",
    txtTitle : "Title",
    txtCustomerName : "Name",
    txtCustomerLastname : "Lastname",
    txtPhone1 : "Phone 1",
    txtPhone2 : "Phone 2",
    txtGsmPhone : "Gsm Tel.",
    txtOtherPhone : "Other Phone",
    txtEmail : "E-Mail",
    txtWeb : "Web",
    tabTitleAdress : "Address",
    tabTitleLegal : "Legal",
    tabTitleOffical : "Official",
    tabCustomerBank : "Bank Information",
    txtLegal :"Legal Information",
    chkRebate :"Rebate",
    pg_txtCode : 
    {
        title : "Customer Selection",
        clmCode : "Code",
        clmTitle : "Title",
        clmName : "Name",
        clmLastName  : "Lastname",
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
        title : "Authorized",
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
        msg: "Are you sure you want to save the record ?"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Your record has been successfully saved !",
        msgFailed: "Your record has been failed to save !"
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
        msg: "Please fill in the legal fields !"
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
        Customer : "Customer",
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
        msg : "The customer you entered is already registered in the system !"
    },
    popSettingCustomer : 
    {
        title : "Settings",
        txtStartRef : "Start Code",
        txtFinishRef : "Finish Code",
        txtTotal : "Total Count",
        chkDigit : "EAN Digit"
    },
    btnGet : "Save",
}

export default cri_03_001
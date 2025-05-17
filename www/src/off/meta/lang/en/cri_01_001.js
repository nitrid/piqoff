// "Müşteri Tanımları"
const cri_01_001 =
{
    cmbType :"Type",
    cmbGenus :"Genus",
    txtCode : "Code",
    txtTitle : "Title",
    txtCustomerName : "Name",
    txtCustomerLastname : "Lastname",
    txtPhone1 : "Phone 1",
    txtPhone2 : "Phone 2",
    txtGsmPhone : "Gsm Phone",
    txtOtherPhone : "Other Phone",
    txtEmail : "E-Mail",
    txtWeb : "Web",
    tabTitleAdress : "Address",
    tabTitleLegal : "Legal",
    tabTitleOffical : "Official",
    tabCustomerBank : "Bank Information",
    tabTitleFinanceDetail : "Finance Details",
    txtLegal :"Legal Information",
    chkRebate :"Rebate",
    chkVatZero :"Vat Zero",
    txtExpiryDay : "Expiry Day",
    txtRiskLimit : "Risk Limit",
    expDay : "(Day)",
    chkActive: "Active",
    pg_txtCode : 
    {
        title : "Customer Selection",
        clmCode : "Code",
        clmTitle : "Title",
        clmName : "Name",
        clmLastName  : "Lastname",
        clmStatus  : "Status",   
    },
    grdAdress : 
    {
        clmAdress : "Address",
        clmZipcode : "Zipcode",
        clmCity :"City",
        clmCountry : "Country",
        clmSiret : "Siret",
        clmFacturation : "Facturation Address"
    },
    grdLegal : 
    {
        clmSiretID : "Trade Registry",
        clmApeCode : "Ape Code",
        clmTaxOffice : "Tax Office",
        clmTaxNo : "Tax No",
        clmIntVatNo : "International VAT No",
        clmTaxType : "Tax Type",
        clmSirenID : "Trade Registry",
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
        cmbPopZipcode :"Zipcode",
        cmbPopCity :"City",
        cmbPopCountry :"Country",
        txtPopAdressSiret : "Siret",
        txtPopAdressFacturation : "Facturation Address"
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
    msgTaxNo:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please fill in the tax number !"
    },
    msgAdressNotValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please select the country of the customer from the address section !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "Yes",
        btn02: "No",
        msg: "Are you sure you want to delete the record ?",
        msgFailed: "The record cannot be deleted because there is a document associated with the customer !",
        msgSuccess: "The record has been successfully deleted !"
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
    chkTaxSucre : "Tax Sugar",
    txtAccountingCode : "Accounting Code",
    tabTitleDetail : "Detail Information",
    validation :
    {
        frmCustomers: "You cannot leave the code empty !",
    },
    txtSubCustomer : "Sub Customer",
    pg_subCustomer : 
    {
        title : "Sub Customer Selection",
        clmCode : "Code",
        clmTitle : "Title",
        clmName : "Name",
        clmLastName  : "Lastname",
    },
    txtMainCustomer : "Main Customer",
    pg_mainCustomer : 
    {
        title : "Main Customer Selection",
        clmCode : "Code",
        clmTitle : "Title",
        clmName : "Name",
        clmLastName  : "Lastname",
    },
    txtArea : "Area",
    pg_AreaCode : 
    {
        title : "Area Selection",
        clmCode : "Code",
        clmName : "Name",
    },
    txtSector : "Sector",
    pg_SectorCode : 
    {
        title : "Area Selection",
        clmCode : "Code",
        clmName : "Name",
    },
    txtPriceListNo : "Price List No",
    pg_priceListNo : 
    {
        title : "Price List Selection",
        clmNo : "No",
        clmName : "Name"
    },
    popNote : 
    {
        title : "Add Note",
    },
    tabTitleNote : "Notes",
    grdNote:
    {
        clmName : "NOTE"
    },
    txtMainGroup : "Main Group",
    pg_MainGroup : 
    {
        title : "Main Group Selection",
        clmCode : "Code",
        clmName : "Name",
    },
    btnSubGroup : "Add Sub Group",
    pg_subGroup : 
    {
        title : "Sub Group Selection",
        clmName : "Name",
    },
    msgTaxInSpace:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Please enter the tax number without spaces !"
    },
}

export default cri_01_001
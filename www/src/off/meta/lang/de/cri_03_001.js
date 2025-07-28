// "Toplu Müşteri Tanımları"
const cri_03_001 =
{
    cmbType :"Typ",
    cmbGenus :"Gattung",
    txtCode : "Code",
    txtTitle : "Titel",
    txtCustomerName : "Vorname",
    txtCustomerLastname : "Nachname",
    txtPhone1 : "Telefon 1",
    txtPhone2 : "Telefon 2",
    txtGsmPhone : "Mobiltelefon",
    txtOtherPhone : "Anderes Telefon",
    txtEmail : "E-Mail",
    txtWeb : "Web",
    tabTitleAdress : "Adresse",
    tabTitleLegal : "Rechtlich",
    tabTitleOffical : "Administrator",
    tabCustomerBank : "Bankdaten",
    txtLegal :"Rechtsdaten",
    chkRebate :"Rücksendung-Rücknahme",
    pg_txtCode : 
    {
        title : "Kunde auswählen",
        clmCode : "Code",
        clmTitle : "Titel",
        clmName : "Vorname",
        clmLastName  : "Nachname",
    },
    grdAdress : 
    {
        clmAdress : "Adresse",
        clmZipcode : "Postleitzahl",
        clmCity :"Stadt",
        clmCountry : "Land",
    },
    grdLegal : 
    {
        clmSiretID : "Siret Nr.",
        clmApeCode : "Ape Code",
        clmTaxOffice : "Steueramt",
        clmTaxNo : "Steuernummer",
        clmIntVatNo : "EORI Nr.",
        clmTaxType : "Steuertyp",
        clmSirenID : "Siren Nr.",
        clmRcs : "RCS",
        clmCapital : "Kapital",
        clmInsurance : "Versicherung Nr." 
    },
    grdOffical : 
    {
        clmName :"Name",
        clmLastName : "Nachname",
        clmPhone1 : "Telefon 1",
        clmPhone2 : "Telefon 2",
        clmGsmPhone : "Mobiltelefon",
        clmEMail : "E-Mail"
    },
    grdBank : 
    {
        clmName : "Bankname",
        clmIban : "IBAN",
        clmOffice : "Filiale",
        clmSwift : "Swift Code",
    },
    popAdress : 
    {
        title : "Adresse",
        txtPopAdress : "Adresse",
        cmbPopZipcode :"Postleitzahl",
        cmbPopCity :"Stadt",
        cmbPopCountry :"Land",
    },
    popBank : 
    {
        title : "Bankdaten",
        txtName : "Bankname",
        txtIban :"IBAN",
        txtOffice :"Filiale",
        txtSwift :"Swift Code",
    },
    popOffical : 
    {
        title : "Administrator",
        txtPopName : "Name",
        txtPopLastName : "Nachname",
        txtPopPhone1 :"Telefon 1",
        txtPopPhone2 :"Telefon 2",
        txtPopGsmPhone : "Mobiltelefon",
        txtPopOtherPhone : "Anderes Telefon",
        txtPopMail :"E-Mail"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
    },
    msgLegalNotValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die rechtlichen Felder aus!"
    },
    msgAdressNotValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Wohnsitzland eingeben!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    cmbTypeData : 
    {
        individual :  "Privat person",
        company :  "Unternehmen",
        association : "Verein"
    },
    cmbGenusData:
    {
        Customer : "Kunde",
        supplier : "Lieferant",
        both : "Beide",
        branch : "Filiale" 
    },
    cmbTaxTypeData : 
    {
        individual :  "Privat person",
        company :  "Unternehmen"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Kunden gehen",
        btn02: "OK",
        msg : "Kunde bereits vorhanden!"
    },
    popSettingCustomer :     
    {    
        title : "Einstellungen",    
        txtStartRef : "Startcode",    
        txtFinishRef : "Endcode",    
        txtTotal : "Gesamtanzahl",    
        chkDigit : "EAN Code"    
    },  
    btnGet : "Speichern"    
}
export default cri_03_001
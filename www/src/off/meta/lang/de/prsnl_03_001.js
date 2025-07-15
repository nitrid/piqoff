// "Toplu Müşteri Tanımları"
const prsnl_03_001 =
{
    cmbType :"Typ",
    cmbGenus :"Geschlecht",
    txtCode : "Code",
    txtTitle : "Titel",
    txtEmployeeName : "Name",
    txtEmployeeLastname : "Nachname",
    txtPhone1 : "Telefon 1",
    txtPhone2 : "Telefon 2",
    txtGsmPhone : "GSM",
    txtOtherPhone : "Weitere Telefonnummer",
    txtEmail : "E-Mail",
    txtAge: "Alter",
    txtWage: "Gehalt",
    txtInsuranceNo: "Versicherungsnummer",
    txtGender: "Geschlecht",
    txtMarialStatus: "Familienstand",
    tabTitleAdress : "Adresse",
    tabTitleLegal : "Rechtlich",
    tabTitleOffical : "Offiziell",
    tabEmployeeBank : "Bankinformationen",
    txtLegal :"Rechtliche Informationen",
    chkRebate :"Rabatt",
    pg_txtCode : 
    {
        title : "Kundenauswahl",
        clmCode : "CODE",
        clmTitle : "Titel",
        clmName : "Name",
        clmLastName  : "Nachname",
        clmGender : "Geschlecht",
        clmStatus  : "Familienstand",
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
        clmSiretID : "Handelsregistereintrag",
        clmApeCode : "Ape-Code",
        clmTaxOffice : "Finanzamt",
        clmTaxNo : "Steuernummer",
        clmIntVatNo : "Internationale USt-IdNr.",
        clmTaxType : "Steuerart",
        clmSirenID : "Handelsregisternummer",
        clmRcs : "Handelskammer",
        clmCapital : "Kapital",
        clmInsurance : "Versicherungsnummer"
    },
    grdOffical : 
    {
        clmName :"Name",
        clmLastName : "Nachname",
        clmPhone1 : "Telefon 1",
        clmPhone2 : "Telefon 2",
        clmGsmPhone : "GSM Tel.",
        clmEMail : "E-Mail"
    },
    grdBank : 
    {
        clmName : "Bankname",
        clmIban : "IBAN",
        clmOffice : "Filiale",
        clmSwift : "SWIFT-Code",
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
        title : "Bankinformationen",
        txtName : "Bankname",
        txtIban :"IBAN",
        txtOffice :"Filiale",
        txtSwift :"SWIFT-Code",
    },
    popOffical : 
    {
        title : "Offiziell",
        txtPopName : "Name",
        txtPopLastName : "Nachname",
        txtPopPhone1 :"Telefon 1",
        txtPopPhone2 :"Telefon 2",
        txtPopGsmPhone : "GSM Tel.",
        txtPopOtherPhone : "Weitere Telefonnummer",
        txtPopMail :"E-Mail"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Datensatz erfolgreich gespeichert!",
        msgFailed: "Datensatz konnte nicht gespeichert werden!"
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
        msg: "Bitte füllen Sie den rechtlichen Bereich aus!"
    },
    msgAdressNotValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie das Land des Kunden im Adressbereich aus!"
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
        individual : "Einzelperson",
        company : "Firma",
        association : "Verein"
    },
    cmbGenusData:
    {
        Employee : "Kunde",
        supplier : "Lieferant",
        both : "Beide",
        branch : "Filiale"
    },
    cmbTaxTypeData : 
    {
        individual : "Einzelperson",
        company : "Firma"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Kunden gehen",
        btn02: "OK",
        msg : "Der eingegebene Kunde ist bereits im System vorhanden!"
    },
    popSettingEmployee : 
    {
        title : "Einstellungen",
        txtStartRef : "Startcode",
        txtFinishRef : "Endcode",
        txtTotal : "Gesamtanzahl",
        chkDigit : "EAN-Stelle"
    },
    btnGet : "Speichern",
    msgDeleteSuccess :
    {
        msg: "Löschvorgang erfolgreich!"
    }
}

export default prsnl_03_001
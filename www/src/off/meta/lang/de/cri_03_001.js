// "Toplu Müşteri Tanımları"
const cri_03_001 =
{
    cmbType :"Typ",
    cmbGenus :"Geschlecht",
    txtCode : "Code",
    txtTitle : "Firma",
    txtCustomerName : "Name",
    txtCustomerLastname : "Nachname",
    txtPhone1 : "Telefon 1",
    txtPhone2 : "Telefon 2",
    txtGsmPhone : "Mobiltelefon",
    txtOtherPhone : "Sonstiges Telefon",
    txtEmail : "E-Mail",
    txtWeb : "Webseite",
    tabTitleAdress : "Adresse",
    tabTitleLegal : "Rechtlich",
    tabTitleOffical : "Ansprechpartner",
    tabCustomerBank : "Bankdaten",
    txtLegal :"Rechtliche Informationen",
    chkRebate :"Rabatt gewähren",
    pg_txtCode : 
    {
        title : "Kundenauswahl",
        clmCode : "CODE",
        clmTitle : "Firma",
        clmName : "Name",
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
        clmSiretID : "Handelsregisternummer",
        clmApeCode : "APE-Code",
        clmTaxOffice : "Steueramt",
        clmTaxNo : "Steuernummer",
        clmIntVatNo : "Umsatzsteuer-Identifikationsnummer",
        clmTaxType : "Steuerart",
        clmSirenID : "Steuernummer",
        clmRcs : "Handelsregister",
        clmCapital : "Kapital",
        clmInsurance : "Versicherungsnummer"
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
        title : "Bankdaten",
        txtName : "Bankname",
        txtIban :"IBAN",
        txtOffice :"Filiale",
        txtSwift :"SWIFT-Code",
    },
    popOffical : 
    {
        title : "Ansprechpartner",
        txtPopName : "Name",
        txtPopLastName : "Nachname",
        txtPopPhone1 :"Telefon 1",
        txtPopPhone2 :"Telefon 2",
        txtPopGsmPhone : "Mobiltelefon",
        txtPopOtherPhone : "Sonstiges Telefon",
        txtPopMail :"E-Mail"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag speichern?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Der Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Das Speichern des Eintrags ist fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgLegalNotValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte füllen Sie die Felder im Rechtlichen-Bereich aus!"
    },
    msgAdressNotValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte wählen Sie das Land des Kunden im Adressbereich aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag löschen?"
    },
    cmbTypeData : 
    {
        individual : "Einzelperson",
        company : "Firma",
        association : "Vereinigung"
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
        individual : "Einzelperson",
        company : "Firma"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zu Kunde gehen",
        btn02: "Ok",
        msg : "Der eingegebene Kunde ist bereits im System vorhanden!"
    },
    popSettingCustomer : 
    {
        title : "Einstellungen",
        txtStartRef : "Startreferenz",
        txtFinishRef : "Endereferenz",
        txtTotal : "Gesamtanzahl",
        chkDigit : "EAN-Ziffer"
    },
    btnGet : "Speichern",
}
export default cri_03_001
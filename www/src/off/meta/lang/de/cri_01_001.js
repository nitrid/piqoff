// "Müşteri Tanımları"
const cri_01_001 =
{
    cmbType :"Typ",
    cmbGenus :"Geschlecht",
    txtCode : "Code",
    txtTitle : "Firma",
    txtCustomerName : "Vorname",
    txtCustomerLastname : "Nachname",
    txtPhone1 : "Telefon 1",
    txtPhone2 : "Telefon 2",
    txtGsmPhone : "Mobiltelefon",
    txtOtherPhone : "Andere Telefonnummer",
    txtEmail : "E-Mail",
    txtWeb : "Website",
    tabTitleAdress : "Adresse",
    tabTitleLegal : "Rechtlich",
    tabTitleOffical : "Kontakt",
    tabCustomerBank : "Bankdaten",
    tabTitleFinanceDetail : "Finanzliche Informationen",
    txtLegal :"Rechtliche Informationen",
    chkRebate :"Rabatt gewähren",
    chkVatZero : "Ohne MwSt", 
    txtExpiryDay : "Zahlungsziel",
    txtRiskLimit : "Kreditlimit",
    expDay : "(Tage)",
    chkActive: "Aktiv",
    pg_txtCode : 
    {
        title : "Kundenauswahl",
        clmCode : "CODE",
        clmTitle : "Firma",
        clmName : "Vorname",
        clmLastName  : "Nachname",
        clmStatus  : "Statut",
    },
    grdAdress : 
    {
        clmAdress : "Adresse",
        clmZipcode : "Postleitzahl",
        clmCity :"Stadt",
        clmCountry : "Land",
        clmSiret : "Siret",
        clmFacturation : "Faktura Adresse"
    },
    grdLegal : 
    {
        clmSiretID : "Handelsregistereintrag",
        clmApeCode : "APE-Code",
        clmTaxOffice : "Finanzamt",
        clmTaxNo : "Steuernummer",
        clmIntVatNo : "Internationale USt-IdNr.",
        clmTaxType : "Steuertyp",
        clmSirenID : "Handelsregisternummer",
        clmRcs : "Handelskammer",
        clmCapital : "Kapital",
        clmInsurance : "Versicherungsnummer"
    },
    grdOffical : 
    {
        clmName :"Vorname",
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
        clmSwift : "Swift-Code",
    },
    popAdress : 
    {
        title : "Adresse",
        txtPopAdress : "Adresse",
        cmbPopZipcode :"Postleitzahl",
        cmbPopCity :"Stadt",
        cmbPopCountry :"Land",
        txtPopAdressSiret : "Siret",
        txtPopAdressFacturation : "Faktura Adresse"
    },
    popBank : 
    {
        title : "Bankdaten",
        txtName : "Bankname",
        txtIban :"IBAN",
        txtOffice :"Filiale",
        txtSwift :"Swift-Code",
    },
    popOffical : 
    {
        title : "Kontakt",
        txtPopName : "Vorname",
        txtPopLastName : "Nachname",
        txtPopPhone1 :"Telefon 1",
        txtPopPhone2 :"Telefon 2",
        txtPopGsmPhone : "Mobiltelefon",
        txtPopOtherPhone : "Andere Telefonnummer",
        txtPopMail :"E-Mail"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Der Speichervorgang war erfolgreich!",
        msgFailed: "Der Speichervorgang ist fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgLegalNotValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder im Abschnitt 'Rechtliche Informationen' aus!"
    },
    msgTaxNo:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie die Steuernummer ein!"
    },
    msgSave :
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSaveValid :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgAdressNotValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie das Land des Kunden aus dem Adressabschnitt aus!"
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
        individual : "Einzelunternehmen",
        company : "Unternehmen"
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
        individual : "Einzelunternehmen",
        company : "Unternehmen"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Konto wechseln",
        btn02: "OK",
        msg : "Der eingegebene Kunde ist bereits im System registriert!"
    },
    chkTaxSucre : "Zuckersteuer",
    tabTitleDetail : "Detailinformationen",
    validation :
    {
        frmCustomers: "Das Feld 'Kundennummer' darf nicht leer sein!",
    },
    txtSubCustomer : "Unterkunde",  
    pg_subCustomer : 
    {
        title : "Auswahl Unterkunde",   
        clmCode : "CODE",   
        clmTitle : "Titel",   
        clmName : "Name",   
        clmLastName  : "Nachname",   
    },
    txtMainCustomer : "Hauptkunde",  
    pg_mainCustomer : 
    {
        title : "Auswahl Hauptkunde",  
        clmCode : "CODE",   
        clmTitle : "Titel",   
        clmName : "Name",   
        clmLastName  : "Nachname",   
    },
    txtArea : "Region",   
    pg_AreaCode : 
    {
        title : "Auswahl der Region",   
        clmCode : "CODE",   
        clmName : "Name",   
    },
    txtSector : "Branche",   
    pg_SectorCode : 
    {
        title : "Auswahl der Region",    
        clmCode : "CODE",    
        clmName : "Name",    
    },
    txtPriceListNo: "Preislistennummer", 
    pg_priceListNo: 
    {
        title: "Auswahl der Preisliste",
        clmNo: "Nummer",
        clmName: "Name"
    },
    popNote : 
    {
        title : "Notitz hinzufügen",  
    },
    tabTitleNote : "Notitzen",   
    grdNote:
    {
        clmNote : "Notitz", 
        clmName : "Name",
    },
    txtMainGroup : "Hauptgruppe",
    pg_MainGroup : 
    {
        title : "Hauptgruppenwahl",
        clmCode : "CODE",
        clmName : "NAME",
    },
    btnSubGroup: "Untergruppe Hinzufügen",
    pg_subGroup: 
    {
        title: "Untergruppenauswahl",
        clmName: "Name",
    },
    msgTaxInSpace: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie die Steuernummer ohne Leerzeichen ein!"
    }
}
export default cri_01_001
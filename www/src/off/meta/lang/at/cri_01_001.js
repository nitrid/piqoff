// "Müşteri Tanımları"
const cri_01_001 =
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
    tabTitleFinanceDetail : "Finanzinformationen", 
    txtLegal :"Rechtsdaten",
    chkRebate :"Rücksendung-Rücknahme",
    chkVatZero :"Ohne MwSt.",
    txtExpiryDay : "Fälligkeit",  
    txtRiskLimit : "Risikolimit",  
    expDay : "(Tag)", 
    chkActive: "Aktiv",
    pg_txtCode : 
    {
        title : "Kunde auswählen",
        clmCode : "Code",
        clmTitle : "Titel",
        clmName : "Vorname",
        clmLastName  : "Nachname",
        clmStatus  : "Status",
    },
    grdAdress : 
    {
        clmAdress : "Adresse",
        clmZipcode : "Postleitzahl",
        clmCity :"Stadt",
        clmCountry : "Land",
        clmSiret : "Siret",
        clmFacturation : "Rechnungsadresse"
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
        txtPopAdressSiret : "Siret",
        txtPopAdressFacturation : "Rechnungsadresse"
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
    msgTaxNo:
    {
        title: "Achtung",   
        btn01: "OK",   
        msg: "Bitte geben Sie die MwSt.-Nummer ein!"   
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
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?",
        msgFailed: "Löschen fehlgeschlagen, da ein mit dem Kunden verknüpftes Dokument existiert!",
        msgSuccess: "Erfolgreich gelöscht!"
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
        btn01: "Kunde suchen",
        btn02: "OK",
        msg : "Kunde bereits vorhanden!"
    },
    chkTaxSucre : "Zuckersteuer",
    txtAccountingCode : "Buchungscode",
    tabTitleDetail : "Detailinformationen",
    validation : 
    {
        frmCustomers: "Der Code kann nicht leer sein!",
    },
    txtSubCustomer : "Tochterlieferant", 
    pg_subCustomer : 
    {
        title : "Auswahl des Tochterlieferanten",  
        clmCode : "Code", 
        clmTitle : "Titel", 
        clmName : "Vorname",  
        clmLastName  : "Nachname", 
    },
    txtMainCustomer : "Hauptlieferant",
    pg_mainCustomer : 
    {
        title : "Auswahl des Hauptlieferanten", 
        clmCode : "Code",   
        clmTitle : "Titel",  
        clmName : "Vorname",   
        clmLastName  : "Nachname", 
    },
    txtArea : "Gebiet", 
    pg_AreaCode : 
    {
        title : "Gebietsauswahl", 
        clmCode : "Code", 
        clmName : "Name", 
    },
    txtSector : "Sektor",
    pg_SectorCode : 
    {
        title : "Sektorauswahl",  
        clmCode : "Code",  
        clmName : "Name", 
    },
    txtPriceListNo: "Preislisten-Nummer", //BAK
    pg_priceListNo: //BAK
    {
        title: "Preislisten-Auswahl",
        clmNo: "Nummer",
        clmName: "Name"
    },
    popNote : 
    {
        title : "Notiz hinzufügen", 
    },
    tabTitleNote : "Notizen", 
    grdNote:
    {
        clmNote : "Notiz",
        clmName : "Name", 
    },
    txtMainGroup : "Hauptgruppe",
    pg_MainGroup : 
    {
        title : "Gruppenauswahl",
        clmCode : "Code",
        clmName : "Name",
    },
    btnSubGroup: "Untergruppe hinzufügen",
    pg_subGroup: 
    {
        title: "Untergruppen-Auswahl",
        clmName: "Name",
    },
    msgTaxInSpace: 
    {
        title: "Achtung",
        btn01: "Einverstanden",
        msg: "Bitte geben Sie die MwSt.-Nummer ohne Leerzeichen ein!"
    }
}
export default cri_01_001
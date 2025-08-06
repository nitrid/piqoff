// Ödeme
const fns_02_001 =
{
    txtRefRefno : "Ref.-Ref. Nr.",
    menu  : "Zahlung",
    cmbDepot: "Lager",
    cmbCashSafe : "Kasse auswählen",
    cmbCheckSafe : "Scheck",
    cmbBank : "Bankauswahl",
    txtCustomerCode : "Kundencode",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt",
    txtDiscount : "Promotion",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getDispatch : "Lieferschein abrufen",
    cash : "Gesamt",
    description :"Grund",
    checkReference : "Referenz",
    btnAddPay : "Zahlungseingang",
    invoiceSelect : "Rechnungsauswahl",
    btnCash : "Zahlungseingang",
    ValidCash : "Bitte geben Sie einen Betrag größer als 0 ein", 
    cmbPayType : 
    {
        title : "Zahlungsart",
        cash : "Bargeld",
        check : "Scheck",
        bankTransfer : "Kontoüberweisung",
        otoTransfer : "Lastschrift",
        foodTicket : "Restaurantgutschein",
        bill : "Rechnung",
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Sequenz",
        clmInputName : "Kundenname",
        clmInputCode  : "Kundencode",
        clmTotal : "Gesamt inkl. MwSt."
    },
    pg_invoices : 
    {
        title : "Rechnungsauswahl",
        clmReferans : "Referenz",
        clmOutputName : "Kundenname",
        clmDate : "Datum",
        clmTotal : "Gesamt",
        clmRemaining  : "Rest",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Typ"
    },
    grdDocPayments: 
    {
        clmCreateDate: "Registrierungsdatum",
        clmAmount : "Gesamt",
        clmOutputName : "Kasse/Bank",
        clmDescription : "Grund",
        clmInvoice : "Rechnungsreferenz",
        clmFacDate : "Rechnungsdatum",
        clmDocDate : "Datum"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Inventar kann nicht eingegeben werden, bevor die Dokumentkopfzeilen vollständig sind!"
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
        msgSuccess: "Speichern erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die Pflichtfelder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Datensatz wirklich löschen?"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolg",
        btn01: "OK",
        msg: "Dokument entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gesperrt! \n Um Änderungen zu speichern, müssen Sie es mit dem Administrator-Passwort entsperren!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Keine Transaktion kann durchgeführt werden, ohne das Dokument zu entsperren!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!!"
    },
    popCash : 
    {
        title: "Zahlungseingang",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheck-Eingabe",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Bankeinzug-Eingabe",
        btnApprove : "Hinzufügen"
    },
    validRef :"Die Referenz kann nicht leer sein",
    validRefNo : "Ref. Nr. kann nicht leer sein",
    validDepot : "Sie müssen das Lager auswählen",
    validCustomerCode : "Der aktuelle Code kann nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    msgInvoiceSelect:
    {
        title: "Achtung",   
        btn01: "OK",    
        msg: "Sie können den Vorgang nicht durchführen, ohne eine Rechnung auszuwählen!"  
    },  
    msgNotBank : "Bitte wählen Sie ein Konto aus",
}
export default fns_02_001
// Ödeme
const fns_02_001 =
{
    txtRefRefno : "Seriennummer",
    menu  : "Zahlung",
    cmbDepot: "Lager",
    cmbCashSafe : "Kasse Auswahl",
    cmbCheckSafe : "Scheckkonto",
    cmbBank : "Bank Auswahl",
    txtCustomerCode : "Kunden-Code",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Dokumentenrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    getDispatch : "Lieferschein Suchen",
    cash : "Betrag",
    description :"Beschreibung",
    checkReference : "Referenz",
    btnAddPay : "Zahlung eingeben",
    invoiceSelect : "Rechnungsauswahl",
    btnCash : "Zahlung eingeben",
    ValidCash : "Bitte geben Sie einen Betrag größer als 0 ein",
    cmbPayType : {
        title : "Zahlungsart",
        cash : "Bar",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Überweisung",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "NUMMER",
        clmInputName : "Kundenname",
        clmInputCode  : "Kunden-Code",
    },
    pg_invoices:
    {
        title: "Rechnungsauswahl",
        clmReferans: "REFERENZ",
        clmOutputName: "KUNDENAME",
        clmDate: "DATUM",
        clmTotal: "GESAMT",
        clmRemaining: "OFFEN",
    },
    pg_txtCustomerCode:
    {
        title: "Kundenauswahl",
        clmCode: "KUNDENCODE",
        clmTitle: "KUNDENAME",
        clmTypeName: "TYP",
        clmGenusName: "ART"
    },
    grdDocPayments:
    {
        clmCreateDate: "Erstellungsdatum",
        clmAmount: "Betrag",
        clmOutputName: "Kasse/Bank",
        clmDescription: "Beschreibung",
        clmInvoice: "Rechnungsreferenz",
        clmFacDate: "Rechnungsdatum",
        clmDocDate: "Zahlungsdatum"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Bestandsdaten erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!"
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
        msgSuccess: "Ihr Speichervorgang war erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Die Dokumentensperre wurde aufgehoben!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Kennwort des Administrators verwenden, um die Änderungen zu speichern!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen ausgeführt werden, solange das Dokument nicht entsperrt ist!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    popCash:
    {
        title: "Einzahlung",
        btnApprove: "Hinzufügen"
    },
    popCheck:
    {
        title: "Scheck-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popBank:
    {
        title: "Banküberweisung",
        btnApprove: "Hinzufügen"
    },
    validRef: "Seriennummer darf nicht leer sein",
    validRefNo: "Nummer darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Kundencode darf nicht leer sein",
    validDocDate: "Bitte wählen Sie ein Datum",
    msgInvoiceSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keine Zahlung hinzufügen, ohne eine Rechnung auszuwählen!"
    },
    msgNotBank : "Bitte wählen Sie ein Konto",
}
export default fns_02_001
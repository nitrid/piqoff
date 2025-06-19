// Tahsilat
const fns_02_002 = 
{
    txtRefRefno: "Seriennummer-Nummer",
    menu: "Zahlungseingang",
    cmbDepot: "Lager",
    cmbCashSafe: "Kassenauswahl",
    cmbCheckSafe: "Scheckkasse",
    cmbBank: "Bankauswahl",
    txtCustomerCode: "Kundencode",
    txtCustomerName: "Kundenname",
    dtDocDate: "Datum",
    txtAmount: "Betrag",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Lieferdatum",
    cash: "Betrag",
    description: "Beschreibung",
    checkReference: "Referenz",
    btnCash: "Bargeld-Eingabe",
    invoiceSelect: "Rechnungsauswahl",
    ValidCash: "Bitte geben Sie einen Betrag größer als 0 ein",
    checkDate: "Scheckdatum",
    cmbPayType: {
        title: "Zahlungsart",
        cash: "Bargeld",
        check: "Scheck",
        bankTransfer: "Banküberweisung",
        otoTransfer: "Automatische Zahlung",
        foodTicket: "Essensgutschein",
        bill: "Wechsel",
    },
    pg_Docs:
    {
        title: "Dokumentenauswahl",
        clmDate: "DATUM",
        clmRef: "Serie",
        clmRefNo: "NUMMER",
        clmOutputName: "KUNDENNAME",
        clmOutputCode: "KUNDENCODE",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    grdDocPayments: 
    {
        clmCreateDate: "Erstellungsdatum",
        clmAmount : "Betrag",
        clmInputName : "Kasse/Bank",
        clmDescription : "Beschreibung",
        clmInvoice : "Bezahlte Rechnung",
        clmFacDate : "Rechnungsdatum",
        clmDocDate : "Zahlungsdatum"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Lagerbestände erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
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
        msg: "Das Dokument wurde entsperrt!",
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
        msg: "Das Dokument ist gesperrt! Änderungen und Speichern nur mit dem Administratorpasswort möglich!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Vorgänge durchgeführt werden, solange das Dokument nicht entsperrt ist!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    popCash : 
    {
        title: "Bargeld Einzahlung",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheck Einzahlung",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Banküberweisung",
        btnApprove : "Hinzufügen"
    },
    validRef :"Seriennummer darf nicht leer sein",
    validRefNo : "Laufende Nummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundencode darf nicht leer sein",
    validDocDate : "Bitte wählen Sie ein Datum aus",
    msgInvoiceSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keine Vorgänge durchführen, ohne eine Rechnung auszuwählen!"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Trennen Sie die entsprechende Verbindung, um diese Aktion auszuführen.",
    },
}
export default fns_02_002
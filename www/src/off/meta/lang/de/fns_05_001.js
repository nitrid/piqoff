//"Toplu Tahsilat Girişi"
const fns_05_001 =
{
    txtRefRefno : "Seriennummer",
    cmbCashSafe : "Tresor auswählen",
    cmbCheckSafe : "Scheck-Tresor",
    cmbBank : "Bank auswählen",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    cash : "Betrag",
    description :"Beschreibung",
    checkReference : "Referenz",
    btnCash : "Einzugseingabe",
    ValidCash : "Geben Sie einen Betrag größer als 0 ein",
    excelAdd : "Eintrag aus Excel",
    popExcel : 
    {
        title:"Die Spaltenüberschriften in Ihrer Excel-Datei müssen korrekt sein",
        clmDate : "Datum",
        clmDesc : "Beschreibung",
        clmAmount : "Betrag",
        shemaSpeichern : "Schema speichern"
    },
    cmbPayType : 
    {
        title : "Zahlungstyp",
        cash : "Bar",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Zahlung",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
    },
    pg_txtCustomerCode : 
    {
        title : "Kunden auswählen",
        clmCode :  "KUNDENNUMMER",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    grdDocPayments: 
    {
        clmDate : "Datum",
        clmCustomerCode : "Kundennummer",
        clmCustomerName : "Kundenname",
        clmAmount : "Betrag",
        clmInputName : "Tresor/Bank",
        clmDescription : "Beschreibung",
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokumentenkopf muss ausgefüllt werden, bevor Lagerbestand eingegeben werden kann!"
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
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    popCash : 
    {
        title: "Barzahlung",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeinzug",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Banküberweisung",
        btnApprove : "Hinzufügen"
    },
    validRef :"Serie darf nicht leer sein",
    validCustomerCode : "Kundennummer darf nicht leer sein",
}
export default fns_05_001
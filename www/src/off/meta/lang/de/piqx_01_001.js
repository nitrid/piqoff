// "Liste der eingehenden Rechnungen"
const piqx_01_001 =
{
    btnGet: "Abrufen",
    dtFirst: "Anfangsdatum",
    dtLast: "Enddatum",
    grdList: 
    {
        clmDate: "Datum",
        clmFromNo: "Steuernummer",
        clmFromTitle: "Bezeichnung",
        clmStatus: "Status"
    },
    popImport:
    {
        title: "Importieren",
        btnImport: "Importieren",
        txtCustomerCode: "Lieferantencode",
        txtCustomerName: "Lieferantenname",
        dtDocDate: "Belegdatum",
        dtShipDate: "Versanddatum",
        cmbDepot: "Lager",
        txtHT: "Zwischensumme",
        txtTax: "Steuer",
        txtTTC: "Gesamtsumme",
        clmItemCode: "Artikelcode",
        clmMulticode: "Mehrfachcode",
        clmItemName: "Artikelname",
        clmQuantity: "Menge",
        clmPrice: "Preis",
        clmDiscount: "Rabatt",
        clmAmount: "Betrag",
        msgImport:
        {
            title: "Achtung",
            btn01: "OK",
            msg1: "Keine Daten zu importieren!",
            msg2: "Bitte wählen Sie ein Lager aus!",
            msg3: "Import kann nicht durchgeführt werden, Lieferant nicht gefunden!",
            msg4: "Sie können die Übertragung nicht durchführen, solange nicht definierte Produkte in der Liste sind!",
            msg5: "Die Einkaufsrechnung wurde unter der Nummer registriert.",
            msg6: "Sie können eine bereits importierte Rechnung nicht erneut registrieren!",
        }
    },
}

export default piqx_01_001;
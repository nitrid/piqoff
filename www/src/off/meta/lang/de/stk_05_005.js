// "Lagerbewegungs-Bericht"
const stk_05_005 =
{
    txtRef : "Produkt",
    cmbCustomer :"Kunde",
    btnGet :"Suchen",
    dtFirst : "Startdatum",
    dtLast : "Enddatum",
    txtCustomerCode : "Kundencode",
    cmbDevice :"Gerät",
    txtTicketno : "Ticket-ID",
    numFirstTicketAmount : "Haupteinheit",
    numLastTicketAmount : "Hauptinhalt",
    cmbUser :"Benutzer",
    txtItem :"Produktcode",
    ckhDoublePay : "Mehrfachzahlung",
    cmbType :"Beschreibungstyp",
    dtDate : "Datum",
    txtTotal : "Gesamtverkauf",
    grdItemMoveReport: 
    {
        clmLuser: "Benutzer",
        clmLdate: "Datum",
        clmTypeName: "Dokumenttyp",
        clmRef: "Serie",
        clmRefNo : "Nummer",
        clmDocDate : "Dokumentdatum",
        clmItemName : "Produktname",
        clmInputName : "Eingang",
        clmOutputName : "Ausgang",
        clmQuantity : "Menge",
        clmDepoQuantity: "Lagerbestand",
        clmPrice : "Preis",
        clmTotalHt : "Betrag ohne MwSt.",
    },
    pg_txtRef:
    {
        title: "Produktauswahl",
        clmCode: "CODE",
        clmName: "NAME", 
        clmBarcode: "BARCODE", 
        clmStatus : "STATUS"
    },
    cancel : "Abbrechen",
    msgItemSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie ein Produkt aus!"
    },
}
export default stk_05_005
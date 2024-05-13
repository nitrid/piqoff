// "Satış Fiş Raporu"
const pos_02_001 =
{
    TicketId: "Beleg-ID",
    cmbCustomer: "Kunde",
    btnGet: "Suchen",
    dtFirst: "Anfangsdatum",
    dtLast: "Enddatum",
    txtCustomerCode: "Kunde",
    cmbDevice: "Gerät",
    txtTicketno: "Beleg-ID",
    numFirstTicketAmount: "Unterer Betrag",
    numLastTicketAmount: "Oberer Betrag",
    cmbUser: "Benutzer",
    txtItem: "Artikelcode",
    ckhDoublePay: "Mehrere Zahlungen",
    pg_txtCustomerCode:
    {
        title: "Kundenauswahl",
        clmCode: "KUNDENCODE",
        clmTitle: "KUNDENNAME",
        clmTypeName: "TYP",
        clmGenusName: "ART"
    },
    grdSaleTicketReport:
    {
        clmDate: "Datum",
        clmTime: "Uhrzeit",
        slmUser: "Benutzer",
        clmCustomer: "Kunde",
        clmCardId: "Karten-Id",
        clmDiscount: "Rabatt",
        clmLoyalyt: "Loyalyt",
        clmHT: "Zwischensumme",
        clmVTA: "Steuern",
        clmTTC: "Summe",
        clmTicketID: "Beleg-ID",
    },
    pg_txtItem:
    {
        title: "Artikelauswahl",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
    },
    grdSaleTicketItems:
    {
        clmBarcode: "Barcode",
        clmName: "Artikelname",
        clmQuantity: "Menge",
        clmPrice: "Preis",
        clmTotal: "Betrag"
    },
    grdSaleTicketPays:
    {
        clmPayName: "Zahlungsart",
        clmTotal: "Betrag",
    },
    popDetail:
    {
        title: "Belegdetails"
    },
    cmbPayType:
    {
        title: "Zahlungsart",
        esc: "Barzahlung",
        cb: "Kartenzahlungen",
        check: "Scheck",
        ticket: "Ticketrestaurant",
        bonD: "İade Beleg-",
        Davoir: "İade",
        virment: "Überweisung",
        prlv: "Abbuchung/Lastschrift",
        all: "Alle",
    },
    payChangeNote: "Änderungen am Dokument sollten ausnahmsweise vorgenommen und Fehler korrigiert werden dürfen!",
    payChangeNote2: "Änderungsverlauf wird gespeichert!",
    txtPayChangeDescPlace: "Bitte geben Sie den Grund für Ihre Änderungen ein",
    txtPayChangeDesc: "Zahlungsart wurde falsch eingegeben. Die Korrektur wurde vorgenommen.",
    popLastTotal:
    {
        title: "Zahlung"
    },
    trDeatil: "T.R Detay",
    lineDelete: "Satir Abbrechen",
    Abbrechen: "Abbrechen",
    popOpenTike:
    {
        title: "Nicht validierte Belege"
    },
    grdOpenTike:
    {
        clmUser: "Benutzer",
        clmDevice: "Gerät",
        clmDate: "Datum",
        clmTicketId: "Kassenzettel",
        clmTotal: "Betrag",
        clmDescription: "Beschreibung"
    },
    popDesign:
    {
        title: "Designauswahl",
        design: "Design",
        lang: "Dokumentsprache"
    },
    btnMailSend: "E-Mail senden",
    mailPopup:
    {
        title: "E-Mail-Adresse eingeben"
    },
    msgFacture:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Die ausgewählten Kassenzettel als Rechnung drucken. Sind Sie damit einverstanden?"
    },
    msgFactureCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Quittungen ohne definierten Kunden können nicht in eine Rechnung umgewandelt werden!"
    },
}
export default pos_02_001
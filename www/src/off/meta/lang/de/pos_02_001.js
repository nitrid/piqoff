// "Satış Fiş Raporu"
const pos_02_001 =
{
    TicketId: "Beleg-ID",
    cmbCustomer: "Kunde",
    validDesign: "Bitte wählen Sie ein Design",
    btnGet: "Suchen",
    dtFirst: "Anfangsdatum",
    dtLast: "Enddatum",
    txtCustomerCode: "Kundencode",
    cmbDevice: "Gerät",
    txtTicketno: "Belegnummer",
    numFirstTicketAmount: "Unterer Betrag",
    numLastTicketAmount: "Oberer Betrag",
    cmbUser: "Benutzer",
    txtItem: "Artikelcode",
    ckhDoublePay: "Mehrere Zahlungen",
    chkDeletedTicket: "Gelöschte Belege anzeigen",
    pg_txtCustomerCode:
    {
        title: "Kundenauswahl",
        clmCode: "Kundencode",
        clmTitle: "Kundenname",
        clmTypeName: "Typ",
        clmGenusName: "Art"
    },
    grdSaleTicketReport:
    {
        clmDate: "Datum",
        clmTime: "Uhrzeit",
        slmUser: "Benutzer",
        clmCustomer: "Kundenname",
        clmCardId: "Kunden-Nr.",
        clmDiscount: "Rabatt",
        clmLoyalyt: "Treue",
        clmHT: "Zwischensumme",
        clmVTA: "MwSt.",
        clmTTC: "Gesamt",
        clmTicketID: "Beleg-ID",
        clmFacRef: "Rechnungsnr.",
        clmRef: "Ref Nr",
    },
    pg_txtItem:
    {
        title: "Artikelauswahl",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
    },
    grdSaleTicketItems:
    {
        clmBarcode: "Strichcode",
        clmName: "Artikelname",
        clmQuantity: "Menge",
        clmPrice: "Preis",
        clmTotal: "Gesamt",
        clmTime: "Uhrzeit",
    },
    grdSaleTicketPays:
    {
        clmPayName: "Zahlungsart",
        clmTotal: "Gesamt",
    },
    popDetail:
    {
        title: "Belegdetails"
    },
    cmbPayType:
    {
        title: "Zahlungsart",
        esc: "Barzahlung",
        cb: "Kreditkarte",
        check: "Scheck",
        ticket: "Restaurantticket",
        bonD: "Gutschriftbeleg",
        avoir: "Gutschrift",
        virment: "Überweisung",
        prlv: "Abbuchung/Lastschrift",
        all: "Alle",
        cbRest: "CB T.Resto"
    },
    payChangeNote: "Änderungen am Beleg sollten nur ausnahmsweise vorgenommen und Fehler korrigiert werden dürfen!",
    payChangeNote2: "Änderungsverlauf wird gespeichert!",
    txtPayChangeDescPlace: "Bitte geben Sie eine Beschreibung ein.",
    txtPayChangeDesc: "Die Zahlungsart wurde falsch eingegeben. Die Korrektur wurde vorgenommen.",
    popLastTotal:
    {
        title: "Zahlung"
    },
    trDeatil: "T.R Detail",
    lineDelete: "Zeile stornieren",
    cancel: "Abbrechen",
    popOpenTike:
    {
        title: "Offene Belege"
    },
    grdOpenTike:
    {
        clmUser: "Benutzer",
        clmDevice: "Kassen-Nr.",
        clmDate: "Datum",
        clmTicketId: "Beleg-Nr.",
        clmTotal: "Gesamt",
        clmDescription: "Grund"
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
        title: "E-Mail-Adresse eingeben",
        cmbMailAddress: "E-Mail-Adresse",
        txtMailSubject: "Betreff",
        txtSendMail: "E-Mail-Adresse",
        txtMailHtmlEditor: "Inhalt"
    },
    msgFacture:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Die ausgewählten Belege werden in eine Rechnung umgewandelt. Sind Sie sicher?"
    },
    msgFactureCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Eine Rechnung kann nicht erstellt werden, wenn kein Kunde für den Beleg ausgewählt ist!"
    },
    msgNoFacture:
    {
        msg: "Belege ohne Rechnung können nicht in eine Rechnung umgewandelt werden!"
    }
}
export default pos_02_001
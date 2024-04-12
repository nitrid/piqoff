// "Proforma Alış Faturası"
const ftr_04_003 =
{
    txtRefRefno : "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Positionsrabatt",
    txtDocDiscount : "Dokumentrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "..",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getDispatch : "Lieferschein Suchen",
    getPayment : "Zahlungseingang",
    cash : "Betrag",
    description :"Beschreibung",
    checkReference : "Referenz",
    btnCash : "Zahlung hinzufügen",
    btnCheck : "Scheck",
    btnBank : "Banküberweisung",
    cmbCashSafe : "Kasse auswählen",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bank auswählen",
    txtPayInvoiceTotal : "Rechnungsbetrag",
    txtPayTotal : "Gesamtzahlung",
    txtRemainder : "Ausstehender Rechnungsbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellung Suchen",
    popExcel : {title:"Die Spaltenüberschriften Ihrer Excel-Datei müssen korrekt sein."},
    excelAdd : "Aus Excel hinzufügen",
    shemaSpeichern : "Schema speichern",
    tabTitleSubtotal : "Gesamtsumme der Rechnung",
    tabTitlePayments : "Dokumentzahlungsinformationen",
    txtDiffrentTotal : "Gesamtunterschied",
    tabTitleOldInvoices : "Historische Rechnungsinformationen",
    txtDiffrentNegative : "Unterschied für gesenkte Preise",
    txtDiffrentPositive : "Unterschied für erhöhte Preise",
    txtDiffrentInv : "Ausgestellte Preisänderungsrechnung",
    txtbalance : "Gesamtsaldo des Kunden",
    getRemainder : "Ausstehenden Betrag Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Kundenpreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum",
    getOffers : "Angebot Suchen",
    txtTotalHt : "Rabattierter Betrag",
    txtDocNo : "Dokumentnummer",
    validDesign : "Bitte wählen Sie ein Design.",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validMail : "Bitte nicht leer lassen.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Aktion kann ohne Dokumentenregistrierung nicht durchgeführt werden!"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail-Versand erfolgreich!",
        msgFailed: "E-Mail-Versand fehlgeschlagen!"
    },
    popMailSend :
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail-Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "Seriennummer",
        clmOutputName : "KUNDENNAME",
        clmOutputCode  : "KUNDENNUMMER",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENNUMMER",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode : 
    {
        title : "Artikelauswahl",
        clmCode :  "ARTIKELNUMMER",
        clmName : "ARTIKELNAME",
        clmMulticode : "LIEFERANTENNUMMER",
        clmPrice : "EINKAUFSPREIS"
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Seriennummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
    },
    grdPurcInv: 
    {
        clmItemCode: "Artikelnummer",
        clmItemName: "Artikelname",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabattsatz",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamtsumme ohne. ..",
        clmDispatch : "Lieferscheinnummer",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDiffPrice : "Differenz",
        clmCustomerPrice : "Kundenpreis",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Typ",
        clmPrice: "Preis",
        clmCreateDate: "Erstellungsdatum",
    },
    popPayment:
    {
        title: "Zahlungen",
    },
    popDiscount : 
    {
        title: "Positionsrabatt",
        chkFirstDiscount : "1. Rabatt auf Position aktualisieren",
        chkDocDiscount : "Als Dokumentrabatt anwenden",
        Percent1 : "1. Rabatt in Prozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in Prozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in Prozent",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentrabatt",
        Percent1 : "1. Rabatt in Prozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in Prozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in Prozent",
        Price3 : "3. Rabattbetrag"
    },
    popPassword : 
    {
        title: "Bitte geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Bestände erfasst werden, bevor die Dokumentenkopfdaten nicht vollständig sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen über dem verbleibenden Betrag vorgenommen werden!"
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
        msgFailed: "Fehler beim Speichern Ihres Eintrags!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer wirklich auf Null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der höher ist als der Betrag!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt gewährt werden, der höher ist als der Betrag!"
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
        msg: "Das Dokument ist gesperrt! Um Änderungen vorzunehmen, müssen Sie es mit dem Administratorpasswort entsperren!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein Dokument mit einer erfolgten Zahlung kann nicht gelöscht werden!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Vorgänge durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag kann nicht höher sein als der Gesamtbetrag!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!"
    },
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Der ausgewählte Artikel ist dem Kunden nicht zugeordnet! Möchten Sie den Vorgang fortsetzen?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    msgUnderPrice1:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sie verkaufen zu einem niedrigeren Preis als den Einkaufspreis!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Verkaufspreis kann nicht niedriger sein als der Einkaufspreis!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    popCash : 
    {
        title: "Bargeldeingabe",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeingabe",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Banküberweisung",
        btnApprove : "Hinzufügen"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
    },
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Fehlende Codes:"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenhinzufügung von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear : "Löschen",
        btnSpeichern : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchart",
        customerCode : "Nach Lieferantennummer",
        ItemCode : "Nach Artikelnummer"
    },
    grdMultiItem : 
    {
        clmCode : "Artikelnummer",
        clmMulticode : "Lieferantennummer",
        clmName : "Artikelname",
        clmQuantity : "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alle hinzufügen",
        btn02: "Neu geschriebene zur Liste hinzufügen",
        msg: "Es befinden sich Artikel in der Liste!"
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge (2. Einheit)",
        margin : "Marge"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Menge"
    },
    popUnit2 : 
    {
        title : "Einheitendetails"
    },
    msgUnit:
    {
        title: "Einheitsauswahl",
        btn01: "Bestätigen",
        btnFactorSpeichern : "Lagerkarte aktualisieren"
    },
    validRef :"Die Seriennummer darf nicht leer sein",
    validRefNo : "Die Reihennummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundencode darf nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein",
    msgNewPrice : 
    {
        title: "Achtung",
        btn01: "Keinen aktualisieren",
        btn02: "Ausgewählte Preise aktualisieren",
        msg: "Bitte wählen Sie die Artikel aus, deren Lieferantenpreis aktualisiert werden soll."
    },
    msgNewPriceDate : 
    {
        title: "Achtung",
        btn01: "Keinen aktualisieren",
        btn02: "Ausgewählte Preise aktualisieren",
        msg: "Bitte wählen Sie die Artikel aus, deren Preise aktualisiert werden sollen."
    },
    grdNewPrice: 
    {
      clmCode: "Code",
      clmName: "Name",
      clmPrice: "Alter E. Preis",
      clmPrice2: "Neuer Preis",
      clmSalePrice: "Verkaufspreis",
      clmMargin: "Bruttomarge",
      clmCostPrice: "Einkaufspreis",
      clmNetMargin: "Nettomarge"
    },
    grdNewPriceDate: 
    {
      clmCode: "Code",
      clmName: "Name",
      clmPrice: "Alter E. Preis",
      clmPrice2: "Neuer Preis",
      clmSalePrice: "Verkaufspreis",
      clmMargin: "Bruttomarge",
      clmCostPrice: "Einkaufspreis",
      clmNetMargin: "Nettomarge"
    },
    msgPriceDateUpdate: 
    {
      msg: "Möchten Sie die Daten unveränderter Preise aktualisieren?",
      btn01: "Ja",
      btn02: "Nein",
      title: "Achtung"
    },
    msgNewVat: 
    {
      title: "Achtung",
      btn01: "Keine Aktualisierung",
      btn02: "Ausgewählte Raten aktualisieren",
      msg: "Verschiedene Mehrwertsteuersätze sind in Rechnung und System vorhanden."
    },
    grdNewVat: 
    {
      clmCode: "Code",
      clmName: "Name",
      clmVat: "Vorhandene ..",
      clmVat2: "Neue .."
    },
    serviceAdd: "Dienstleistung hinzufügen",
    pg_service: 
    {
      title: "Dienstleistungen",
      clmCode: "Code",
      clmName: "Name"
    },
    pg_txtBarcode: 
    {
      title: "Barcode-Auswahl",
      clmCode: "ARTIKELCODE",
      clmName: "ARTIKELNAME",
      clmMulticode: "LIEFERANTENCODE",
      clmBarcode: "Barcode"
    },
    msgQuantity:
    {
      title: "Menge",
      btn01: "Hinzufügen",
      msg: "Geben Sie die Menge ein"
    },
    cmbPayType: {
      title: "Zahlungstyp",
      cash: "Bar",
      check: "Scheck",
      bankTransfer: "Banküberweisung",
      otoTransfer: "Automatische Zahlung",
      foodTicket: "Essensgutschein",
      bill: "Wechsel",
    },  
    pg_adress: 
    {
      title: "Adressauswahl",
      clmAdress: "ADRESSE",
      clmCity: "STADT",
      clmZipcode: "POSTLEITZAHL",
      clmCountry: "LAND",
    },
    msgCode: 
    {
      title: "Achtung",
      btn01: "Zum Dokument gehen",
      msg: "Dokument gefunden"
    },
    pg_offersGrid: 
    {
      title: "Bestellauswahl",
      clmReferans: "Serie - Nummer",
      clmCode: "Code",
      clmName: "Name",
      clmQuantity: "Anzahl",
      clmTotal: "Betrag",
      clmPrice: "Preis",
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default ftr_04_003
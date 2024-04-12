// "Proforma İade Faturası"
const ftr_04_004 =
{
    txtRefRefno: "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode: "Kundennummer",
    txtCustomerName: "Kundenname",
    dtDocDate: "Datum",
    txtAmount: "Betrag",
    txtDiscount: "Zeilenrabatt",
    txtDocDiscount: "Dokumentenrabatt",
    txtSubTotal: "Zwischensumme",
    txtMargin: "Marge",
    txtVat: "..",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Versanddatum",
    getPayment: "Zahlungseingang",
    getDispatch: "Lieferschein Suchen",
    cash: "Betrag",
    description: "Beschreibung",
    checkReference: "Referenz",
    btnCash: "Zahlung hinzufügen",
    btnCheck: "Scheck",
    btnBank: "Banküberweisung",
    cmbCashSafe: "Kassen-Auswahl",
    cmbCheckSafe: "Scheckkasse",
    cmbBank: "Bank-Auswahl",
    txtPayInvoiceTotal: "Rechnungsbetrag",
    txtPayTotal: "Gesamtzahlung",
    txtRemainder: "Restbetrag",
    txtBarcode: "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity: "Menge",
    tabTitleSubtotal: "Rechnungsgesamtsumme",
    tabTitlePayments: "Zahlungsinformationen",
    tabTitleOldInvoices: "Alte Rechnungen",
    getRemainder: "Restbetrag Suchen",
    txtBalance: "Gesamtsaldo des Kunden",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee: "Verzugsgebühr",
    dtExpDate: "Fälligkeitsdatum", 
    txtTotalHt: "Rabattierter Betrag",
    txtDocNo: "Belge Nr.",
    validDesign : "Bitte wählen Sie ein Design.",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang kann nicht ohne Speicherung des Dokuments durchgeführt werden!"
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
        txtMailSubject : "Betreff der E-Mail",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    pg_Docs: 
    {
      title: "Dokumentenauswahl",
      clmDate: "DATUM",
      clmRef: "Serie",
      clmRefNo: "NUMMER",
      clmInputName: "KUNDENNAME",
      clmInputCode: "KUNDENNUMMER",
    },
    pg_txtCustomerCode: 
    {
      title: "Kundenauswahl",
      clmCode: "KUNDENNUMMER",
      clmTitle: "KUNDENNAME",
      clmTypeName: "TYP",
      clmGenusName: "GENUS"
    },
    pg_txtItemsCode: 
    {
      title: "Artikelauswahl",
      clmCode: "ARTIKELNUMMER",
      clmName: "ARTIKELNAME",
      clmPrice : "EINKAUFSPREIS"
    },
    pg_dispatchGrid: 
    {
      title: "Lieferscheinauswahl",
      clmReferans: "Serie - Nummer",
      clmCode: "Code",
      clmName: "Name",
      clmQuantity: "Anzahl",
      clmPrice: "Preis",
      clmTotal: "Betrag",
      clmDate: "Datum",
    },
    grdRebtInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabattsatz",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamtsumme (ohne ..)",
        clmDispatch : "Lieferschein-Nr.",
        clmDateDispatch : "Datum",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmMulticode : "T-Code",
        clmBarcode : "Barcode",
        clmVatRate :"..-Satz",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Untereinheitspreis",
        clmSubFactor : "Faktor",
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
        title: "Zeilenrabatt",
        chkFirstDiscount : "Aktualisieren des 1. Rabatts in der Zeile",
        chkDocDiscount : "Als Dokumentrabatt anwenden",
        Percent1 : "1. Rabatt (%)",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt (%)",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt (%)",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentrabatt",
        Percent1 : "1. Rabatt (%)",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt (%)",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt (%)",
        Price3 : "3. Rabattbetrag"
    },
    popPassword : 
    {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Stammangaben zum Dokument müssen vor der Lagerbuchung vervollständigt werden!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen eingegeben werden, die den Restbetrag überschreiten!"
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
        msgSuccess: "Speichern erfolgreich!",
        msgFailed: "Speichern fehlgeschlagen!"
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
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer auf Null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattbetrag größer als der Betrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattprozentsatz größer als der Betrag gewährt werden!"
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
        msg: "Die Sperre des Dokuments wurde aufgehoben!"
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Falsches Passwort!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Administratorpasswort eingeben, um Änderungen zu speichern!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein Dokument mit einer Zahlung kann nicht gelöscht werden!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Änderungen vorgenommen werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabatt kann nicht größer als der Betrag sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Kunde nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Das gewünschte Artikel ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    popCash : 
    {
        title: "Bareinzahlung",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeinzahlung",
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
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    },
    validRef :"Die Serie darf nicht leer sein",
    validRefNo : "Die Nummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Der Kundencode darf nicht leer sein",
    validDocDate : "Bitte wählen Sie ein Datum",
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "Artikelcode",
        clmName : "Artikelname",
        clmMulticode : "Lieferantencode",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    cmbPayType : 
    {
        title : "Zahlungstyp",
        cash : "Bargeld",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Zahlung",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge 2",
        margin : "Marge"
    },
    popUnit2 : 
    {
        title : "Einheitendetails"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Anzahl"
    },
    pg_adress : 
    {
        title : "Adressauswahl",
        clmAdress : "ADRESSE",
        clmCity : "STADT",
        clmZipcode : "POSTLEITZAHL",
        clmCountry : "LAND",
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zur Dokumentation gehen",
        msg: "Dokument gefunden"
    },
    pg_service : 
    {
        title : "Dienstleistungen",
        clmCode : "Code",
        clmName : "Name"
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default ftr_04_004
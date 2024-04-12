// "Şube Alış Faturası"
const ftr_02_008 =
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
    getDispatch: "Lieferschein Suchen",
    getPayment: "Zahlungseingang",
    cash: "Betrag",
    description: "Beschreibung",
    checkReference: "Referenz",
    btnCash: "Zahlung hinzufügen",
    btnCheck: "Scheck",
    btnBank: "Überweisung",
    cmbCashSafe: "Kasse auswählen",
    cmbCheckSafe: "Scheckkasse",
    cmbBank: "Bank auswählen",
    txtPayInvoiceTotal: "Rechnungsbetrag",
    txtPayTotal: "Gesamtzahlung",
    txtRemainder: "Restbetrag",
    txtBarcode: "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity: "Menge",
    getOrders: "Bestellung Suchen",
    tabTitleSubtotal: "Rechnungssumme",
    tabTitlePayments: "Zahlungen",
    tabTitleOldInvoices: "Alte Rechnungen",
    getRemainder: "Restbetrag Suchen",
    txtbalance: "Gesamtguthaben",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Kundenpreis",
    txtExpFee: "Verzugsgebühr",
    dtExpDate: "Fälligkeitsdatum",
    btnView: "Anzeigen",
    btnMailsend: "E-Mail senden",
    placeMailen: "Text",
    validDesign: "Bitte wählen Sie ein Design aus.",
    validMail: "Bitte füllen Sie das Feld aus.",
    txtTotalHt: "Rabattierter Betrag",
    txtDocNo: "Dokumentnummer",
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
    pg_Docs: {
      title: "Dokumentauswahl",
      clmDate: "DATUM",
      clmRef: "Serie",
      clmRefNo: "Seriennummer",
      clmInputName: "KUNDENNAME",
      clmInputCode: "KUNDENNUMMER",
    },
    pg_txtCustomerCode: 
    {
      title: "Kundenauswahl",
      clmCode: "KUNDENNUMMER",
      clmTitle: "KUNDENNAME",
      clmTypeName: "TYP",
      clmGenusName: "ART",
    },
    pg_txtItemsCode: 
    {
      title: "Artikelauswahl",
      clmCode: "ARTIKELNUMMER",
      clmName: "ARTIKELNAME",
    },
    pg_dispatchGrid: 
    {
      title: "Lieferscheinauswahl",
      clmReferans: "Seriennummer",
      clmCode: "Code",
      clmName: "Name",
      clmQuantity: "Menge",
      clmPrice: "Preis",
      clmTotal: "Betrag",
      clmDate: "Datum",
    },
    grdSlsInv: 
    {
      clmItemCode: "Code",
      clmItemName: "Name",
      clmPrice: "Preis",
      clmQuantity: "Menge",
      clmDiscount: "Rabatt",
      clmDiscountRate: "Rabatt %",
      clmVat: "..",
      clmAmount: "Betrag",
      clmTotal: "Gesamt",
      clmTotalHt: "Nettogesamt",
      clmDispatch: "Lieferschein-Nr.",
      clmCreateDate: "Erstellungsdatum",
      clmMargin: "Marge",
      clmDescription: "Beschreibung",
      clmCuser: "Benutzer",
      clmVatRate: ".. %",
      clmSubQuantity: "Untereinheit",
      clmSubPrice: "Untereinheitspreis",
      clmSubFactor: "Faktor",
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
    popDiscount: 
    {
      title: "Zeilenrabatt",
      chkFirstDiscount: "1. Rabatt in der Zeile aktualisieren",
      chkDocDiscount: "Als Dokumentenrabatt anwenden",
      Percent1: "1. Rabatt in %",
      Price1: "1. Rabattbetrag",
      Percent2: "2. Rabatt in %",
      Price2: "2. Rabattbetrag",
      Percent3: "3. Rabatt in %",
      Price3: "3. Rabattbetrag",
    },
    popDocDiscount: 
    {
      title: "Dokumentenrabatt",
      Percent1: "1. Rabatt in %",
      Price1: "1. Rabattbetrag",
      Percent2: "2. Rabatt in %",
      Price2: "2. Rabattbetrag",
      Percent3: "3. Rabatt in %",
      Price3: "3. Rabattbetrag",
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
        btn01: "Ok",
        msg: "Es können keine Bestände erfasst werden, solange die Dokumentkopfinformationen nicht vollständig sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Zahlungen eingegeben werden, die den Restbetrag übersteigen!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Ihr Speichervorgang war erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
    },
    msgSpeichernValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Mehrwertsteuer wirklich auf Null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Rabatte gewährt werden, die den Betrag überschreiten!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Rabatte gewährt werden, die den Betrag überschreiten!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument wurde gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "Ok",
        msg: "Das Dokument wurde entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "Ok",
        msg: "Ihr Passwort ist falsch!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Das Dokument ist gesperrt! Änderungen und Speichern nur mit dem Administratorpasswort möglich!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Ein bezahltes Dokument kann nicht gelöscht werden!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Der Rabattbetrag kann den Gesamtbetrag nicht überschreiten!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Kein Bestand gefunden!"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Kunde nicht gefunden!"
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
        btn01: "Ok",
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
        title: "Überweisungseingabe",
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
        btn01: "Ok",
        msg: "Nicht gefundene Codes:"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenartikel hinzufügen",
        btnApprove: "Artikel Suchen",
        btnClear : "Löschen",
        btnSpeichern : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmethode",
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
        btn02: "Neu hinzugefügte zur Liste hinzufügen",
        msg: "Es sind Artikel in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    },
    validRef :"Die Seriennummer darf nicht leer sein",
    validRefNo : "Die Reihennummer darf nicht leer sein",
    validDepot : "Sie müssen ein Lager auswählen",
    validCustomerCode : "Kundennummer darf nicht leer sein",
    validDocDate : "Sie müssen ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Der Lagerbestand kann nicht negativ werden! Höchstmögliche Menge, die hinzugefügt werden kann ist:"
    },
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "LAGERCODE",
        clmName : "LAGERNAME",
        clmMulticode : "LIEFERANTENCODE",
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
        title : "Zahlungsart",
        cash : "Barzahlung",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Zahlung",
        foodTicket : "Essensgutschein",
        bill : "Rechnung",
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge (2. Einheit)",
        margin : "Marge"
    },
    popUnit2 : 
    {
        title : "Einheitendetails"
    },
    grdUnit2 : 
    {
        clmName : "NAME",
        clmQuantity : "Menge"
    },
    pg_adress : 
    {
        title : "Adressauswahl",
        clmAdress : "ADRESSE",
        clmCiyt : "STADT",
        clmZipcode : "POSTLEITZAHL",
        clmCountry : "LAND",
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    popMailSend : 
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail-Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
        msgFailed: "E-Mail konnte nicht gesendet werden!"
    },
    popMailSend : 
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail-Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
        msgFailed: "E-Mail konnte nicht gesendet werden!"
    },
    popRound : 
    {
        title : "Bitte geben Sie den Betrag ein, den Sie runden möchten",
        total : "Summe",
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "OK",
        msg1: "Der Unterschied zwischen den zu rundenden Beträgen darf höchstens ",
        msg2: "€ betragen!"
    },
    msgDiscountEntry : 
    {
        title : "Eingabe des Mengenrabatts",
        btn01 : "Bestätigen"
    },
    txtDiscount1 : "1. Rabattbetrag",
    txtDiscount2 : "2. Rabattbetrag",
    txtDiscount3 : "3. Rabattbetrag",
    txtTotalDiscount :"Gesamtrabattbetrag",
    msgDiscountPerEntry : 
    {
        title : "Eingabe des prozentualen Rabatts",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "1. Rabattprozentsatz",
    txtDiscountPer2 : "2. Rabattprozentsatz",
    txtDiscountPer3 : "3. Rabattprozentsatz",
    serviceAdd : "Dienst hinzufügen",
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
export default ftr_02_008
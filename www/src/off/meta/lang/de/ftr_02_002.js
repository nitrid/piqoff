// "Satış Faturası"
const  ftr_02_002 =
{
    txtRefRefno : "Reihenfolge",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Dokumentenrabatt",
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
    btnBank : "Überweisung",
    cmbCashSafe : "Kassenwahl",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankwahl",
    txtPayInvoiceTotal : "Rechnungsbetrag",
    txtPayTotal : "Gesamtzahlung",
    txtRemainder : "Restbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellung Suchen",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungsinformationen",
    tabTitleOldInvoices : "Alte Rechnungen",
    getRemainder : "Restbetrag Suchen",
    txtbalance : "Aktueller Kontostand",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum",
    getOffers : "Angebote Suchen",
    getProforma : "Proforma Suchen",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    getPreInvoice : "Vorläufige Rechnung Suchen",
    txtTotalHt : "Rabattierter Betrag",
    txtDocNo : "Dokumentnummer",
    extraCost : "Zusatzkosten",
    cmbPricingList : "Preisliste",
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
    msgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sind Sie sicher, dass Sie speichern möchten?",
        btn02: "Abbrechen"
    },
    msgSaveResult :
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Die Änderungen wurden erfolgreich gespeichert!"
    },
    msgSaveFailed :
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Das Speichern der Änderungen ist fehlgeschlagen!"
    },
    msgSaveValid :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
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
        btnCancel : "Abbrechen",
        cmbMailAddress : "Gesendete Mailadresse" // 
    },
    pg_Docs :
    {
        title: "Dokumentenauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "REIHENFOLGE",
        clmInputName : "KUNDENAME",
        clmInputCode  : "KUNDENCODE",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode : 
    {
        title : "Artikelauswahl",
        clmCode :  "ARTIKELCODE",
        clmName : "ARTIKELNAME",
        clmPrice : "VERKAUFSPREIS"
    },
    pg_dispatchGrid : 
    {
        title : "Lieferscheinauswahl",
        clmReferans : "Serie - Reihenfolge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
        clmDocNo: "Dokumentnummer"
    },
    grdSlsInv: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : ".",
        clmAmount : "Betrag",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Nettogesamtsumme",
        clmDispatch : "Lieferschein Nr.",
        clmCreateDate: "Aufnahmedatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmVatRate : ".. %",
        clmOrigin : "Herkunft",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Untereinheitspreis",
        clmSubFactor : "Faktor",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Typ",
        clmPrice: "Preis",
        clmCreateDate: "Aufnahmedatum",

    },
    popPayment:
    {
        title: "Zahlungen",
    },
    popDiscount : 
    {
        title: "Zeilenrabatt",
        chkFirstDiscount : "Ersten Rabatt in der Zeile aktualisieren",
        chkDocDiscount : "Als Dokumentrabatt anwenden",
        Percent1 : "1. Rabatt in %",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in %",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in %",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentrabatt",
        Percent1 : "1. Rabatt in %",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabatt in %",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabatt in %",
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
        msg: "Artikel können nicht eingegeben werden, solange die Dokumentkopfdaten nicht vollständig sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen über dem verbleibenden Betrag erfasst werden!"
    },
    msgInterfel:
    {
        title: "Achtung",
        btn01: "Ja",
        btn02: "Nein",
        msg: "Interfel anwenden?"
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
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!"
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
    msgMaxPriceAlert:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie haben keine Berechtigung, einen Preis über € einzugeben!"
    },
    msgMaxUnitQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie haben keine Berechtigung, eine Menge über ' anzugeben!"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",   
        btn01: "OK",   
        msg: "Die Menge dieser Zeile kann nicht geändert werden, da sie aus dem Lieferschein stammt!"   
    },  
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Steuer auf Null setzen?"
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
        msg: "Die Sperre des Dokuments wurde aufgehoben!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Falsches Passwort!"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen vorzunehmen, müssen Sie das Dokument mit dem Administratorpasswort entsperren!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein Dokument mit geleisteter Zahlung kann nicht gelöscht werden!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Aktionen durchgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag darf den Betrag nicht überschreiten!"
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
        btn01: "Verbinden",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie ein Kunde aus!"
    },
    popCash:
    {
        title: "Bargeld-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popCheck:
    {
        title: "Scheck-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popBank:
    {
        title: "Überweisungs-Eingabe",
        btnApprove: "Hinzufügen"
    },
    popDesign:
    {
        title: "Design-Auswahl",
        design: "Design",
        lang: "Dokumentsprache",
        btnApprove : "Bestätigen",
        btnCancel : "Abbrechen",
        btnSave : "Speichern",
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
        title: "Massenhafte Artikel-Eingabe",
        btnApprove: "Artikel Suchen",
        btnClear: "Löschen",
        btnSpeichern: "Zeilen hinzufügen",
    },
    cmbMultiItemType:
    {
        title: "Suchmethode",
        customerCode: "Nach Lieferantennummer",
        ItemCode: "Nach Artikelcode"
    },
    grdMultiItem:
    {
        clmCode: "Artikelcode",
        clmMulticode: "Lieferantennummer",
        clmName: "Artikelname",
        clmQuantity: "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alles hinzufügen",
        btn02: "Neu geschriebene zur Liste hinzufügen",
        msg: "Artikel in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Auswahleinheit",
        btn01: "Bestätigen",
    },
    validRef: "Seriennummer darf nicht leer sein.",
    validRefNo: "Laufnummer darf nicht leer sein.",
    validDepot: "Sie müssen ein Lager auswählen.",
    validCustomerCode: "Lieferantennummer darf nicht leer sein.",
    validDocDate: "Bitte wählen Sie ein Datum.",
    tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein.",
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lagerbestand kann nicht negativ werden! Höchstmöglicher Betrag, der hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "LAGERCODE",
        clmName: "LAGERNAME",
        clmMulticode: "LIEFERANTENNUMMER",
        clmBarcode: "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein."
    },
    cmbPayType: {
        title: "Zahlungsart",
        cash: "Bargeld",
        check: "Scheck",
        bankTransfer: "Banküberweisung",
        otoTransfer: "Automatische Zahlung",
        foodTicket: "Essensgutschein",
        bill: "Wechsel",
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge 2. Einheit",
        margin: "Marge"
    },
    popUnit2:
    {
        title: "Einheitendetails"
    },
    grdUnit2:
    {
        clmName: "NAME",
        clmQuantity: "Menge"
    },
    pg_adress:
    {
        title: "Adressauswahl",
        clmAdress: "ADRESSE",
        clmCiyt: "STADT",
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
        title: "Angebotsauswahl",
        clmReferans: "Seriennummer - Laufnummer",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmTotal: "Gesamtbetrag",
        clmPrice: "Preis",
    },
    pg_proformaGrid:
    {
        title: "Proforma-Auswahl",
        clmReferans: "Seriennummer - Laufnummer",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmPrice: "Preis",
        clmTotal: "Gesamtbetrag"
    },
    msgUnderPrice1:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sie verkaufen unter den Kosten!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Verkaufspreis darf nicht unter den Einkaufspreis liegen!!"
    },
    popMailSend:
    {
        title: "E-Mail senden",
        txtMailSubject: "E-Mail-Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
        msgFailed: "E-Mail konnte nicht gesendet werden!"
    },
    msgPrintforLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument kann nicht gedruckt werden, solange es gesperrt ist!"
    },
    popRound:
    {
        title: "Bitte geben Sie den Betrag ein, den Sie runden möchten",
        total: "Gesamtbetrag",
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "OK",
        msg1: "Der Unterschied zwischen den zu rundenden Beträgen darf höchstens ",
        msg2: " betragen!"
    },
    msgDiscountEntry:
    {
        title: "Eingabe des Rabattbetrags",
        btn01: "Bestätigen"
    },
    txtDiscount1: "1. Rabattbetrag",
    txtDiscount2: "2. Rabattbetrag",
    txtDiscount3: "3. Rabattbetrag",
    txtTotalDiscount: "Gesamtrabattbetrag",
    msgDiscountPerEntry:
    {
        title: "Eingabe des prozentualen Rabatts",
        btn01: "Bestätigen"
    },
    txtDiscountPer1: "1. Rabattprozentsatz",
    txtDiscountPer2: "2. Rabattprozentsatz",
    txtDiscountPer3: "3. Rabattprozentsatz",
    serviceAdd: "Service hinzufügen",
    pg_service:
    {
        title: "Dienstleistungen",
        clmCode: "Code",
        clmName: "Name"
    },
    popExtraCost:
    {
        title: "Zusatzkosten",
        interfel: "Interfel",
        calculateInterfel: "Interfel berechnen",
    },
    msgCustomerLock: 
    {
        title: "Achtung", //
        btn01: "OK", //
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" //
    },
}
export default ftr_02_002
//  "Alış Faturası"
const ftr_02_001 =
{
    txtRefRefno : "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag ohne Rabatt",
    txtDiscount : "Zeilenrabatt",
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
    btnBank : "Überweisung",
    cmbCashSafe : "Kassenwahl",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankwahl",
    txtPayInvoiceTotal : "Rechnungsbetrag",
    txtPayTotal : "Gesamtzahlung",
    txtRemainder : "Offener Rechnungsbetrag",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity :"Menge",
    getOrders : "Bestellung Suchen",
    popExcel : {title:"Die Spaltenüberschriften Ihrer Excel-Datei müssen korrekt sein"},
    excelAdd : "Aus Excel hinzufügen",
    shemaSpeichern : "Schema speichern",
    tabTitleSubtotal : "Rechnungssumme",
    tabTitlePayments : "Zahlungsinformationen des Dokuments",
    txtDiffrentTotal : "Gesamtunterschied",
    tabTitleOldInvoices : "Alte Rechnungen",
    txtDiffrentNegative : "Differenz für gesunkene Preise",
    txtDiffrentPositive : "Differenz für gestiegene Preise",
    txtDiffrentInv : "Rechnung für Preisunterschied erstellen",
    txtbalance : "Gesamtsaldo des Kunden",
    getRemainder : "Offenen Betrag Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    txtExpFee : "Verzugsgebühr",
    dtExpDate : "Fälligkeitsdatum", 
    getOffers : "Angebot Suchen",
    getProforma : "Proforma Suchen",
    txtTotalHt : "Reduzierter Betrag",
    txtDocNo : "Dokumentnummer",
    cmbOrigin: "Herkunft",
    txtTransport : "Transportart", 
    tabTitleDetail : "Weitere Angaben", 
    validDesign : "Bitte wählen Sie ein Design aus.",
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
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "NUMMER",
        clmOutputName : "KUNDENNAME",
        clmOutputCode  : "KUNDENNUMMER",
        clmTotal : "GESAMT INKL. .."
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
        clmReferans : "Serie - Nummer",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Betrag",
        clmDate : "Datum",
    },
    grdPurcInv: 
    {
        clmLineNo : "Nr.",
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "..",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmTotalHt : "Gesamt ohne ..",
        clmDispatch : "Lieferschein Nr.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDiffPrice : "Unterschied",
        clmCustomerPrice : "Kundepreis",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmMulticode : "Lieferantencode",
        clmOrigin : "Herkunft",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Preis pro Untereinheit",
        clmSubFactor : "Faktor",
        clmPartiLot :"Chargennummer",
    },
    pg_partiLot :
    {
        title : "Chargenauswahl",
        clmPartiLot :"Chargennummer",
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
        chkFirstDiscount : "1. Rabatt in der Zeile aktualisieren",
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
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password : "Passwort",
        btnApprove : "Genehmigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Artikel hinzugefügt werden, solange die Dokumentenstammdaten nicht vollständig sind!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es können keine Zahlungen eingegeben werden, die den verbleibenden Betrag überschreiten!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag speichern?"
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
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie den Eintrag löschen?"
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
        msg: "Es kann kein Rabattbetrag eingegeben werden, der den Betrag übersteigt!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabattprozentsatz eingegeben werden, der den Betrag übersteigt!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument wurde gespeichert und gesperrt!"
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
        msg: "Dokument ist gesperrt! Sie müssen das Dokument mit dem Administratorpasswort entsperren, um Änderungen vorzunehmen!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Zahlungsdokument kann nicht gelöscht werden, da die Zahlung bereits erfolgt ist!"
    },
    msgDocLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Vorgang kann nicht ausgeführt werden, solange das Dokument gesperrt ist!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabatt darf nicht höher sein als der Betrag!"
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
        msg: "Ausgewählter Artikel ist dem Kunden nicht zugeordnet! Möchten Sie trotzdem fortfahren?"
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
        msg: "Sie verkaufen unterhalb des Einkaufspreises!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Verkauf unter dem Einkaufspreis ist nicht erlaubt!"
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
        msg: "Bitte wählen Sie ein Kunde aus!"
    },
    popCash : 
    {
        title: "Bargeldeingabe",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheckeinzug",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Überweisungseingang",
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
        msg: "Nicht gefundene Codes:"
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
        title : "Suchmethode",
        customerCode : "Nach Lieferantenkennung",
        ItemCode : "Nach Artikelkennung"
    },
    grdMultiItem : 
    {
        clmCode : "Artikelkennung",
        clmMulticode : "Lieferantenkennung",
        clmName : "Artikelname",
        clmQuantity : "Anzahl"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste leeren und alle hinzufügen",
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
        clmName : "Name",
        clmQuantity : "Anzahl"
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
    validRef :"Seriennummer darf nicht leer sein",
    validRefNo : "Reihenfolge darf nicht leer sein",
    validDepot : "Depot auswählen",
    validCustomerCode : "Kundenkennung darf nicht leer sein",
    validDocDate : "Datum auswählen",
    tagItemCodePlaceholder: "Geben Sie die gewünschten Codes ein",
    msgNewPrice : 
    {
        title: "Achtung",
        btn01: "Keine Aktualisierung",
        btn02: "Ausgewählte Preise aktualisieren",
        msg: "Bitte wählen Sie die Artikel aus, deren Lieferantenpreis aktualisiert werden soll. "
    },
    msgNewPriceDate : 
    {
        title: "Achtung",
        btn01: "Keine Aktualisierung",
        btn02: "Ausgewählte Preise aktualisieren",
        msg: "Bitte wählen Sie die Artikel aus, deren Datum aktualisiert werden soll. "
    },
    grdNewPrice: 
    {
        clmCode: "Kennung",
        clmName: "Name",
        clmPrice: "Alter Preis",
        clmPrice2: "Neuer Preis",
        clmSalePrice :"Verkaufspreis", 
        clmMargin : "Bruttomarge",
        clmCostPrice : "Einkaufspreis",
        clmNetMargin : "Nettomarge",
        clmMarge : "Marge"
    },
    grdNewPriceDate: 
    {
        clmCode: "Kennung",
        clmName: "Name",
        clmPrice: "Alter Preis",
        clmPrice2: "Neuer Preis",
        clmSalePrice :"Verkaufspreis", 
        clmMargin : "Bruttomarge",
        clmCostPrice : "Einkaufspreis",
        clmNetMargin : "Nettomarge",
        clmMarge : "Marge"
    },
    msgPriceDateUpdate :
    {
        msg : "Möchten Sie die Daten der unveränderten Preise aktualisieren?",
        btn01 : "Ja",
        btn02 : "Nein",
        title : "Achtung"
    },
    msgNewVat : 
    {
        title: "Achtung",
        btn01: "Keine Aktualisierung",
        btn02: "Ausgewählte Sätze aktualisieren",
        msg: "Die Rechnung weist unterschiedliche Mehrwertsteuersätze auf als das System. "
    },
    grdNewVat: 
    {
        clmCode: "Kennung",
        clmName: "Name",
        clmVat: "System ..",
        clmVat2: "Neue ..",
    },
    serviceAdd : "Dienstleistung hinzufügen",
    pg_service : 
    {
        title : "Dienstleistungen",
        clmCode : "Code",
        clmName : "Name"
    },
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "ARTIKELKENNUNG",
        clmName : "ARTIKELNAME",
        clmMulticode : "LIEFERANTENKENNUNG",
        clmBarcode : "Barcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
    },
    cmbPayType : {
        title : "Zahlungsmethode",
        cash : "Bargeld",
        check : "Scheck",
        bankTransfer : "Banküberweisung",
        otoTransfer : "Automatische Zahlung",
        foodTicket : "Essensgutschein",
        bill : "Wechsel",
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
    pg_offersGrid : 
    {
        title : "Bestellauswahl",
        clmReferans : "Seriennummer - Reihenfolge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmTotal : "Gesamtsumme",
        clmPrice : "Preis",
    },
    pg_proformaGrid : 
    {
        title : "Proforma-Auswahl",
        clmReferans : "Seriennummer - Reihenfolge",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Gesamtsumme"
    },
    popRound : 
    {
        title : "Bitte geben Sie den Betrag ein, den Sie runden möchten",
        total : "Summe",
    },
    msgCompulsoryCustomer:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Der ausgewälte Artikel ist dem Kunden nicht zugeordnet!"
    },
    msgWorngRound:
    {
        title: "Achtung",
        btn01: "Ok",
        msg1: "Der Unterschied zwischen den Beträgen, die Sie runden möchten, darf höchstens ",
        msg2: " betragen!"
    },
    msgDiscountEntry : 
    {
        title : "Eingabe des rabattierten Betrags",
        btn01 : "Bestätigen"
    },
    msgGrdOrigins:
    {
        title: "Herkunft ändern",  
        btn01: "Speichern",  
    },
    txtDiscount1 : "Rabatt 1",
    txtDiscount2 : "Rabatt 2",
    txtDiscount3 : "Rabatt 3",
    txtTotalDiscount :"Gesamtrabatt",
    msgDiscountPerEntry : 
    {
        title : "Eingabe des prozentualen Rabatts",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1: "1. Rabatt",
    txtDiscountPer2: "2. Rabatt",
    txtDiscountPer3: "3. Rabatt",
    pg_transportType : 
    {
        title : "Transportcodes",   // 
        clmCode : "CODE",   // 
        clmName : "NAME"   // 
    },
    msgCustomerLock: 
    {
        title: "Achtung", //
        btn01: "OK", //
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
    msgFourniseurNotFound: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lieferant nicht gefunden !"
    }
}
export default ftr_02_001
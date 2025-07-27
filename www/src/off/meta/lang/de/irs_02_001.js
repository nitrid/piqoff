// "Alış İrsaliyesi"
const irs_02_001 = 
{
    txtRefRefno: "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode: "Lieferantencode",
    txtCustomerName: "Lieferantenname",
    dtDocDate: "Datum",
    txtAmount: "Gesamt",
    txtDiscount: "Zeilenrabatt",
    txtDocDiscount: "Belegrabatt",
    txtSubTotal: "Zwischensumme",
    txtMargin: "Marge",
    txtVat: "MwSt.",
    txtTotal: "Gesamtsumme",
    dtShipDate: "Versanddatum",
    txtBarcode: "Strichcode",
    txtBarcodePlace: "Strichcode scannen...",
    txtQuantity: "Menge",
    getOrders: "Bestellung suchen",
    txtUnitFactor: "Einheitsfaktor",
    txtUnitQuantity: "Einheitsmenge",
    txtTotalQuantity: "Gesamtmenge",
    txtUnitPrice: "Stückpreis",
    txtTotalHt: "Gesamt ohne MwSt.",
    txtDocNo: "Belegnummer",
    validDesign: "Bitte Design auswählen",
    cmbOrigin: "Herkunft",
    btnView: "Anzeigen",
    btnMailsend: "E-Mail senden",
    validMail: "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor: "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave:
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
    popMailSend:
    {
        title: "E-Mail senden",
        txtMailSubject: "E-Mail-Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress: "Absender E-Mail-Adresse"
    },
    pg_Docs:
    {
        title: "Belege auswählen",
        clmDate: "Datum",
        clmRef: "Referenz",
        clmRefNo: "Nummer",
        clmOutputName: "Lieferantenname",
        clmOutputCode: "Kundencode",
        clmTotal: "Gesamt inkl. MwSt."
    },
    pg_txtCustomerCode:
    {
        title: "Lieferantenauswahl",
        clmCode: "Kundencode",
        clmTitle: "Lieferantenname",
        clmTypeName: "Typ",
        clmGenusName: "Art"
    },
    pg_txtItemsCode:
    {
        title: "Artikel auswählen",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
        clmMulticode: "LFR.Code",
        clmPrice: "Einkaufspreis"
    },
    grdPurcDispatch: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity: "Menge",
        clmDiscount: "Rabatt",
        clmDiscountRate: "Rabatt %",
        clmVat: "MwSt.",
        clmAmount: "Gesamt",
        clmTotal: "Gesamtsumme",
        clmTotalHt: "Gesamt ohne MwSt.",
        clmCreateDate: "Registrierungsdatum",
        clmMargin: "Marge",
        clmDescription: "Grund",
        clmCuser: "Benutzer",
        clmOrder: "Bestellung Nr",
        clmVatRate: "MwSt. %",
        clmMulticode: "LFR.Code",
        clmOrigin: "Herkunft",
        clmSubQuantity: "Einheitsmenge",
        clmSubPrice: "Stückpreis",
        clmSubFactor: "Faktor",
        clmDiffPrice: "Differenz",
        clmCustomerPrice: "LFR.Preis",
        clmInvoiceRef: "Rechnungsnummer",
        clmPartiLot: "Losnummer",
    },
    pg_partiLot: 
    {
        title: "Lot auswählen",
        clmLotCode: "Losnummer",
    },
    popDiscount: 
    {
        title: "Zeilenrabatt",
        chkFirstDiscount: "1. Rabatt in der Zeile nicht ändern",
        chkDocDiscount: "Belegrabatt",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabatt",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabatt",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabatt"
    },
    popDocDiscount: 
    {
        title: "Belegrabatt",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabatt",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabatt",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabatt"
    },
    popPassword: 
    {
        title: "Bitte Administrator-Passwort eingeben, um auf das Dokument zuzugreifen",
        Password: "Passwort",
        btnApprove: "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die Kopfzeilen vor dem Abschluss aus!"
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten?"
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
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
        msg: "Sind Sie sicher, dass Sie die MwSt. auf Null setzen möchten?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt gewähren, der höher als der Gesamtbetrag ist!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt gewähren, der höher als der Gesamtbetrag ist!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolgreich",
        btn01: "OK",
        msg: "Dokument entsperrt!"
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Falsches Passwort"
    },
    msgLockedType2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "In Rechnung umgewandeltes Dokument kann nicht entsperrt werden"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gesperrt! \n Bitte entsperren Sie es, um Änderungen zu speichern!"
    },
    msgDoclocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können nicht speichern, ohne zu entsperren!"
    },
    msgDiscount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Rabatt kann nicht höher als der Gesamtbetrag sein!"
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
        msg: "Der ausgewählte Artikel hat keinen registrierten Lieferanten! Möchten Sie fortfahren?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Unbekannter Lieferant"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Artikel ist bereits im Dokument vorhanden! Möchten Sie kombinieren?"
    },
    popDesign: 
    {
        title: "Design-Auswahl",
        design: "Design",
        lang: "Dokumentsprache"
    },
    msgMissItemCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Code nicht gefunden"
    },
    msgMultiCodeCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der hinzugefügten Artikel"
    },
    popMultiItem:
    {
        title: "Massenartikel hinzufügen",
        btnApprove: "Artikel suchen",
        btnClear: "Leeren",
        btnSave: "Zeilen hinzufügen",
    },
    cmbMultiItemType: 
    {
        title: "Suchmodus",
        customerCode: "Nach Lieferantencode",
        ItemCode: "Nach Artikelcode"
    },
    grdMultiItem: 
    {
        clmCode: "Artikelcode",
        clmMulticode: "LFR.Code",
        clmName: "Artikelname",
        clmQuantity: "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste löschen und alles hinzufügen",
        btn02: "Neue Eingaben zur Liste hinzufügen",
        msg: "Artikel in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
        btnFactorSave: "Artikelkarte aktualisieren"
    },
    msgGrdOrigins:
    {
        title: "Herkunft ändern",
        btn01: "Speichern",
    },
    validRef: "Referenz eingeben",
    validRefNo: "Referenz Nr eingeben",
    validDepot: "Lager auswählen",
    validCustomerCode: "Lieferanten-Kundencode darf nicht leer sein",
    validDocDate: "Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    pg_txtBarcode: 
    {
        title: "Strichcode auswählen",
        clmCode: "Artikelcode",
        clmName: "Artikelname",
        clmMulticode: "Lieferantenreferenz",
        clmBarcode: "Strichcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge hinzufügen"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte Kunde auswählen!"
    },
    msgRowNotUpdate:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt, Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in eine Rechnung umgewandelt, Sie können sie nicht löschen!"
    },
    msgdocNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Eine Zeile Ihres Dokuments wurde in eine Rechnung umgewandelt. Dieses Dokument kann nicht gelöscht werden!"
    },
    pg_adress: 
    {
        title: "Adressenauswahl",
        clmAdress: "Adresse",
        clmCiyt: "Stadt",
        clmZipcode: "Postleitzahl",
        clmCountry: "Land",
    },
    msgCode: 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden!"
    },
    msgDiscountEntry: 
    {
        title: "Rabattbetrag eingeben",
        btn01: "Bestätigen"
    },
    txtDiscount1: "1. Rabatt",
    txtDiscount2: "2. Rabatt",
    txtDiscount3: "3. Rabatt",
    txtTotalDiscount: "Gesamtrabatt",
    msgDiscountPerEntry: 
    {
        title: "Rabatt in % eingeben",
        btn01: "Bestätigen"
    },
    txtDiscountPer1: "1. Rabatt %",
    txtDiscountPer2: "2. Rabatt %",
    txtDiscountPer3: "3. Rabatt %",
    msgNewPrice:
    {
        title: "Achtung",
        btn01: "Nicht aktualisieren",
        btn02: "Ausgewählte Preise aktualisieren",
        msg: "Bitte wählen Sie aus und aktualisieren Sie die Lieferantenpreise..."
    },
    msgNewPriceDate: 
    {
        title: "Achtung",
        btn01: "Nicht aktualisieren",
        btn02: "Ausgewählte Artikel aktualisieren",
        msg: "Bitte wählen Sie die Artikel aus, bei denen Sie das Datum aktualisieren möchten."
    },
    grdNewPrice:
    {
        clmCode: "Code",
        clmName: "Name",
        clmPrice: "Alter Preis",
        clmPrice2: "Neuer Preis",
        clmSalePrice: "Verkaufspreis",
        clmMargin: "Bruttomarge",
        clmCostPrice: "Kosten",
        clmNetMargin: "Nettomarge",
        clmMarge: "Marge"
    },
    grdNewPriceDate:
    {
        clmCode: "Code",
        clmName: "Name",
        clmPrice: "Alter Preis",
        clmPrice2: "Neuer Preis",
        clmSalePrice: "Verkaufspreis",
        clmMargin: "Bruttomarge",
        clmCostPrice: "Kosten",
        clmNetMargin: "Nettomarge",
        clmMarge: "Marge"
    },
    msgPriceDateUpdate:
    {
        msg: "Möchten Sie das Datum der Artikel aktualisieren, bei denen der Einkaufspreis unverändert bleibt?",
        btn01: "Ja",
        btn02: "Nein",
        title: "Achtung"
    },
    msgCustomerLock: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lieferant kann nach Hinzufügen von Artikeln nicht geändert werden!"
    },
}
export default irs_02_001
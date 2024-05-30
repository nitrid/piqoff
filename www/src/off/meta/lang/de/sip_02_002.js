// "Satış Sipariş"
const sip_02_002 =
{
    txtRefRefno : "Seriennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Dokumentrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode scannen",
    txtQuantity : "Menge",
    getOffers : "Angebot Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    placeMailen: "Text",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    txtTotalHt : "Rabattierter Gesamtbetrag",
    txtDocNo : "Dokumentnummer",
    cmbPricingList : "Preisliste",
    pg_Docs : 
      {
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "NUMMER",
        clmInputName : "KUNDENNAME",
        clmInputCode  : "KUNDENNUMMER",
        clmAddress : "ADRESSE"
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
        clmPrice : "VERKAUFSPREIS"
    },
    grdSlsOrder: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "MwSt.",
        clmAmount : "Betrag",
        clmTotal : "Gesamt",
        clmTotalHt : "Gesamt ohne. ..",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmOffer : "Angebot",
        clmBarcode : "Barcode",
        clmVatRate : "MwSt. %",
        clmSubQuantity : "Untereinheit",
        clmSubPrice : "Untereinheitspreis",
        clmSubFactor : "Faktor",
    },
    popDiscount : 
    {
        title: "Rabatt pro Zeile",
        chkFirstDiscount : "Aktualisieren des ersten Rabatts in der Zeile",
        chkDocDiscount : "Als Dokumentenrabatt anwenden",
        Percent1 : "1. Rabattprozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabattprozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabattprozent",
        Price3 : "3. Rabattbetrag"
    },
    popDocDiscount : 
    {
        title: "Dokumentenrabatt",
        Percent1 : "1. Rabattprozent",
        Price1 : "1. Rabattbetrag",
        Percent2 : "2. Rabattprozent",
        Price2 : "2. Rabattbetrag",
        Percent3 : "3. Rabattprozent",
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
        msg: "Es können keine Bestände erfasst werden, solange die Dokumentkopfdaten nicht vollständig sind!"
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
        msg: "Möchten Sie die Mehrwertsteuer auf null setzen?"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt größer als der Betrag gewährt werden!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Es kann kein Rabatt größer als der Betrag gewährt werden!"
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
    msgLockedType2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Ein Dokument, das in eine Rechnung umgewandelt wurde, kann nicht entsperrt werden."
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Sie müssen das Administratorpasswort eingeben, um Änderungen zu speichern!"
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
        msg: "Der Rabatt kann den Betrag nicht übersteigen!"
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
        msg: "Der Verkaufspreis kann nicht niedriger als der Einkaufspreis sein!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument enthalten! Sollen die Zeilen zusammengeführt werden?"
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
        btn01: "Liste leeren und alle hinzufügen",
        btn02: "Neu geschriebene zur Liste hinzufügen",
        msg: "Es sind Artikel in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Auswahl der Einheit",
        btn01: "Bestätigen",
    },
    validRef: "Serienfeld darf nicht leer sein",
    validRefNo: "Feld für die Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Depot auswählen",
    validCustomerCode: "Kundencode darf nicht leer sein",
    validDocDate: "Bitte ein Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die Codes ein, die Sie hinzufügen möchten",
    msgQuantity: 
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge eingeben"
    },
    pg_txtBarcode: 
    {
        title: "Barcode-Auswahl",
        clmCode: "Artikelnummer",
        clmName: "Artikelname",
        clmMulticode: "Lieferantencode",
        clmBarcode: "Barcode"
    },
    pg_offersGrid: 
    {
        title: "Angebotsauswahl",
        clmReferans: "Serie - Reihenfolge",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmTotal: "Gesamt",
        clmPrice: "Preis"
    },
    msgCustomerSelect: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie einen Kunden aus!"
    },
    msgRowNotUpdate: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt und kann nicht geändert werden!"
    },
    msgRowNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt und kann nicht gelöscht werden!"
    },
    msgdocNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "In Ihrem Dokument sind Zeilen vorhanden, die in einen Lieferschein oder eine Rechnung umgewandelt wurden. Dieses Dokument kann nicht gelöscht werden!"
    },
    pg_adress: 
    {
        title: "Adressauswahl",
        clmAdress: "ADRESSE",
        clmCiyt: "STADT",
        clmZipcode: "POSTLEITZAHL",
        clmCountry: "LAND"
    },
    msgCode: 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    popMailSend: 
    {
        title: "E-Mail senden",
        txtMailSubject: "E-Mail-Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress : "Gesendete Mailadresse" 
    },
    msgMailSendResult: 
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail wurde erfolgreich gesendet!",
        msgFailed: "Fehler beim Senden der E-Mail!"
    },
    txtDiscount1: "Rabatt 1",
    txtDiscount2: "Rabatt 2",
    txtDiscount3: "Rabatt 3",
    txtTotalDiscount: "Gesamtrabatt",
    msgDiscountPerEntry: 
    {
        title: "Prozentuale Rabatteingabe",
        btn01: "Bestätigen"
    },
    txtDiscountPer1: "Rabatt 1 in Prozent",
    txtDiscountPer2: "Rabatt 2 in Prozent",
    txtDiscountPer3: "Rabatt 3 in Prozent",
    popDetail: 
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge (2. Einheit)",
        margin: "Marge"
    },
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden" 
    },
}
export default sip_02_002
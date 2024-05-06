// "Alış Sipariş"
const sip_02_001 =
{
    txtRefRefno : "Seriennummer-Reihennummer",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundennummer",
    txtCustomerName : "Kundenname",
    dtDocDate : "Datum",
    txtAmount : "Betrag",
    txtDiscount : "Positionsrabatt",
    txtDocDiscount : "Dokumentenrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    txtBarcode : "Barcode hinzufügen",
    txtBarcodePlace: "Barcode einscannen",
    txtQuantity : "Menge",
    getOffers : "Angebote Suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice: "Einheitspreis",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validDesign : "Bitte wählen Sie ein Design aus.",
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
        title : "Dokumentauswahl",
        clmDate : "DATUM",
        clmRef : "Serie",
        clmRefNo : "REIHE",
        clmOutputName : "KUNDENNAME",
        clmOutputCode  : "KUNDENCODE",
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "KUNDENCODE",
        clmTitle : "KUNDENNAME",
        clmTypeName : "TYP",
        clmGenusName : "ART"
    },
    pg_txtItemsCode : 
    {
        title : "Bestandauswahl",
        clmCode :  "Artikelcode",
        clmName : "Artikelname",
        clmMulticode : "LIEFERANTENCODE",
        clmPrice : "EINKAUFSPREIS"
    },
    pg_txtBarcode : 
    {
        title : "Barcodeauswahl",
        clmCode :  "Artikelcode",
        clmName : "Artikelname",
        clmMulticode : "LIEFERANTENCODE",
        clmBarcode : "Barcode"
    },
    grdPurcOrders: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity: "Menge",
        clmDiscount: "Rabatt",
        clmDiscountRate: "Rabatt %",
        clmVat: "MwSt.",
        clmAmount: "Betrag",
        clmTotal: "Gesamtsumme",
        clmTotalHt: "Gesamtsumme (netto)",
        clmCreateDate: "Erstellungsdatum",
        clmMargin: "Marge",
        clmMulticode: "LCode",
        clmBarcode: "Barcode",
        clmDescription: "Beschreibung",
        clmCuser: "Benutzer",
        clmOffer: "Angebot Nr.",
        clmVatRate: "MwSt. %",
        clmSubQuantity: "Untereinheit",
        clmSubPrice: "Untereinheitspreis",
        clmSubFactor: "Faktor",
      },
      popDiscount: 
      {
        title: "Zeilenrabatt",
        chkFirstDiscount: "1. Rabatt in der Zeile aktualisieren",
        chkDocDiscount: "Als Dokumentrabatt anwenden",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag"
      },
      popDocDiscount: 
      {
        title: "Dokumentrabatt",
        Percent1: "1. Rabatt %",
        Price1: "1. Rabattbetrag",
        Percent2: "2. Rabatt %",
        Price2: "2. Rabattbetrag",
        Percent3: "3. Rabatt %",
        Price3: "3. Rabattbetrag"
      },
      popPassword: 
      {
        title: "Geben Sie das Administratorpasswort ein, um das Dokument zu öffnen",
        Password: "Passwort",
        btnApprove: "Bestätigen"
      },
      popDesign: 
      {
        title: "Designauswahl",
        design: "Design",
        lang: "Dokumentsprache"
      },
      msgDocValid: 
      {
        title: "Achtung",
        btn01: "OK",
        msg: "Die oberen Dokumentinformationen müssen ausgefüllt werden, bevor Artikel hinzugefügt werden können!"
      },
      msgSpeichern: 
      {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Möchten Sie die Änderungen speichern?"
      },
      msgSpeichernResult: 
      {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Ihre Änderungen wurden erfolgreich gespeichert!",
        msgFailed: "Fehler beim Speichern der Änderungen!"
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
        msg: "Möchten Sie diesen Eintrag wirklich löschen?"
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
        msg: "Der Rabattbetrag darf nicht höher als der Betrag sein!"
      },
      msgDiscountPercent: 
      {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattprozentsatz darf nicht höher als der Betrag sein!"
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
        msg: "Das Dokument wurde entsperrt!"
      },
      msgPasswordWrong: 
      {
        title: "Fehler",
        btn01: "OK",
        msg: "Das eingegebene Passwort ist falsch!"
      },
      msgLockedType2: 
      {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument wurde in eine Rechnung umgewandelt und kann nicht entsperrt werden"
      },
      msgGetLocked: 
      {
        title: "Achtung",
        btn01: "OK",
        msg: "Das Dokument ist gesperrt! Um Änderungen zu speichern, müssen Sie das Administratorpasswort verwenden, um es zu entsperren!"
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
        msg: "Der Rabattbetrag darf nicht höher als der Betrag sein!"
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
        msg: "Der ausgewählte Artikel ist nicht dem Kunden zugeordnet! Möchten Sie trotzdem fortfahren?"
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
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
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
        title: "Massenhinzufügen von Artikeln",
        btnApprove: "Artikel Suchen",
        btnClear: "Löschen",
        btnSpeichern: "Zeilen hinzufügen",
      },
      cmbMultiItemType: 
      {
        title: "Suchmethode",
        customerCode: "Nach Lieferantennummer",
        ItemCode: "Nach Artikelnummer"
      },
      grdMultiItem: 
      {
        clmCode: "Artikelnummer",
        clmMulticode: "Lieferantennummer",
        clmName: "Artikelname",
        clmQuantity: "Menge"
      },
      msgMultiData: 
      {
        title: "Achtung",
        btn01: "Liste löschen und alle hinzufügen",
        btn02: "Neu hinzugefügte zur Liste",
        msg: "Es sind Artikel in der Liste vorhanden!"
      },
      msgUnit: 
      {
        title: "Auswahleinheit",
        btn01: "Bestätigen",
      },
      validRef: "Serie darf nicht leer sein",
      validRefNo: "Folge darf nicht leer sein",
      validDepot: "Sie müssen ein Lager auswählen",
      validCustomerCode: "Kundencode darf nicht leer sein",
      validDocDate: "Sie müssen ein Datum auswählen",
      tagItemCodePlaceholder: "Bitte geben Sie die gewünschten Codes ein",
      popUnderPrice: 
      {
        title: "Es gibt einen günstigeren Lieferanten für dieses Artikel"
      },
      grdUnderPrice: 
      {
        clmItemName: "Artikel",
        clmCustomerName: "Kundenname",
        clmPrice: "Preis",
        clmCode: "Code",
        clmMulticode: "Lieferantencode"
      },
      msgQuantity: 
      {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Bitte geben Sie die Menge ein"
      },
      pg_offersGrid: 
      {
        title: "Angebotsauswahl",
        clmReferans: "Serie - Folge",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmTotal: "Gesamtsumme",
        clmPrice: "Preis",
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
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt. Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete : 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "In Ihrem Dokument wurden Zeilen in einen Lieferschein oder eine Rechnung umgewandelt. Dieses Dokument kann nicht gelöscht werden!"
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
    txtDiscount1 : "Rabatt 1",
    txtDiscount2 : "Rabatt 2",
    txtDiscount3 : "Rabatt 3",
    txtTotalDiscount :"Gesamtrabatt",
    msgDiscountPerEntry : 
    {
        title : "Prozentualer Rabatteingabe",
        btn01 : "Bestätigen"
    },
    txtDiscountPer1 : "Rabatt % 1",
    txtDiscountPer2 : "Rabatt % 2",
    txtDiscountPer3 : "Rabatt % 3",
    txtTotalHt : "Rabattierter Gesamtbetrag",
    msgCustomerLock: 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Nach Hinzufügen von Artikel kann Kunde nicht geändert werden"
    },
}
export default sip_02_001
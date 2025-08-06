// "Einkaufsbestellung"
const sip_02_001 =
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Lieferantencode",
    txtCustomerName : "Lieferantenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt",
    txtDiscount : "Zeilenrabatt",
    txtDocDiscount : "Belegrabatt",
    txtSubTotal : "Zwischensumme",
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Lieferdatum",
    txtBarcode: "Barcode",
    txtBarcodePlace: "Barcode scannen...",
    txtQuantity : "Menge",
    getOffers : "Angebot suchen",
    txtUnitFactor : "Einheitsfaktor",
    txtUnitQuantity : "Einheitsmenge",
    txtTotalQuantity : "Gesamtmenge",
    txtUnitPrice : "Einheitspreis",
    txtTotalHt : "Gesamt ohne MwSt.",
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
    msgDuplicateItems : 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Achtung! Das Dokument enthält Zeilen mit dem gleichen Produktcode:\n"
    },
    popMailSend :
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail Betreff",
        txtSendMail : "E-Mail-Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Absender E-Mail-Adresse"
    },
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Nummer",
        clmOutputName : "Lieferantenname",
        clmOutputCode  : "Kundencode",
        clmTotal : "Gesamt inkl. MwSt."
    },
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    pg_txtItemsCode : 
    {
        title : "Produktauswahl",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz",
        clmPrice : "Einkaufspreis"
    },
    pg_txtBarcode : 
    {
        title : "Barcode-Auswahl",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Barcode"
    },
    grdPurcOrders: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "MwSt.",
        clmAmount : "Gesamt",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamt ohne MwSt.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmMulticode :"LFR. Code",
        clmBarcode :"Barcode",
        clmDescription :"Beschreibung",
        clmCuser :"Benutzer",
        clmOffer : "Angebot Nr",
        clmVatRate : "MwSt. %",
        clmSubQuantity : "Einheitsmenge",
        clmSubPrice : "Einheitspreis",
        clmSubFactor : "Faktor",
    },
    popDiscount : 
    {
       title: "Zeilenrabatt",
        chkFirstDiscount : "Rabatte der ersten Zeile nicht ändern",
        chkDocDiscount : "Belegrabatt",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabatt",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabatt",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabatt"
    },
    popDocDiscount : 
    {
       title: "Belegrabatt",
        Percent1 : "1. Rabatt %",
        Price1 : "1. Rabatt",
        Percent2 : "2. Rabatt %",
        Price2 : "2. Rabatt",
        Percent3 : "3. Rabatt %",
        Price3 : "3. Rabatt"
    },
    popPassword : 
    {
        title: "Bitte geben Sie das Administrator-Passwort ein, um auf das Dokument zuzugreifen",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    popDesign : 
    {
        title: "Designauswahl",
        design : "Design",
        lang : "Dokumentsprache"
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
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgVatDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die MwSt. auf Null setzen möchten!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattbetrag darf nicht höher als der Gesamtbetrag sein!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Rabattprozentsatz darf nicht höher als der Gesamtbetrag sein!"
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
        title: "Fehler",
        btn01: "OK",
        msg: "Falsches Passwort!"
    },
    msgLockedType2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument in Rechnung umgewandelt, kann nicht entsperrt werden"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument ist gesperrt! Bitte entsperren Sie es, um Änderungen zu speichern!"
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
        msg: "Der Rabattbetrag darf nicht höher als der Gesamtbetrag sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Produkt nicht gefunden!"
    },
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Weiter",
        btn02: "Abbrechen",
        msg: "Das ausgewählte Produkt ist nicht dem Lieferanten zugeordnet! Möchten Sie trotzdem fortfahren?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lieferant nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Kombinieren",
        btn02: "Neu hinzufügen",
        msg: "Das Produkt, das Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
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
        msg: "Anzahl der hinzugefügten Produkte"
    },
    popMultiItem:
    {
        title: "Massenhinzufügung von Produkten",
        btnApprove: "Produkte suchen",
        btnClear : "Löschen",
        btnSave : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmethode",
        customerCode : "Nach Lieferantencode",
        ItemCode : "Nach Produktcode"
    },
    grdMultiItem : 
    {
        clmCode : "Produktreferenz",
        clmMulticode : "LFR. Code",
        clmName : "Produktname",
        clmQuantity : "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste leeren und alle hinzufügen",
        btn02: "Neue Einträge zur Liste hinzufügen",
        msg: "Produkte sind bereits in der Liste vorhanden!"
    },
    msgUnit:
    {
        title: "Einheitsauswahl",
        btn01: "Bestätigen",
    },
    validRef :"Referenz eingeben",
    validRefNo : "Referenz Nr eingeben",
    validDepot : "Lager auswählen",
    validCustomerCode : "Der Lieferantencode darf nicht leer sein",
    validDocDate : "Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    popUnderPrice :
    {
        title : "Günstigerer Lieferant für dieses Produkt verfügbar"
    },
    grdUnderPrice : 
    {
        clmItemName :"Produkt",
        clmCustomerName : "Kundenname",
        clmPrice : "Preis",
        clmCode : "Code",
        clmMulticode : "LFR. Code"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge eingeben"
    },
    pg_offersGrid: 
    {
        title: "Angebotsauswahl",
        clmReferans: "Ref.-Ref. Nr",
        clmCode: "Code",
        clmName: "Name",
        clmQuantity: "Menge",
        clmTotal: "Gesamt",
        clmPrice: "Preis",
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie einen Lieferanten aus!"
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
        title : "Prozentuale Rabatteingabe",
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
        msg: "Nach Hinzufügen von Produkten kann Lieferant nicht geändert werden"
    },
}
export default sip_02_001
// "POS Verkaufsbestellung"
const sip_02_003 = 
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Kundencode",
    txtCustomerName : "Kundenname",
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
    btnView : "Vorschau",
    btnMailsend : "E-Mail senden",
    placeMailHtmlEditor : "Bitte geben Sie Ihren Text ein.",
    validDesign : "Bitte wählen Sie ein Design aus.",
    validMail : "Bitte lassen Sie das Feld nicht leer.",
    txtTotalHt : "Gesamt ohne MwSt.",
    txtDocNo : "Dokumentnummer",
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
        clmInputName : "Kundenname",
        clmInputCode  : "Kundencode",
        clmAddress : "Adresse"
    },
    pg_txtCustomerCode : 
    {
        title : "Kundenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Kundenname",
        clmTypeName : "Typ",
        clmGenusName : "Art"
    },
    pg_txtItemsCode : 
    {
        title : "Produktauswahl",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmPrice : "Verkaufspreis",
        clmBarcode : "Barcode",
    },
    grdSlsOrder: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis ohne MwSt.",
        clmQuantity : "Menge",
        clmDiscount : "Rabatt",
        clmDiscountRate : "Rabatt %",
        clmVat : "MwSt.",
        clmAmount : "Gesamt",
        clmTotal : "Gesamtsumme",
        clmTotalHt : "Gesamt ohne MwSt.",
        clmCreateDate: "Erstellungsdatum",
        clmMargin :"Marge",
        clmDescription : "Beschreibung",
        clmCuser :"Benutzer",
        clmOffer : "Angebot",
        clmBarcode : "Barcode",
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
        msg: "Sie können keinen Rabatt größer als den Gesamtbetrag gewähren!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt größer als den Gesamtbetrag gewähren!"
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
        msg: "Dokument entsperrt!",
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
        msg: "Dokument ist gesperrt! Sie müssen das Administrator-Passwort eingeben, um Änderungen zu speichern!"
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
        msg: "Rabatt kann den Gesamtbetrag nicht übersteigen!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Produkt nicht gefunden!"
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
        msg: "Produkt bereits im Dokument vorhanden! Sollen die Zeilen kombiniert werden?"
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
        msg: "Code nicht gefunden"
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
    validCustomerCode : "Der Kundencode darf nicht leer sein",
    validDocDate : "Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge eingeben"
    },
    pg_txtBarcode: 
    {
        title: "Barcode-Auswahl",
        clmCode: "Produktreferenz",
        clmName: "Produktname",
        clmMulticode: "Lieferantenreferenz",
        clmBarcode: "Barcode"
    },
    pg_offersGrid: 
    {
        title: "Angebotsauswahl",
        clmReferans: "Ref.-Ref. Nr",
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
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt. Sie können keine Änderungen vornehmen!"
    },
    msgRowNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Diese Zeile wurde in einen Lieferschein oder eine Rechnung umgewandelt. Sie können sie nicht löschen!"
    },
    msgdocNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "In Ihrem Dokument wurden Zeilen in einen Lieferschein oder eine Rechnung umgewandelt. Dieses Dokument kann nicht gelöscht werden!"
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
        txtMailSubject: "E-Mail Betreff",
        txtSendMail: "E-Mail-Adresse",
        btnSend: "Senden",
        cmbMailAddress : "Absender E-Mail-Adresse"
    },
    msgMailSendResult: 
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
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
    txtDiscountPer1: "Rabatt % 1",
    txtDiscountPer2: "Rabatt % 2",
    txtDiscountPer3: "Rabatt % 3",
    popDetail: 
    {
        title: "Dokumentinhalt",
        count: "Gesamtzeilen",
        quantity: "Gesamtmenge",
        quantity2: "Gesamtmenge (2. Einheit)",
        margin: "Marge"
    },
}
export default sip_02_003
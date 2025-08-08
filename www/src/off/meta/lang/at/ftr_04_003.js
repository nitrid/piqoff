// "Proforma Alış Faturası"
const ftr_04_003 =
{
    txtRefRefno : "Ref. Ref Nr",
    cmbDepot: "Lager",
    txtCustomerCode : "Lieferantencode",
    txtCustomerName : "Lieferantenname",
    dtDocDate : "Datum",
    txtAmount : "Gesamt" ,
    txtDiscount : "Zeilenrabatt",   
    txtDocDiscount : "Belegrabatt",   
    txtSubTotal : "Zwischensumme",   
    txtMargin : "Marge",
    txtVat : "MwSt.",
    txtTotal : "Gesamtsumme",
    dtShipDate :"Versanddatum",
    getDispatch : "Lieferschein suchen",
    getPayment : "Zahlung",
    cash : "Gesamt" ,
    description :"Grund",
    checkReference : "Referenz",
    btnCash : "Bargeld",
    btnCheck : "Scheck",
    btnBank : "Überweisung",
    cmbCashSafe : "Bargeldkasse",
    cmbCheckSafe : "Scheckkasse",
    cmbBank : "Bankauswahl",
    txtPayInvoıceTotal : "Rechnungssumme",
    txtPayTotal : "Zahlungssumme",
    txtRemainder : "Rest",
    txtBarcode: "Strichcode",
    txtBarcodePlace: "Strichcode scannen...",
    txtQuantity : "Menge", 
    getOrders : "Bestellung suchen", 
    popExcel : {title:"Die Spaltenüberschriften Ihrer Excel-Datei müssen korrekt sein"}, 
    excelAdd : "Eintrag aus Excel",
    shemaSave : "Format speichern", 
    tabTitleSubtotal : "Rechnungssumme", 
    tabTitlePayments : "Zahlungsinformationen", 
    txtDiffrentTotal : "Gesamtdifferenz", 
    tabTitleOldInvoices : "Informationen zu früheren Rechnungen", 
    txtDiffrentNegative : "Differenz für Preissenkungen", 
    txtDiffrentPositive : "Differenz für Preiserhöhungen", 
    txtDiffrentInv : "Preisdifferenzrechnung",   
    txtbalance : "Aktueller Gesamtsaldo",   
    getRemainder : "Restbetrag suchen",    
    txtUnitFactor : "Einheitsfaktor",  
    txtUnitQuantity : "Einheitsmenge",  
    txtTotalQuantity : "Gesamtmenge",  
    txtUnitPrice : "Stückpreis", 
    txtExpFee : "Verzugsstrafe", 
    dtExpDate : "Fälligkeitsdatum", 
    getOffers : "Angebot suchen", 
    txtTotalHt : "Gesamt ohne MwSt.",
    txtDocNo : "Belegnummer",
    validDesign : "Bitte wählen Sie ein Design.",
    btnView : "Anzeigen",
    btnMailsend : "E-Mail senden",
    validMail : "Bitte lassen Sie dieses Feld nicht leer.",
    placeMailHtmlEditor : "Sie können eine Beschreibung für Ihre E-Mail eingeben.",
    isMsgSave :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Aktion kann ohne Speichern des Dokuments nicht durchgeführt werden!"
    },
    msgMailSendResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "E-Mail erfolgreich gesendet!",
        msgFailed: "E-Mail senden fehlgeschlagen!"
    },
    popMailSend :
    {
        title :"E-Mail senden",
        txtMailSubject : "E-Mail Betreff",
        txtSendMail : "E-Mail Adresse",
        btnSend : "Senden",
        cmbMailAddress : "Absender E-Mail Adresse"
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
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
        title : "Artikel auswählen",
        clmCode :  "Artikelreferenz",
        clmName : "Artikelname",
        clmMulticode : "LFR.Code",
        clmPrice : "Einkaufspreis" 
    },
    pg_dispatchGrid : 
    {
        title : "Lieferschein auswählen" ,
        clmReferans : "Referenzen",
        clmCode : "Code",
        clmName : "Name",
        clmQuantity : "Menge",
        clmPrice : "Preis",
        clmTotal : "Gesamt" ,
        clmDate : "Datum",
    },
    grdPurcInv: 
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
        clmDispatch : "Lieferschein Nr.",
        clmCreateDate: "Registrierungsdatum",
        clmMargin :"Marge",
        clmDiffPrice : "Differenz",
        clmCustomerPrice : "LFR.Preis",
        clmDescription :"Grund",
        clmCuser :"Benutzer",
        clmPartiLot :"Losnummer",
    },
    pg_partiLot :
    {
        title : "Losauswahl",
        clmPartiLot :"Losnummer",
    },
    grdInvoicePayment: 
    {
        clmInputName: "Kasse",
        clmTypeName: "Typ",
        clmPrice: "Preis",
        clmCreateDate: "Registrierungsdatum",

    },
    popPayment:
    {
        title: "Zahlung",
    },
    popDiscount : 
    {
       title: "Zeilenrabatt", 
        chkFirstDiscount : "Rabatte der 1. Zeile nicht ändern",
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
        title: "Bitte Administrator-Passwort für Dokumentzugriff eingeben",
        Password : "Passwort",
        btnApprove : "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie die Kopfzeile vor dem Abschluss ein!"
    },
    msgMoreAmount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Betrag höher als die verbleibende Zahlung eingeben!"
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
        msg: "Bitte füllen Sie die betreffenden Bereiche aus!"
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
        msg: "Sind Sie sicher, dass Sie die MwSt. auf Null setzen möchten!"
    },
    msgDiscountPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt höher als den Gesamtbetrag gewähren!"
    },
    msgDiscountPercent:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen Rabatt höher als den Gesamtbetrag gewähren!"
    },
    msgLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gespeichert und gesperrt!"
    },
    msgPasswordSucces:
    {
        title: "Erfolg",
        btn01: "OK",
        msg: "Dokument entsperrt!",
    },
    msgPasswordWrong:
    {
        title: "Fehler",
        btn01: "OK",
        msg: "Falsches Passwort"
    },
    msgGetLocked:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument gesperrt! \n Bitte entsperren Sie es, um Änderungen zu speichern!"
    },
    msgPayNotDeleted:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dokument kann nicht gelöscht werden, da Zahlung erfasst!" 
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
        msg: "Rabatt kann nicht höher als die Summe sein!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!!"
    },
    msgCustomerNotFound:
    {
        title: "Achtung",
        btn01: "Fortfahren",
        btn02: "Abbrechen",
        msg: "Der ausgewählte Artikel hat keinen registrierten Lieferanten! Möchten Sie fortfahren?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Unbekannter Lieferant"
    },
    msgUnderPrice1:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Preis unter Einkaufspreis!!"
    },
    msgUnderPrice2:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können nicht unter dem Einkaufspreis verkaufen!!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenfassen",
        btn02: "Neu hinzufügen",
        msg: "Artikel bereits im Dokument vorhanden! Möchten Sie kombinieren?"
    },
    msgCustomerSelect:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen Kunden ein!"
    },
    popCash : 
    {
        title: "Bargeld-Eintrag",
        btnApprove : "Hinzufügen"
    },
    popCheck : 
    {
        title: "Scheck-Eintrag",
        btnApprove : "Hinzufügen"
    },
    popBank : 
    {
        title: "Überweisungseintrag",
        btnApprove : "Hinzufügen"
    },
    popDesign : 
    {
        title: "Design-Auswahl",
        design : "Design" ,
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
        msg: "Anzahl hinzugefügter Artikel"
    },
    popMultiItem:
    {
        title: "Sammel-Artikelzufügung",
        btnApprove: "Artikel suchen",
        btnClear : "Liste leeren",
        btnSave : "Zeilen hinzufügen",
    },
    cmbMultiItemType : 
    {
        title : "Suchmodus",
        customerCode : "Nach Lieferantencode",
        ItemCode : "Nach Artikelcode"
    },
    grdMultiItem : 
    {
        clmCode : "Artikelreferenz",
        clmMulticode : "LFR.Code",
        clmName : "Artikelname",
        clmQuantity : "Menge"
    },
    msgMultiData:
    {
        title: "Achtung",
        btn01: "Liste leeren und alles hinzufügen",
        btn02: "Neue Eingaben zur Liste hinzufügen",
        msg: "Artikel bereits in der Liste vorhanden!"
    },
    popDetail:
    {
        title: "Dokumentinhalt",
        count:  "Zeilenanzahl",
        quantity: "Gesamtmenge",
        quantity2: "Gesamt 2. Einheit",
        margin: "Marge"
    },
    grdUnit2 : 
    {
        clmName : "Name",
        clmQuantity : "Menge"
    },
    popUnit2 : 
    {
        title : "Inhaltsdetails"
    },
    msgUnit:
    {
        title: "Einheitsauswahl",  
        btn01: "Bestätigen",
        btnFactorSave : "Lagerkarte aktualisieren" 
    },
    validRef :"Referenz eingeben",
    validRefNo : "Ref Nr eingeben",
    validDepot : "Lager auswählen",
    validCustomerCode : "Lieferanten-Kundencode kann nicht leer sein",
    validDocDate : "Datum auswählen",
    tagItemCodePlaceholder: "Bitte geben Sie die hinzuzufügenden Codes ein",
    msgNewPrice :      
    {     
        title: "Achtung",     
        btn01: "Nicht aktualisieren",     
        btn02: "Ausgewählten Preis aktualisieren",     
        msg: "Bitte wählen Sie die Lieferantenpreise aus und aktualisieren Sie sie..."     
    },     
    msgNewPriceDate : 
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
        clmSalePrice :"Verkaufspreis",  
        clmMargin : "Bruttomarge",
        clmCostPrice : "Kosten", 
        clmNetMargin : "Nettomarge",
    },
    grdNewPriceDate:      
    {     
        clmCode: "Code",     
        clmName: "Name",     
        clmPrice: "Alter Preis",     
        clmPrice2: "Neuer Preis",   
        clmSalePrice :"Verkaufspreis",  
        clmMargin : "Bruttomarge",
        clmCostPrice : "Kosten", 
        clmNetMargin : "Nettomarge",
    },
    msgPriceDateUpdate :
    {
        msg : "Möchten Sie das Datum der Artikel aktualisieren, bei denen der Einkaufspreis unverändert bleibt?", 
        btn01 : "Ja", 
        btn02 : "Nein", 
        title : "Achtung" 
    },
    pg_txtBarcode : 
    {
        title : "Strichcode auswählen",
        clmCode :  "Artikelreferenz",
        clmName : "Artikelname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Strichcode"
    },
    msgQuantity:
    {
        title: "Menge",
        btn01: "Hinzufügen",
        msg: "Menge hinzufügen"
    },
    msgNewVat : 
    {
        title: "Achtung",  
        btn01: "Keine Aktualisierung vornehmen",  
        btn02: "Ausgewählte Zeilen aktualisieren",  
        msg: "Unterschied zwischen dem MwSt.-Satz der Rechnung und dem registrierten Satz."  
    },  
    grdNewVat: 
    {
        clmCode: "Code",    
        clmName: "Name",    
        clmVat: "Eingegebene MwSt.",    
        clmVat2: "Neue MwSt.",    
    },
    serviceAdd : "Service hinzufügen",  
    pg_service : 
    {
        title : "Dienstleistungen",   
        clmCode : "Code",   
        clmName : "Name"   
    },
    cmbPayType : 
    {
        title : "Zahlungsart",   
        cash : "Bargeld",   
        check : "Scheck",   
        bankTransfer : "Kontoüberweisung",   
        otoTransfer : "Lastschrift",   
        foodTicket : "Essensgutschein",   
        bill : "Rechnung",   
    },
    pg_adress : 
    {
        title : "Adressauswahl",   
        clmAdress : "Adresse",   
        clmCiyt : "Stadt",   
        clmZipcode : "Postleitzahl",   
        clmCountry : "Land",   
    },
    msgCode : 
    {
        title: "Achtung",
        btn01:"Zum Dokument gehen",
        msg: "Dokument gefunden!"
    },
    pg_offersGrid : 
    {  
        title : "Angebotsauswahl",   
        clmReferans : "Ref. Ref Nr",  
        clmCode : "Code",  
        clmName : "Name",  
        clmQuantity : "Menge",  
        clmTotal : "Gesamt",  
        clmPrice : "Preis",  
    },
    msgCustomerLock: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Lieferant kann nach Hinzufügen des Artikels nicht geändert werden!"
    },
}
export default ftr_04_003
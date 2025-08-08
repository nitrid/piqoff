// "Alış Anlaşması"
const cnt_02_001 = 
{
    cmbDepot: "Lager",
    txtCustomerCode : "Lieferantenauswahl",
    txtCustomerName : "Lieferantenname",
    btnMailsend : "E-Mail senden",
    validDesign : "Bitte wählen Sie das Design aus.",  
    validDocDate : "Sie müssen ein Datum wählen",
    cmbVatType : 
    {
        title : "Steuertyp",
        vatInc : "Inkl. MwSt.",
        vatExt : "Ohne MwSt."
    },
    pg_Docs : 
    {
        title : "Dokumentenauswahl",
        clmDate : "Datum",
        clmCode : "Code",     
        clmName : "Name",
        clmOutputName : "Lieferantenname",
        clmOutputCode  : "Kundencode",
        clmTotal : "Gesamtsumme inkl. MwSt."
    },
    pg_txtCustomerCode : 
    {
        title : "Lieferantenauswahl",
        clmCode :  "Kundencode",
        clmTitle : "Lieferantenname",
        clmTypeName : "Typ",
        clmGenusName : "Gattung"
    },
    pg_txtPopItemsCode : 
    {
        title : "Produkt auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz"
    },
    msgContractValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte wählen Sie zuerst den Lieferanten aus!"
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
    msgDeleteResult:
    {
        msg: "Datensatz erfolgreich gelöscht!"
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!",
        msgSuccess: "Speichern erfolgreich!",
        msgFailed: "Speichern fehlgeschlagen!"
    },
    msgNotCustomerCount:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Anzahl der Produkte wird diesem Lieferanten nicht zugeordnet!"
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
    },
    msgNotCustomer:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Unbekannter Lieferant"
    },
    grdContracts: 
    {
        clmItemCode: "Code",
        clmItemName: "Name",
        clmPrice: "Preis inkl. MwSt.",
        clmQuantity : "Menge",
        clmStartDate : "Beginn",
        clmFinishDate : "Ende",
        clmCreateDate: "Registrierungsdatum",
        clmDepotName : "Lager",
        clmMargin :"Marge", 
        clmVatExtPrice : "Preis ohne MwSt.", 
        clmCostPrice : "Kosten", 
        clmMulticode : "LFR. Code" ,
        clmUnit : "Einheit",
        clmUnitPrice : "Stückpreis ohne MwSt.",
        clmOrgins : "Herkunft",
    },
    popItems: 
    {
        title: "In Vertrag einbeziehen",
        txtPopItemsCode : "Produktreferenz",
        txtPopItemsName: "Produktname",
        txtPopItemsPrice : "Preis",
        txtPopItemsQuantity : "Menge",
        dtPopStartDate :"Beginn",
        dtPopEndDate : "Ende"
    },
    validCustomerCode : "Der Lieferanten-Kunden-Code kann nicht leer sein",
    txtCode : "Code",
    txtName : "Name",
    startDate :"Startdatum",    
    finishDate : "Enddatum",    
    docDate : "Datum", 
    msgMissItemCode:    
    {    
        title: "Achtung",    
        btn01: "OK",    
        msg: "Code nicht gefunden:"    
    },    
    msgMultiCodeCount:    
    {    
        title: "Achtung",    
        btn01: "OK",    
        msg: "Produkt hinzufügen"    
    },    
    popMultiItem:    
    {    
        title: "Mehrere Produkte hinzugefügt",    
        btnApprove: "Produkte suchen",    
        btnClear : "Leeren",    
        btnSave : "Zeilen hinzufügen",    
    },    
    cmbMultiItemType :     
    {    
        title : "Suchtyp",    
        customerCode : "Nach Lieferantencode",    
        ItemCode : "Produktreferenz"    
    },    
    grdMultiItem :     
    {    
        clmCode : "Referenz",    
        clmMulticode : "LFR.Code",    
        clmName : "Produktname",    
        clmQuantity : "Menge",    
        clmPrice : "Einkaufspreis"    
    },    
    msgMultiData:    
    {    
        title: "Achtung",    
        btn01: "Produkte hinzufügen und Liste zurücksetzen",    
        btn02: "Neue Produkte zur Liste hinzufügen",    
        msg: "Die eingegebenen Produkte sind bereits vorhanden."    
    },    
    tagItemCodePlaceholder: "Produktreferenzen eingeben",    
    msgDocValid:    
    {    
        title: "Achtung",    
        btn01: "OK",    
        msg: "Bitte geben Sie die Kopfzeile vor dem Abschluss ein!"    
    },
    validCode :"Code kann nicht leer sein!",
    popDesign : 
    {
        title: "Design-Auswahl",
        design : "Design" ,
        lang : "Dokumentsprache" 
    },
    msgUnit:
    {
        title: "Einheitenauswahl",
        btn01: "Bestätigen",
    }, 
    txtUnitFactor : "Einheitsfaktor",  
    txtUnitQuantity : "Einheitsmenge",  
    txtTotalQuantity : "Gesamtmenge",  
    txtUnitPrice : "Stückpreis",
    popMailSend : 
    {
        title :"E-Mail senden",   
        txtMailSubject : "E-Mail-Betreff",   
        txtSendMail : "E-Mail-Adresse",   
        btnSend : "Senden",
        cmbMailAddress : "E-Mail-Adresse des Absenders" // BAK
    },
    msgMailSendResult:
    {
        title: "Achtung",   
        btn01: "OK",   
        msgSuccess: "E-Mail erfolgreich gesendet!",   
        msgFailed: "E-Mail-Versand fehlgeschlagen!"   
    },
}
export default cnt_02_001
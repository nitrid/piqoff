// "Neues Produkt anlegen"
const stk_01_001 =
{
    txtRef: "Referenz",
    cmbItemGrp: "Produktgruppe",
    txtCustomer: "Lieferant",
    cmbItemGenus: "Produkttyp",
    txtBarcode: "Barcode",
    cmbTax: "Steuerklasse",
    cmbMainUnit: "Haupteinheit",
    cmbOrigin: "Herkunft",
    cmbUnderUnit: "Produkteinheit",
    txtItemName: "Produktname",
    txtShortName: "Kurzbezeichnung",
    chkActive: "Aktives Produkt",
    chkCaseWeighed: "Im Kassenbereich wiegen",
    chkLineMerged: "Positionen an der Kasse trennen",
    chkTicketRest: "Ticket Rest.",
    chkInterfel : "Interfel",
    chkPartiLot : "Partie/Lot",
    txtCostPrice: "Selbstkostenpreis",
    txtSalePrice : "Verkaufspreis",
    txtMinSalePrice: "Min. Verkaufspreis",
    txtMaxSalePrice: "Max. Verkaufspreis",
    txtLastBuyPrice: "Letzter Einkaufspreis",
    txtLastSalePrice: "Letzter Verkaufspreis",
    tabTitlePrice: "Verkaufspreis",
    tabTitleUnit: "Einheiten",
    tabTitleBarcode: "Barcode",
    tabTitleCustomer: "Lieferant",
    tabExtraCost: "Zusatzkosten",
    tabTitleCustomerPrice: "Lieferantenpreishistorie",
    tabTitleSalesContract: "Verkaufsvereinbarung",
    tabTitleInfo: "Informationen",
    tabTitleOtherShop :"Weitere Filialinformationen",
    tabTitleDetail : "Detaillierte Informationen",
    txtTaxSugar: "Zuckergehalt (100ML/GR)",
    txtTotalExtraCost : "Zusatzkosten",
    clmtaxSugar : "Zuckersteuer",
    priceUpdate : "Preis hinzufügen", 
    underUnitPrice : "Untereinheitspreis", 
    minBuyPrice : "Mindesteinkaufspreis",
    maxBuyPrice : "Maximaler Einkaufspreis",
    sellPriceAdd : "Verkaufspreis hinzufügen",
    clmInvoiceCost : "Servicegebühr", 
    validOrigin : "Herkunft darf nicht leer sein!",
    validTaxSucre : "Bitte geben Sie den korrekten Zuckergehalt ein!",
    validName : "Name darf nicht leer sein!",
    validQuantity : "Menge darf nicht leer sein!" ,
    validPrice :"Preis darf nicht leer sein!",
    validPriceFloat : "Der Betrag muss größer als 0 sein!",
    validCustomerCode :"Bitte geben Sie einen Lieferantencode ein!",
    validOriginMax8 :"Maximal 8 Zeichen eingeben!",
    validTax : "Steuer darf nicht leer sein!",
    mainUnitName :"Haupteinheit",
    underUnitName : "Untereinheit",
    chkDayAnalysis : "Täglich",  
    chkMountAnalysis : "Monatlich",  
    txtUnitFactor : "Einheitsfaktor", 
    cmbAnlysType : "Typ", 
    txtCustoms : "Zollcode", 
    txtGenus : "Produkttyp",
    txtRayon : "Abteilung",
    chkTaxSugarControl : "Zuckersteuer",
    cmbAnlysTypeData : 
    {
        pos: "POS", 
        invoice : "Rechnung"
    },
    msgDateInvalid:
    {
        title: "Warnung",
        msg: "Falsches Datum",
        btn01: "Ok"
    },
    pg_txtRef :
    {
        title: "Produkt auswählen",
        clmCode: "Code",
        clmName: "Name", 
        clmStatus: "Status" 
    },
    pg_txtPopCustomerCode:
    {
        title: "Lieferantenauswahl",
        clmCode: "Code",
        clmName: "Name", 
    },
    popPrice:
    {
        title: "Preis hinzufügen",
        cmbPopPriListNo: "Listennummer", 
        dtPopPriStartDate: "Startdatum",
        dtPopPriEndDate: "Enddatum", 
        cmbPopPriDepot: "Lager",
        txtPopPriQuantity: "Menge",
        txtPopPriPrice: "Verkaufspreis",
        txtPopPriHT: "Verkaufspreis ohne MwSt.",
        txtPopPriTTC : "Verkaufspreis inkl. MwSt.",
        txtPopPriceMargin : "Marge %",
        txtPopPriceGrossMargin :"Bruttomarge %",
        txtPopPriceNetMargin:"Nettomarge %",
    },
    popUnit:
    {
        title: "Einheit hinzufügen",
        cmbPopUnitType: "Typ",
        cmbPopUnitName: "Einheitsname", 
        txtPopUnitFactor: "Faktor",
        txtPopUnitWeight: "Gewicht",
        txtPopUnitVolume: "Volumen",
        txtPopUnitWidth: "Breite",
        txtPopUnitHeight: "Länge",
        txtPopUnitSize: "Höhe"
    },
    popBarcode:
    {
        title: "Barcode hinzufügen",
        txtPopBarcode: "Barcode",
        cmbPopBarUnit: "Einheit", 
        cmbPopBarType: "Typ"
    },
    popCustomer:
    {
        title: "Neuer Lieferant",
        txtPopCustomerCode: "Code",
        txtPopCustomerName: "Name", 
        txtPopCustomerItemCode: "Lieferantenreferenz",
        txtPopCustomerPrice: "Einkaufspreis "
    },
    grdPrice: 
    {
        clmListNo: "Listennummer", 
        clmDepot: "Lager",
        clmCustomerName: "Lieferant",
        clmStartDate: "Startdatum",
        clmFinishDate: "Enddatum",
        clmQuantity: "Menge",
        clmPriceTTC : "Preis inkl. MwSt.",
        clmPriceHT: "Preis ohne MwSt.",
        clmPrice: "Preis",
        clmGrossMargin: "Bruttomarge",
        clmNetMargin: "Nettomarge",
        clmMargin : "Marge %",
        clmListName: "Listenname"
    },
    grdUnit: 
    {
        clmType: "Typ",
        clmName: "Name",
        clmFactor: "Faktor",
        clmWeight: "Gewicht",
        clmVolume: "Volumen",
        clmWidth: "Breite",
        clmHeight: "Länge",
        clmSize: "Höhe"
    },
    grdBarcode: 
    {
        clmBarcode: "Barcode",
        clmUnit: "Einheit",
        clmType: "Typ"
    },
    grdExtraCost: 
    {
        clmDate: "Datum",
        clmPrice: "Zusatzkosten",
        clmTypeName: "Typ",
        clmCustomerPrice : "Lieferantenpreis",
        clmCustomer : "Lieferant",
        clmDescription : "Motiv",  
    },
    grdCustomer: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmPriceUserName: "Benutzer",
        clmPriceDate: "Letztes Selbstkostenpreisdatum",
        clmPrice: "Preis ",
        clmMulticode: "Lieferantenproduktcode"
    },
    grdSalesContract: 
    {
        clmUser: "Benutzer",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Letztes Selbstkostenpreisdatum",
        clmPrice: "Preis ",
        clmMulticode: "Lieferantenproduktcode"
    },
    grdCustomerPrice: 
    {
        clmUser: "Benutzer",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Letztes Selbstkostenpreisdatum",
        clmPrice: "Preis ",
        clmMulticode: "Lieferantenproduktcode"
    },
    grdOtherShop: 
    {
        clmCode: "Lieferantenreferenz",
        clmName: "Produktname",
        clmBarcode: "Barcode",
        clmPrice: "Verkaufspreis",
        clmMulticode: "LFR.Code",
        clmCustomer: "Lieferant",
        clmCustomerPrice: "Einkaufspreis",
        clmShop: "Filiale",
        clmDate: "Letztes Kaufdatum" 
    },
    msgRef:
    {
        title: "Achtung",
        btn01: "Zum Produkt gehen",
        btn02: "OK",
        msg: "Eingegebenes Produkt existiert bereits!"
    },
    msgBarcode:
    {
        title: "Achtung",
        btn01: "Zum Produkt gehen",
        btn02: "OK",
        msg: "Eingegebener Barcode existiert bereits!"
    },
    msgCustomer:
    {
        title: "Achtung",
        btn01: "Zum Produkt gehen",
        btn02: "OK",
        msg: "Eingegebener Lieferantenproduktcode existiert bereits!"
    },
    msgPriceSave:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen Preis ein!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgCostPriceValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen höheren Betrag als den Einkaufspreis ein!"
    },
    msgPriceAdd:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!"
    },
    tabTitleSalesPriceHistory : "Verkaufspreishistorie",
    grdSalesPrice : 
    {
        clmUser : "Benutzer",
        clmDate : "Änderungsdatum",
        clmPrice : "Preis ",
    },
    grdItemInfo: 
    {
        cDate: "Erstellungsdatum",
        cUser: "Ersteller",
        lDate: "Letztes Änderungsdatum",
        lUser : "Letzter Bearbeiter",
    },
    msgCheckPrice:
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Ähnlicher Eintrag kann nicht erstellt werden!" 
    },
    msgCheckCustomerCode:
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Lieferant existiert bereits!" 
    },
    msgSalePriceToCustomerPrice:
    {
        title: "Achtung", 
        btn01: "OK", 
        msg: "Der Einkaufspreis darf nicht höher als der Verkaufspreis sein! Bitte überprüfen Sie den Verkaufspreis." 
    },
    popAnalysis :  
    {
        title : "Verkaufsstatistik" 
    },
    popDescription :
    {
        title : "Produktsprache und Beschreibung",
        label : "Produktbeschreibung"
    },
    grdLang : 
    {
        clmLang : "Sprache",
        clmName : "Produktname",
    },
    popItemLang : 
    {
        title : "Produktsprache",
        cmbPopItemLanguage : "Sprache",
        cmbPopItemLangName : "Produktname",
    },
    grdAnalysis:  
    {
        clmToday: "Heute",
        clmYesterday: "Gestern",
        clmWeek: "Diese Woche",
        clmMount : "Dieser Monat",
        clmYear : "Dieses Jahr",
        clmLastYear : "Letztes Jahr"
    },
    dtFirstAnalysis : "Start",  
    dtLastAnalysis : "Ende", 
    btnGet : "Bestätigen", 
    msgNotDelete: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Produkt bereits verarbeitet, Löschen nicht möglich!"
    },
    cmbItemGenusData :
    {
        item : "Artikel",
        service : "Dienstleistung",
        deposit : "Pfand"
    },
    msgUnit:
    {
        title: "Einheitenberechnung",  
        btn01: "Bestätigen",   
    },
    msgUnitRowNotDelete :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können die Haupteinheit und die Untereinheit nicht löschen!" 
    },
    pg_customsCode : 
    {
        title : "Zollcodes",  
        clmCode : "Code",  
        clmName : "Name" 
    },
    pg_txtGenre : 
    {
        title : "Produkttyp",  
        clmCode : "Code", 
        clmName : "Name"  
    },
    pg_rayonCode : 
    {
        title : "Abteilungsauswahl",  
        clmCode : "Code", 
        clmName : "Name"  
    },
    msgNewItem:
    {
        title: "Achtung",   
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie die Seite aktualisieren möchten?"  
    },
    msgItemBack:
    {
        title: "Achtung",  
        btn01: "OK",  
        btn02: "Abbrechen",  
        msg: "Sind Sie sicher, dass Sie das Produkt erneut zurückholen möchten?"  
    },
    btnSubGroup: "Untergruppe hinzufügen",
    pg_subGroup: 
    {
        title: "Untergruppenauswahl",
        clmName: "Name",
    },
    grdProperty : 
    {
        clmProperty : "Eigenschaft",
        clmValue : "Wert",
    },
    propertyPopup : 
    {
        title : "Eigenschaft hinzufügen", 
        property : "Eigenschaft",
        value : "Wert",
        add : "Hinzufügen",
    },
    btnProperty : "Eigenschaft hinzufügen",
    grdProperty : 
    {
        clmProperty : "Eigenschaft",
        clmValue : "Wert",
    },
}
export default stk_01_001
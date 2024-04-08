//Yeni Ürün Tanımlama
const stk_01_001 = 
{
    txtRef: "Referenz",
    cmbItemGrp: "Artikelgruppe",
    txtCustomer: "Lieferant",
    cmbItemGenus: "Artikelart",
    txtBarcode: "Barcode",
    cmbTax: "Steuersatz",
    cmbMainUnit: "Haupteinheit",
    cmbOrigin: "Herkunft",
    cmbUnderUnit: "Untereinheit",
    txtItemName: "Artikelname",
    txtShortName: "Kurzname",
    chkActive: "Aktiv",
    chkCaseWeighed: "An der Kasse wiegen.",
    chkLineMerged: "Verkauf mit getrennten Positionen",
    chkTicketRest: "Ticket-Rest.",
    chkInterfel : "Interfel",
    txtCostPrice: "Einkaufspreis",
    txtSalePrice : "Verkaufspreis",
    txtMinSalePrice: "Min. Verkaufspreis",
    txtMaxSalePrice: "Max. Verkaufspreis",
    txtLastBuyPrice: "Letzter Einkaufspreis",
    txtLastSalePrice: "Letzter Verkaufspreis",
    tabTitlePrice: "Preis",
    tabTitleUnit: "Einheit",
    tabTitleBarcode: "Barcode",
    tabTitleCustomer: "Lieferant",
    tabExtraCost: "Zusätzliche Kosten",
    tabTitleCustomerPrice: "Lieferantenpreisverlauf",
    tabTitleSalesContract: "Verkaufsverträge",
    tabTitleInfo: "Informationen",
    tabTitleOtherShop :"Andere Filialinformationen",
    tabTitleDetail : "Weitere Angaben", // 
    txtTaxSugar: "Zuckergehalt (100ML/GR)",
    txtTotalExtraCost : "Zusätzliche Kosten",
    clmtaxSugar : "Zuckersteuer",
    priceUpdate : "Preisaktualisierung",
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
    validPriceFloat : "Der Preis muss größer als 0 sein!",
    validCustomerCode :"Lieferanten-Code eingeben!",
    mainUnitName: "Haupteinheit",
    underUnitName: "Untereinheit",
    chkDayAnalysis: "Täglich",
    chkMountAnalysis: "Monatlich",
    txtUnitFactor: "Einheitsfaktor",
    cmbAnlysType: "Typ",
    txtCustoms : "Zollcode", 
    txtGenus : "Produktart", 
    cmbAnlysTypeData:         
    {
        pos: "POS",
        invoice: "Rechnung"
    },
    msgDateInvalid:
    {
        title: "Warnung",
        msg: "Falsches Datum",
        btn01: "Ok"
    },

    pg_txtRef: 
    {
        title: "Auswahl der Artikel",
        clmCode: "CODE",
        clmName: "NAME",
        clmStatus: "STATUS"
    },
    pg_txtPopCustomerCode: 
    {
        title: "Kundenwahl",
        clmCode: "CODE",
        clmName: "NAME"
    },
    popPrice: 
    {
        title: "Preis hinzufügen",
        cmbPopPriListNo: "Listennummer", 
        dtPopPriStartDate: "Startdatum",
        dtPopPriEndDate: "Enddatum",
        txtPopPriQuantity: "Menge",
        txtPopPriPrice: "Preis",
        txtPopPriPriceVatExt: "Preis ohne MwSt."
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
        txtPopUnitHeight: "Höhe",
        txtPopUnitSize: "Größe"
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
        title: "Lieferant hinzufügen",
        txtPopCustomerCode: "Code",
        txtPopCustomerName: "Name",
        txtPopCustomerItemCode: "Artikelcode des Lieferanten",
        txtPopCustomerPrice: "Preis"
    },
    grdPrice: 
    {
        clmListNo: "Listennummer", 
        clmDepot: "Lager",
        clmCustomerName: "Kunde",
        clmStartDate: "Startdatum",
        clmFinishDate: "Enddatum",
        clmQuantity: "Menge",
        clmVatExt: "Preis ohne MwSt.",
        clmPrice: "Preis",
        clmGrossMargin: "Bruttomarge",
        clmNetMargin: "Nettomarge"
    },
    grdUnit: 
    {
        clmType: "Typ",
        clmName: "Name",
        clmFactor: "Faktor",
        clmWeight: "Gewicht",
        clmVolume: "Volumen",
        clmWidth: "Breite",
        clmHeight: "Höhe",
        clmSize: "Größe"
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
        clmCustomerPrice: "Lieferantenpreis",
        clmCustomer: "Lieferant",
        clmDescription: "Beschreibung"
    },
    grdCustomer: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmPriceUserName: "Benutzer/in",
        clmPriceDate: "Letztes Preisdatum",
        clmPrice: "Preis",
        clmMulticode: "LieferantenArtikelcode"
    },
    grdSalesContract: 
    {
        clmUser: "Benutzer",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Letztes Preisdatum",
        clmPrice: "Preis",
        clmMulticode: "LieferantenArtikelcode"
    },
    grdCustomerPrice: 
    {
        clmUser: "Benutzer/in",
        clmCode: "Code",
        clmName: "Name",
        clmDate: "Letztes Preisdatum",
        clmPrice: "Preis",
        clmMulticode: "LieferantenArtikelcode"
    },
    grdOtherShop: 
    {
        clmCode: "Artikelcode",
        clmName: "Artikelname",
        clmBarcode: "Barcode",
        clmPrice: "Preis",
        clmMulticode: "LieferantenArtikelcode",
        clmCustomer: "Lieferant",
        clmCustomerPrice: "Lieferantenpreis",
        clmShop: "Filiale",
        clmDate: "Aktualisierungsdatum"
    },
    msgRef: 
    {
        title: "Achtung",
        btn01: "Zum Artikel gehen",
        btn02: "OK",
        msg: "Der eingegebene Bestand ist im System vorhanden!"
    },
    msgBarcode: 
    {
        title: "Achtung",
        btn01: "Zum Artikel gehen",
        btn02: "OK",
        msg: "Der eingegebene Barcode ist im System vorhanden!"
    },
    msgCustomer: 
    {
        title: "Achtung",
        btn01: "Zum Artikel gehen",
        btn02: "OK",
        msg: "Der eingegebene LieferantenArtikelcode ist im System vorhanden!"
    },
    msgPriceSpeichern: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen Preis ein!"
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
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgCostPriceValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte geben Sie einen höheren Preis als den Einkaufspreis ein!"
    },
    msgPriceAdd:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!"
    },
    tabTitleSalesPriceHistory : "Verkaufspreisverlauf",
    grdSalesPrice : 
    {
        clmUser : "Benutzer/in",
        clmDate : "Änderungsdatum",
        clmPrice : "Preis",
    },
    grdItemInfo: 
    {
        cDate: "Erstellungsdatum",
        cUser: "Ersteller-Benutzer/in",
        lDate: "Letztes Änderungsdatum",
        lUser : "Letzter Benutzer/in",
    },
    msgCheckPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können keinen ähnlichen Eintrag erstellen!"
    },
    msgCheckCustomerCode:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der eingegebene Lieferantencode ist bereits vorhanden!"
    },
    msgSalePriceToCustomerPrice:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der eingegebene Lieferantenpreis darf nicht höher sein als der Verkaufspreis! Bitte überprüfen Sie Ihren Verkaufspreis."
    },
    popAnalysis :
    {
        title : "Verkaufsstatistik"
    },
    popDescription :
    {
        title : "Produkt Sprache und Beschreibung",
        label : "Produktbeschreibung"
    },
    grdLang : 
    {
        clmLang : "Sprache",
        clmName : "Produktname",
    },
    popItemLang : 
    {
        title : "Produkt Sprache",
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
    btnGet : "Suchen",
    msgNotDelete:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Dieser Artikel kann nicht gelöscht werden, da Transaktione exisieren!"
    },
    cmbItemGenusData :
    {
        item : "Ware",
        service : "Dienstleistung",
        deposit : "Kaution"
    },
    msgUnit:
    {
        title: "Einheitenumrechnung",
        btn01: "Bestätigen",
    },
    msgUnitRowNotDelete :
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Sie können die Basiseinheit oder die Unterunit nicht löschen!"
    },
    pg_customsCode : 
    {
        title : "Zollcodes",   
        clmCode : "CODE",   
        clmName : "NAME" 
    },
    pg_txtGenre : 
    {
        title : "Produktart",   
        clmCode : "CODE",   
        clmName : "NAME"  
    },
    msgNewItem:
    {
        title: "Achtung",   
        btn01: "Ja!",   
        btn02: "Abbrechen",   
        msg: "Möchten Sie zu einem neuen Produkt wechseln?"  
    },
    msgItemBack:
    {
        title: "Achtung",  
        btn01: "Ja!",  
        btn02: "Abbrechen",  
        msg: "Möchten Sie erneut nach dem Produkt suchen?"  
    },
}
export default stk_01_001
// "Produkt-Ein-/Ausgangs-Operation"
const stk_04_005 =
{
    txtRef : "Ref. Ref No",
    cmbDepot: "Ausgangslager",
    dtDocDate : "Datum",
    txtBarcode : "Barcode hinzufügen",
    getRecipe : "Produktrezept",
    pg_Docs : 
    {
        title : "Dokumentauswahl",
        clmDate : "Datum",
        clmRef : "Referenz",
        clmRefNo : "Nummer",
        clmDocDate : "Datum",
        clmInputName : "Eingang",
        clmOutputName : "Eingang",
    },
    pg_txtItemsCode : 
    {
        title : "Produkt auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
    },
    grdList: 
    {
        clmType: "Typ",
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity : "Menge",
        clmDescription :"Grund",
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
    msgEmpDescription:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Zeileninformationen dürfen nicht leer sein!"
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
        msg: "Sind Sie sicher, dass Sie den Datensatz löschen möchten?"
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
        msg: "Falsches Passwort"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Produkt nicht gefunden!!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Produkt bereits im Dokument vorhanden! Möchten Sie zusammenführen?"
    },
    validRef :"Ref eingeben",
    validRefNo : "Ref No eingeben",
    validDepot : "Lager auswählen",
    validCustomerCode : "Der Lieferanten-Kundencode darf nicht leer sein",
    validDocDate : "Datum auswählen",
    pg_quickDesc : 
    {
        title : "Schnellauswahl",
        clmDesc: "Grund"
    },
    popQDescAdd : 
    {
        title : "Schnelleingabe hinzufügen",
        description : "Neue Eingabe",
        btnApprove : "speichern"
    },
    msgNotQuantity: 
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Die eingegebene Lagermenge kann nicht negativ sein! Vorhandene Menge:"
    },
    pg_txtBarcode : 
    {
        title : "Barcode auswählen",
        clmCode :  "Produktreferenz",
        clmName : "Produktname",
        clmMulticode : "Lieferantenreferenz",
        clmBarcode : "Barcode"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden!"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Bitte Menge eingeben!",
    },
    txtQuantity :"Menge",
    cmbType: 
    {
        input: "Eingang",
        output: "Ausgang"
    },
    popRecipe: 
    {
        title: "Produktrezept auswählen",
        clmDate: "Datum",
        clmCode: "Produktcode",
        clmName: "Produktname",
        clmQuantity: "Menge"
    },
    popRecipeDetail: 
    {
        title: "Detaillierte Eingabe des Produktrezepts",
        clmType: "Typ",
        clmCode: "Produktcode",
        clmName: "Produktname",
        clmQuantity: "Rezeptmenge",
        clmEntry: "Eingangsmenge"
    }
}
export default stk_04_005
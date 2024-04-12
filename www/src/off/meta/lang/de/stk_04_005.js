// "Ürün Giriş Çıkış Operasyonu"
const stk_04_005 =
{
    txtRef: "Seriennummer-Reihenfolge",
    cmbDepot: "Ausgangslager",
    dtDocDate: "Datum",
    txtBarcode: "Barcode hinzufügen",
    getRecipe : "Produktrezept",
    pg_Docs:
    {
        title: "Dokumentauswahl",
        clmDate: "DATUM",
        clmRef: "SERIE",
        clmRefNo: "REIHENFOLGE",
        clmDocDate: "DATUM",
        clmInputName: "EINGABE",
        clmOutputName: "AUSGABE",
    },
    pg_txtItemsCode:
    {
        title: "Artikelauswahl",
        clmCode: "ARTIKELNUMMER",
        clmName: "ARTIKELNAME",
    },
    grdList:
    {
        clmType: "Typ",
        clmItemCode: "Code",
        clmItemName: "Name",
        clmQuantity: "Anzahl",
        clmDescription: "Beschreibung",
    },
    popPassword:
    {
        title: "Sie müssen das Administratorpasswort eingeben, um das Dokument zu öffnen",
        Password: "Passwort",
        btnApprove: "Bestätigen"
    },
    msgDocValid:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Die Oberen Dokumentinformationen müssen ausgefüllt sein, bevor Sie Artikel hinzufügen können!"
    },
    msgEmpDescription:
    {
        title: "Achtung",
        btn01: "Ok",
        msg: "Beschreibungen dürfen nicht leer sein!"
    },
    msgSpeichern:
    {
        title: "Achtung",
        btn01: "Ok",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!"
    },
    msgSpeichernResult:
    {
        title: "Achtung",
        btn01: "Ok",
        msgSuccess: "Ihr Eintrag wurde erfolgreich gespeichert!",
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!"
    },
    msgSpeichernValid:
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
        msg: "Die Dokumentsperre wurde aufgehoben!",
    },
    msgPasswordWrong:
    {
        title: "Fehlgeschlagen",
        btn01: "OK",
        msg: "Das Passwort ist falsch!"
    },
    msgItemNotFound:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Artikel nicht gefunden!"
    },
    msgCombineItem:
    {
        title: "Achtung",
        btn01: "Zusammenführen",
        btn02: "Neu hinzufügen",
        msg: "Der Artikel, den Sie hinzufügen möchten, ist bereits im Dokument vorhanden! Sollen die Zeilen zusammengeführt werden?"
    },
    validRef: "Die Seriennummer darf nicht leer sein",
    validRefNo: "Die Reihenfolge darf nicht leer sein",
    validDepot: "Sie müssen ein Lager auswählen",
    validCustomerCode: "Der Kundencode darf nicht leer sein",
    validDocDate: "Sie müssen ein Datum auswählen",
    pg_quickDesc:
    {
        title: "Kurzbeschreibungsauswahl",
        clmDesc: "BESCHREIBUNG"
    },
    popQDescAdd:
    {
        title: "Kurzbeschreibung hinzufügen",
        description: "Neue Beschreibung",
        btnApprove: "Speichern"
    },
    msgNotQuantity:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Der Lagerbestand darf nicht ins Minus fallen! Höchstmenge, die hinzugefügt werden kann:"
    },
    pg_txtBarcode:
    {
        title: "Barcode-Auswahl",
        clmCode: "Artikelnummer",
        clmName: "Artikelname",
        clmMulticode: "Lieferantennummer",
        clmBarcode: "Barcode"
    },
    msgCode:
    {
        title: "Achtung",
        btn01: "Zum Dokument gehen",
        msg: "Dokument gefunden"
    },
    msgQuantity:
    {
        title: "Achtung",
        btn01: "Hinzufügen",
        btn02: "Abbrechen",
        msg: "Bitte Menge eingeben!"
    },
    txtQuantity: "Menge",
    cmbType: 
    {
        input: "Eingang",
        output: "Ausgang"
    },
    popRecipe: 
    {
        title: "Auswahl des Produktrezepts",
        clmDate: "Datum",
        clmCode: "Produktcode",
        clmName: "Produktname",
        clmQuantity: "Menge"
    },
    popRecipeDetail: 
    {
        title: "Detailierte Eingabe des Produktrezepts",
        clmType: "Typ",
        clmCode: "Produktcode",
        clmName: "Produktname",
        clmQuantity: "Rezeptmenge",
        clmEntry: "Eingangsmenge"
    }
}
export default stk_04_005
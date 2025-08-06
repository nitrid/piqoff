// "Dienstleistungsdefinitionen"
const stk_01_007 = 
{
    txtCode : "Code",
    txtName :"Name",
    cmbType :"Typ",
    validCode :"Das Code-Feld darf nicht leer sein!",      
    pg_txtCode : 
    {
        title : "Dienstleistungskartenauswahl",
        clmCode : "Code",
        clmName : "Name",
        clmType : "Typ",
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten? "
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Speichern erfolgreich!",
        msgFailed: "Ihr Speichervorgang ist fehlgeschlagen!"
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
        msg: "Möchten Sie den Eintrag wirklich löschen?"
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Zur Karte gehen", 
        btn02: "OK",
        msg : "Der eingegebene Dienstleistungscode ist im System registriert!"
    },
    chkActive: "Aktiv",
    cmbTax : "MwSt.",
    msgNotDelete : 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg : "Löschen nicht möglich, da bereits Einträge mit dieser Karte vorhanden sind!" 
    },
    msgNotUpdate : 
    {
        title: "Achtung", 
        btn01: "OK", 
        msg : "Änderung nicht möglich, da bereits Einträge mit dieser Karte vorhanden sind!" 
    },
}
export default stk_01_007
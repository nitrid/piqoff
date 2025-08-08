// "Lager/Filiale-Definitionen"
const stk_01_006 = 
{
    txtCode : "Code",
    txtName :"Name",
    cmbType :"Typ",
    validCode :"Das Code-Feld darf nicht leer sein!", 
    cmbTypeData : 
    {
        normal : "Zentral",
        rebate : "Rückgabe",
        shop : "Filiale",
        outage : "Verderb",
    },
    pg_txtCode : 
    {
        title : "Lagerauswahl",
        clmCode : "Code",
        clmName : "Name",
        clmType : "Typ",
    },
    msgSave:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie speichern möchten!" ,
    },
    msgSaveResult:
    {
        title: "Achtung",
        btn01: "OK",
        msgSuccess: "Erfolgreich gespeichert!",
        msgFailed: "Speichern fehlgeschlagen!" ,
    },
    msgSaveValid:
    {
        title: "Achtung",
        btn01: "OK",
        msg: "Bitte füllen Sie die erforderlichen Felder aus!" ,
    },
    msgDelete:
    {
        title: "Achtung",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?" ,
    },
    msgCode : 
    {
        title: "Achtung",
        btn01: "Lager auswählen",
        btn02: "OK",
        msg : "Eingegebenes Lager ist bereits in der Datenbank registriert!" ,
    },
    chkActive: "Aktiv",
    msgNotDeleted : 
    {
        title: "Achtung",  
        btn01: "OK",  
        msg : "Löschen nicht möglich, da bereits Einträge für dieses Lager vorhanden sind!"  
    },
}
export default stk_01_006
// "Eigenschaftsdefinitionen"
const stk_01_018 = 
{
    txtCode : "Eigenschaftscode",
    txtName : "Eigenschaftsname",
    txtDescription : "Beschreibung",
    txtType : "Eigenschaftstyp",
    txtValue : "Wert",
    txtRequired : "Erforderlich",
    txtActive : "Aktiv",
    txtSortOrder : "Sortierreihenfolge",
    
    // Eigenschaftstypen
    typeText : "Text",
    typeNumber : "Zahl",
    typeDate : "Datum",
    typeBoolean : "Ja/Nein",
    typeList : "Liste",
    typeColor : "Farbe",
    typeImage : "Bild",
    
    // Popup-Titel
    popPropertySelect : 
    {
        title : "Eigenschaft auswählen",
        clmCode : "Eigenschaftscode",
        clmName : "Eigenschaftsname",
        clmType : "Typ"
    },
    
    // Nachrichten
    msgSave : {
        title : "Speicheroperation",
        msg : "Sind Sie sicher, dass Sie speichern möchten?",
        btn01 : "Speichern",
        btn02 : "Abbrechen"
    },
    msgDelete : {
        title : "Löschoperation",
        msg : "Sind Sie sicher, dass Sie löschen möchten?",
        btn01 : "Löschen",
        btn02 : "Abbrechen"
    },
    msgError : {
        title : "Fehler",
        msg : "Ein Fehler ist aufgetreten",
        btn01 : "OK"
    },
    msgSaveResult : {
        title : "Speicherergebnis",
        msgSuccess : "Speicheroperation erfolgreich abgeschlossen",
        msgError : "Während der Speicheroperation ist ein Fehler aufgetreten"
    },
    
    // Validierungsnachrichten
    validCode: "Eigenschaftscode darf nicht leer sein",
    validName: "Eigenschaftsname darf nicht leer sein",
    validType: "Eigenschaftstyp muss ausgewählt werden",
    validSortOrder: "Sortierreihenfolge muss eingegeben werden",
    
    // Grid-Spalten
    grdPropertyList: 
    {
        clmCode: "Code",
        clmName: "Name",
        clmType: "Typ",
        clmRequired: "Erforderlich",
        clmActive: "Aktiv",
        clmSortOrder: "Reihenfolge"
    }
}

export default stk_01_018 
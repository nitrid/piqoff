// Depo/Mağaza Tanımları
const stk_01_006 = 
{
    txtCode : "Code",
    txtName :"Name",
    cmbType :"Typ",
    validCode :"Sie dürfen das Feld Code nicht leer lassen!",
    cmbTypeData : 
    {
        normal : "Zentral",
        rebate : "Rabatt",
        shop : "Shop",
        outage : "Verderb",
    },
    pg_txtCode :
    {
        title: "Lager wählen.",
        clmCode: "Code",
        clmName: "Name",
        clmType: "Type",
    },
    msgSpeichern:
    {
        title: "Achtung!",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?"
    },
    msgSpeichernResult:
    {
        title: "Achtung!",
        btn01: "OK",
        msgSuccess: "Eintrag erfolgreich gespeichert!",
        msgFailed: "Ihr Eintrag konnte nicht gespeichert werden!",
    },
    msgSpeichernValid:
    {
        title: "Achtung!",
        btn01: "OK",
        msg: "Bitte füllen Sie alle erforderlichen Felder aus!",
    },
    msgDelete:
    {
        title: "Achtung!",
        btn01: "OK",
        btn02: "Abbrechen",
        msg: "Sind Sie sicher, dass Sie den Eintrag löschen möchten?",
    },
    msgCode:
    {
        title: "Achtung!",
        btn01: "Gehen Sie zur Kasse.",
        btn02: "OK",
        msg: "Der eingegebene Code ist bereits im System registriert!",
    },
    chkActive: "Aktiv",
    msgNotDeleted:
    {
        title: "Achtung!",
        btn01: "OK",
        msg: "Dieser Lager kann nicht gelöscht werden, da Transaktione exisieren!",
    },
}
export default stk_01_006
// Depo/Mağaza Tanımları
const stk_01_006 = 
{
    txtCode : "Code",
    txtName :"Nom",
    cmbType :"Type",
    validCode :"Le champ du code ne peut être vide !", //BAK
    cmbTypeData : 
    {
        normal : "Centrale",
        rebate : "Retour",
        shop : "Magasin",
        outage : "Frais",
    },
    pg_txtCode : 
    {
        title : "Sélection Dépôt",
        clmCode : "Code",
        clmName : "Nom",
        clmType : "Type",
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir Enregistrer!" ,
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec succès !",
        msgFailed: "Enregistrement échoué !" ,
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessaires !" ,
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?" ,
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Sélection Coffre",
        btn02: "OK",
        msg : "Coffre Saisie déjà enregistré dans notre base ! " ,
    },
    chkActive: "Actif",
    msgNotDeleted : 
    {
        title: "Attention",  
        btn01: "OK",  
        msg : "Suprression Impossible car Saisie Effectué sur ce Dépôt !"  
    },
}
export default stk_01_006
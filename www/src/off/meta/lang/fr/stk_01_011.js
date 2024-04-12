// Vergi Tanımlama
const stk_01_011 = 
{
    txtId : "I.D", 
    txtVat :"Valeur d'impôt", 
    txtType : "Type",   
    cmbType :"Type",   
    validCode :"Le champ du code ne peut être vide !",  
    pg_txtCode :    
    {   
        title : "Choix de groupe de produits",  
        clmId : "I.D",   
        clmVat : "Valeur",   
        clmType : "Type",  
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes vous sûr(e) de vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec Succès !",
        msgFailed: "Enregistrement Echoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez Saisir les Champs Nécessaires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgCode : 
    {
        title: "Attention", 
        btn01: "Allez à la caisse", 
        btn02: "OK", 
        msg : "L'ID que vous avez saisi est enregistré dans le système !" 
    },
    chkActive: "Actif", 
}
export default stk_01_011
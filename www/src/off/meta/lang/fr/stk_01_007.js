// Hizmet Tanımları
const stk_01_007 = 
{
    txtCode : "Code",
    txtName :"Nom",
    cmbType :"Type",
    validCode :"Le champ du code ne peut être vide !", //BAK      
    pg_txtCode : 
    {
        title : "Sélection de la carte de service",
        clmCode : "Code",
        clmName : "Nom",
        clmType : "Type",
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir enregistrer? "
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistrement réussi !",
        msgFailed: "Echec de Votre Enregistrement !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez remplir les champs obligatoires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Voulez-vous vraiment supprimer l'enregistrement ?"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Aller à la carte", //BAK
        btn02: "OK",
        msg : "Le code de service que vous avez saisi est enregistré dans le système !"
    },
    chkActive: "Actif",
    cmbTax : "TVA",
    msgNotDelete : 
    {
        title: "Attention", 
        btn01: "OK", 
        msg : "Suprression Impossible car Saisie Effectué avec cette Carte !" 
    },
    msgNotUpdate : 
    {
        title: "Attention", 
        btn01: "OK", 
        msg : "Modification Impossible car Saisie Effectué avec cette Carte !" 
    },
}
export default stk_01_007
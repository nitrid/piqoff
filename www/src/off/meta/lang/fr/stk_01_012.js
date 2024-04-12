// Bağlı Ürün Tanımlama
const stk_01_012 = 
{
    txtCode : "Code", 
    txtName :"Nom", 
    txtQuantity : "Montant", 
    msgRelatedValid: 
    {
        title: "Attention",
        btn01: "D'accord",
        msg: "Impossible d'ajouter une ligne sans sélectionner le produit !"
    },
    grdRelated : 
    {
        clmItemCode : "Code",
        clmItemName : "Nom",
        clmQuantity : "Montant"
    },
    popRelatedSelect : 
    {
        title : "Sélection du produit", //BAK
        clmCode : "Code",
        clmName : "Nom",
    },
    popItemSelect : 
    {
        title : "Sélection du produit", //BAK
        clmCode : "Code",
        clmName : "Nom",
    },
    msgSave : 
    {
        title : "Attention",
        btn01 : "D'accord",
        btn02 : "Abandonnerz",
        msg : "Êtes-vous sûr(e) de vouloir enregistrer ?"
    },
    msgSaveResult :
    {
        title : "Attention",
        btn01 : "D'accord",
        msgSuccess : "Enregistrement réussi!",
        msgFailed : "Echec de l'enregistrement!"
    },
    msgSaveValid : 
    {
        title : "Attention",
        btn01 : "D'accord",
        msg : "Veuillez saisir les champs nécessaires" //BAK
    },
    msgDelete :
    {
        title : "Attention",
        btn01 : "D'accord",
        btn02 : "Abandonner",
        msg : "Êtes-vous sûr(e) de vouloir supprimer l'enregistrement?"
    },
}
export default stk_01_012
// "Ürün Giriş Çıkış Operasyonu"
const stk_04_005 =
{
    txtRef : "Réf. Réf No",
    cmbDepot: "Sortie Dépot",
    dtDocDate : "Date",
    txtBarcode : "Ajouter Code Barre",
    getRecipe : "Recette du produit",
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmDocDate : "Date",
        clmInputName : "Entrée",
        clmOutputName : "Entrée",
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
    },
    grdList: 
    {
        clmType: "Type",
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmQuantity : "Quantité",
        clmDescription :"Motif",
    },
    popPassword : 
    {
        title: "Veuillez Saisir MDP Administrateur pour Accès au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-tête avant l'achèvement !"
    },
    msgEmpDescription:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Information ligne ne peux pas être vide !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Enregistré avec succès !",
        msgFailed: "Enregistrement échoué !"
    },
    msgSaveValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les zones nécessairess !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
    },
    msgPasswordSucces:
    {
        title: "Succès",
        btn01: "OK",
        msg: "Document Déverouillé !",
    },
    msgPasswordWrong:
    {
        title: "Echec",
        btn01: "OK",
        msg: "Mot de Passe Erroné"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit Introuvable !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regroupe",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans Document ! Voulez-vous Combiner ?"
    },
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépot",
    validCustomerCode : "Le code fournisseur-client ne peut être vide" ,
    validDocDate : "Sélectionner Date" ,
    pg_quickDesc : 
    {
        title : "Sélection Touche Rapide" ,
        clmDesc: "Motif" 
    },
    popQDescAdd : 
    {
        title : "Ajoute Saisie Rapide" ,
        description : "Nouvelle Saisie" ,
        btnApprove : "enregistrer"        
    },
    msgNotQuantity: 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "La quantité de depôt saisie ne peut être en négatif ! Quantité existante:"
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code Barre"
    },
    msgCode : 
    {
        title: "Attention",
        btn01: "Aller au document",
        msg: "Document trouvé !"
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Ajouter",
        btn02: "Abandonner",
        msg: "Veuillez Saisir la Quantité !" ,
    },
    txtQuantity :"Quantité",
    cmbType: 
    {
        input: "Entrée",
        output: "Sortie"
    },
    popRecipe: 
    {
        title: "Sélection de la recette du produit",
        clmDate: "Date",
        clmCode: "Code du produit",
        clmName: "Nom du produit",
        clmQuantity: "Quantité"
    },
    popRecipeDetail: 
    {
        title: "Saisie détaillée de la recette du produit",
        clmType: "Type",
        clmCode: "Code du produit",
        clmName: "Nom du produit",
        clmQuantity: "Quantité de recette",
        clmEntry: "Quantité d'entrée"
    }
}
export default stk_04_005
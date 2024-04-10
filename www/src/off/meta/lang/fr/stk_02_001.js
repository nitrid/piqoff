// Sayım Evrakı
const stk_02_001 = 
{
    txtRefRefno : "Réf.-Réf no:",
    cmbDepot: "Dépôt inventaire",
    dtDocDate : "Date",
    txtBarcode : "Ajouter Code Barre",
    txtQuantity :"Quantité",
    txtAmount : "Valeur Totale",
    validDesign : "Veuillez choisir le design",
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmDocDate : "Date",
        clmDepotName : "Dépôt ou Magasin",
        clmQuantity :"Quantité Totale Produit",
        clmTotalLine : "Numéro de Ligne"
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmPrice : "Prix D'Achat", //BAK ekleme yaptim
    },
    grdItemCount: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmQuantity : "Quantité",
        clmCreateDate: "Date d'Enregistrement",
        clmDescription :"Motif",
        clmCostPrice :"Coût Unitaire",
        clmTotalCost :"Coût Total",
        clmCustomerName :"Compte Fournisseur",
        clmMulticode : "FRN.Code",
        clmBarcode : "Code barre",
        clmUser : "Utilisateur",
    },
    popPassword : 
    {
        title: "Veuillez Saisir MDP Administrateur pour Accéder au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider" ,
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-têtes avant l'achèvement !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir Enregistrer!" ,
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Ajouter",
        btn02: "Abandonner",
        msg: "Veuillez Saisir la Quantité !" ,
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
        msg: "Veuillez saisir les champs nécessaires !", //BAK
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir supprimer l'enregistrement ?",
    },
    msgBigQuantity:
    {
        title: "Attention",
        btn01: "Continuer",
        btn02: "Abandonner",
        msg: "Chiffre saisi Supérieur à 1000 Voulez-vous continuer ?",
    },
    msgLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Enregistré et Vérouillé !"
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
        msg: "Mot de Passe Erroné",
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouiller Pour Enregistrer les Modifications !"
    },
    msgDoclocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Enregistrer sans Dévérouiller !"
    },
    msgItemNotFound:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Produit Introuvable !"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regrouper",
        btn02: "Modifier",
        btn03: "Abandonner",
        msg: "Produit Existant dans le Document ! Voulez-vous Combiner ?"
    },
    validRef :"Saisir Réf ",
    validRefNo : "Saisir Réf No ",
    validDepot : "Sélectionner Dépôt",
    validCustomerCode : "Le code fournisseur-client ne peut être vide",
    validDocDate : "Sélectionner Date" ,
    popDesign : 
    {
        title: "Choix du Design",
        design : "Design" ,
        lang : "Langue Document" 
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Code Barre", 
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
}
export default stk_02_001
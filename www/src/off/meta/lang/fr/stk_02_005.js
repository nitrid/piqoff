// İade Ürünü Toplama
const stk_02_005 = 
{
    txtRefRefno : "Réf.-Réf no:",
    cmbDepot1: "Sortie Dépôt",
    cmbDepot2: "Retour Dépôt",
    dtDocDate : "Date",
    getRebate :"Retour depuis l'entrepôt sélectionné", 
    txtBarcode : "Ajouter Code Barre",
    pg_Docs : 
    {
        title : "Sélection Document",
        clmDate : "Date",
        clmRef : "Référence",
        clmRefNo : "Numéro",
        clmDocDate : "Date",
        clmInputName : "Entrée",
        clmOutputName : "Sortie",
    },
    pg_txtItemsCode : 
    {
        title : "Sélectionner Produit",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
    },
    grdRebItems: 
    {
        clmItemCode: "Code",
        clmItemName: "Nom",
        clmQuantity : "Quantité",
        clmCreateDate: "Date d'Enregistrement",
        clmDescription :"Motif",
        clmCuser : "Utilisateur",
    },
    popPassword : 
    {
        title: "Veuillez Saisir MDP Administrateur pour Accéder au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-tête avant l'achèvement !"
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
        msg: "Veuillez saisir les champs nécessaires !"
    },
    msgDelete:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Etes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
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
        msg: "Mot de Passe Erroné"
    },
    msgGetLocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Document Vérouillé !  \n  Veuillez Dévérouillez Pour Enregistrer les Modifications !"
    },
    msgDoclocked:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Vous ne Pouvez Enregistrer Sans Dévérouiller !"
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
    validCustomerCode : "Le Code  Produit",
    validDocDate : "Sélectionner Date" ,
    popDesign : 
    {
        title: "Choix du Désign",
        design : "Design" ,
        lang : "Langue Document" 
    },
    msgNotQuantity: 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "La quantité présent au depôt ne peut être négative ! Quantité existant:"
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
        btn01: "Recherche Document",
        msg: "Document Trouvé"
    },
    msgQuantity:
    {
        title: "Attention",
        btn01: "Ajouter",
        btn02: "Abandonner",
        msg: "Veuillez Saisir la Quantité !" ,
    },
    txtQuantity :"Quantité",
}
export default stk_02_005
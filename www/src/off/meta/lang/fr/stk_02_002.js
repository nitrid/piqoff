// Depo/Mağaza Arası Sevk
const stk_02_002 = 
{
    txtRefRefno : "Réf. Réf No",
    validRef : "Ligne-Colonne Ne Peut Pas Être Laissée Vide",
    cmbOutDepot: "Sortie Dépôt",
    cmbInDepot: "Entrée Dépot",
    dtDocDate : "Date",
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
    grdTrnsfItems: 
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
        title: "Veuillez Saisir MDP Administrateur pour accéder au Document ",
        Password : "Mot de passe",
        btnApprove : "Valider"
    },
    msgDocValid:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Veuillez saisir les en-tête avant l'achèvement !"
    },
    msgNotQuantity: 
    {
        title: "Attention",
        btn01: "Ok",
        msg: "La quantité présent au depôt ne peut être négatif ! Quantité max pouvant être saisie:" //BAK
    },
    msgDblDepot:
    {
        title: "Attention",
        btn01: "OK",
        msg: "Entrée et Sortie Dépôt ne peuvent être Identique !"
    },
    msgSave:
    {
        title: "Attention",
        btn01: "OK",
        btn02: "Abandonner",
        msg: "Êtes-vous sûr(e) de vouloir Enregistrer!"
    },
    msgSaveResult:
    {
        title: "Attention",
        btn01: "OK",
        msgSuccess: "Transfert Réussi et Enregistré Avec Succès. !",
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
        msg: "Êtes-vous sûr(e) de vouloir supprimer l'enregistrement ?"
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
        msg: "Produit Introuvable !!"
    },
    msgCombineItem:
    {
        title: "Attention",
        btn01: "Regrouper",
        btn02: "Nouvel Ajout",
        msg: "Produit Existant dans le Document ! Voulez-vous Combiner ?"
    },
    popDesign : 
    {
        title: "Choix du Désign",
        design : "Design" ,
        lang : "Langue Document" 
    },
    pg_txtBarcode : 
    {
        title : "Sélectionner Code-Barre",
        clmCode :  "Référence Produit",
        clmName : "Nom Produit",
        clmMulticode : "Référence Fournisseur",
        clmBarcode : "Code-Barre"
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
export default stk_02_002